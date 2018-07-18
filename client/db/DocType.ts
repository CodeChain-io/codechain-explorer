import { Block, Transaction, SignedParcel, Action, ChangeShardState, SetRegularKey, CreateShard, Payment, AssetTransferTransaction, AssetMintTransaction, AssetTransferInput, AssetTransferOutput, H256, Asset, AssetScheme } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";
import { ElasticSearchAgent } from "./ElasticSearchAgent";

export interface BlockDoc {
    parentHash: string;
    timestamp: number;
    number: number;
    author: string;
    extraData: Buffer;
    parcelsRoot: string;
    stateRoot: string;
    invoicesRoot: string;
    score: string;
    seal: Buffer[];
    hash: string;
    parcels: ParcelDoc[];
    /* custom field for indexing */
    isRetracted: boolean;
}

export interface ParcelDoc {
    blockNumber: number | null;
    blockHash: string | null;
    parcelIndex: number | null;
    nonce: string;
    fee: string;
    networkId: number;
    sig: string;
    hash: string;
    action: ActionDoc;
    /* custom field for indexing */
    sender: string;
}

export type ActionDoc = ChangeShardStateDoc | PaymentDoc | SetRegularKeyDoc | CreateShardDoc

export interface ChangeShardStateDoc {
    action: string;
    transactions: TransactionDoc[]
}

export interface PaymentDoc {
    action: string;
    receiver: string;
    amount: string;
}

export interface SetRegularKeyDoc {
    action: string;
    key: string;
}

export interface CreateShardDoc {
    action: string;
}

export type TransactionDoc = AssetMintTransactionDoc | AssetTransferTransactionDoc;

export interface AssetSchemeDoc {
    metadata: string;
    registrar: string | null;
    amount: number | null;
    networkId: number;
}

export interface AssetBundleDoc {
    assetScheme: AssetSchemeDoc;
    asset: AssetDoc;
}

export interface AssetDoc {
    assetType: string;
    lockScriptHash: string;
    parameters: Buffer[];
    amount: number;
    transactionHash: string;
    transactionOutputIndex: number;
}

const fromAsset = (asset: Asset): AssetDoc => {
    return {
        assetType: asset.assetType.value,
        lockScriptHash: asset.lockScriptHash.value,
        parameters: asset.parameters,
        amount: asset.amount,
        transactionHash: asset.outPoint.transactionHash.value,
        transactionOutputIndex: asset.outPoint.index
    }
}

const fromAssetScheme = (assetScheme: AssetScheme) => {
    return {
        metadata: assetScheme.metadata,
        registrar: assetScheme.registrar,
        amount: assetScheme.amount,
        networkId: assetScheme.networkId
    }
}


export interface AssetMintTransactionDoc {
    type: string;
    data: {
        networkId: number;
        metadata: string;
        lockScriptHash: string;
        parameters: Buffer[];
        amount: number | null;
        registrar: string | null;
        nonce: number;
        hash: string;
        assetType: string;
        /* custom field for indexing */
        owner: string;
    };
}

export interface AssetTransferTransactionDoc {
    type: string;
    data: {
        networkId: number;
        burns: AssetTransferInputDoc[];
        inputs: AssetTransferInputDoc[];
        outputs: AssetTransferOutputDoc[];
        nonce: number;
        hash: string;
    };
}

export interface AssetTransferInputDoc {
    prevOut: {
        transactionHash: string;
        index: number;
        assetType: string;
        assetScheme: AssetSchemeDoc;
        amount: number;
        /* custom field for indexing */
        owner: string;
    };
    lockScript: Buffer;
    unlockScript: Buffer;
}

export interface AssetTransferOutputDoc {
    lockScriptHash: string;
    parameters: Buffer[];
    assetType: string;
    assetScheme: AssetSchemeDoc;
    amount: number;
    /* custom field for indexing */
    owner: string;
}

const fromAssetTransferInput = async (block: Block, assetTransferInput: AssetTransferInput, elasticSearchAgent: ElasticSearchAgent): Promise<AssetTransferInputDoc> => {
    const assetTransferInputJson = assetTransferInput.toJSON();
    const indexedTransaction = await elasticSearchAgent.getTransaction(new H256(assetTransferInputJson.prevOut.transactionHash));
    const transactionInCurrentBlock = _.chain(block.parcels).filter((parcel: SignedParcel) => parcel.unsigned.action instanceof ChangeShardState)
        .flatMap(parcel => (parcel.unsigned.action as ChangeShardState).transactions)
        .filter((transaction: Transaction) => transaction.hash().value === assetTransferInputJson.prevOut.transactionHash)
        .value();
    let owner = "";
    let foundTransaction;
    if (indexedTransaction) {
        foundTransaction = indexedTransaction;
    }
    if (transactionInCurrentBlock.length > 0) {
        foundTransaction = await fromTransaction(block, transactionInCurrentBlock[0], elasticSearchAgent);
    }
    if (foundTransaction && isAssetMintTransactionDoc(foundTransaction)) {
        owner = (foundTransaction as AssetMintTransactionDoc).data.owner;
    } else if (foundTransaction && isAssetTransferTransactionDoc(foundTransaction)) {
        owner = (foundTransaction as AssetTransferTransactionDoc).data.outputs[assetTransferInputJson.prevOut.index].owner;
    }
    const assetScheme = await getAssetScheme(assetTransferInputJson.prevOut.assetType, block, elasticSearchAgent);
    return {
        prevOut: {
            transactionHash: assetTransferInputJson.prevOut.transactionHash,
            index: assetTransferInputJson.prevOut.index,
            assetType: assetTransferInputJson.prevOut.assetType,
            assetScheme,
            amount: assetTransferInputJson.prevOut.amount,
            owner
        },
        lockScript: assetTransferInputJson.lockScript,
        unlockScript: assetTransferInputJson.unlockScript
    }
}

const getAssetScheme = async (assetType: string, block: Block, elasticSearchAgent: ElasticSearchAgent): Promise<AssetSchemeDoc> => {
    const indexedAssetScheme = await elasticSearchAgent.getAssetScheme(new H256(assetType));
    if (indexedAssetScheme) {
        return indexedAssetScheme
    }
    const transactionInCurrentBlock = _.chain(block.parcels).filter((parcel: SignedParcel) => parcel.unsigned.action instanceof ChangeShardState)
        .flatMap(parcel => (parcel.unsigned.action as ChangeShardState).transactions)
        .filter((transaction: Transaction) => transaction instanceof AssetMintTransaction)
        .find((transaction: AssetMintTransaction) => transaction.getAssetSchemeAddress().value === assetType)
        .value()
    if (transactionInCurrentBlock) {
        return (transactionInCurrentBlock as AssetMintTransaction).getAssetScheme().toJSON()
    }
    throw new Error("Invalid asset type");
}

const fromAssetTransferOutput = async (block: Block, assetTransferOutput: AssetTransferOutput, elasticSearchAgent: ElasticSearchAgent): Promise<AssetTransferOutputDoc> => {
    const assetTransferOutputJson = assetTransferOutput.toJSON();
    const assetScheme = await getAssetScheme(assetTransferOutputJson.assetType, block, elasticSearchAgent)
    return {
        lockScriptHash: assetTransferOutputJson.lockScriptHash,
        owner: assetTransferOutputJson.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? assetTransferOutputJson.parameters[0].toString("hex") : "",
        parameters: assetTransferOutputJson.parameters,
        assetType: assetTransferOutputJson.assetType,
        assetScheme,
        amount: assetTransferOutputJson.amount
    }
}

const fromTransaction = async (block: Block, transaction: Transaction, elasticSearchAgent: ElasticSearchAgent): Promise<TransactionDoc> => {
    if (transaction instanceof AssetMintTransaction) {
        const transactionJson = transaction.toJSON();
        return {
            type: transactionJson.type,
            data: {
                networkId: transactionJson.data.networkId,
                metadata: transactionJson.data.metadata,
                lockScriptHash: transactionJson.data.lockScriptHash,
                parameters: transactionJson.data.parameters,
                amount: transactionJson.data.amount,
                registrar: transactionJson.data.registrar,
                nonce: transactionJson.data.nonce,
                hash: transactionJson.data.hash,
                assetType: transaction.getAssetSchemeAddress().value,
                owner: transactionJson.data.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? transactionJson.data.parameters[0].toString("hex") : ""
            }
        }
    } else if (transaction instanceof AssetTransferTransaction) {
        const transactionJson = transaction.toJSON();
        const burns = await Promise.all(_.map(transaction.burns, burn => fromAssetTransferInput(block, burn, elasticSearchAgent)));
        const inputs = await Promise.all(_.map(transaction.inputs, input => fromAssetTransferInput(block, input, elasticSearchAgent)));
        const outputs = await Promise.all(_.map(transaction.outputs, output => fromAssetTransferOutput(block, output, elasticSearchAgent)));
        return {
            type: transactionJson.type,
            data: {
                networkId: transactionJson.data.networkId,
                burns,
                inputs,
                outputs,
                nonce: transactionJson.data.nonce,
                hash: transactionJson.data.hash
            }
        };
    }
    throw new Error("Unexpected transaction");
}

const fromAction = async (block: Block, action: Action, elasticSearchAgent: ElasticSearchAgent): Promise<ActionDoc> => {
    if (action instanceof ChangeShardState) {
        const actionJson = action.toJSON();
        const transactionDocs = await Promise.all(_.map(action.transactions, transaction => fromTransaction(block, transaction, elasticSearchAgent)));
        return {
            action: actionJson.action,
            transactions: transactionDocs
        }
    } else if (action instanceof SetRegularKey) {
        const actionJson = action.toJSON();
        return {
            action: actionJson.action,
            key: actionJson.key
        }
    } else if (action instanceof Payment) {
        const actionJson = action.toJSON();
        return {
            action: actionJson.action,
            receiver: actionJson.receiver,
            amount: actionJson.amount
        }
    } else if (action instanceof CreateShard) {
        const actionJson = action.toJSON();
        return {
            action: actionJson.action
        }
    }
    throw new Error("Unexpected action");
}

export const fromParcel = async (block: Block, parcel: SignedParcel, elasticSearchAgent: ElasticSearchAgent): Promise<ParcelDoc> => {
    const parcelJson = parcel.toJSON();
    const action = await fromAction(block, parcel.unsigned.action, elasticSearchAgent);
    return {
        blockNumber: parcelJson.blockNumber,
        blockHash: parcelJson.hash,
        parcelIndex: parcelJson.parcelIndex,
        nonce: parcelJson.nonce,
        fee: parcelJson.fee,
        networkId: parcelJson.networkId,
        sender: parcel.getSender().value,
        sig: parcelJson.sig,
        hash: parcelJson.hash,
        action
    }
}

export const fromBlock = async (block: Block, elasticSearchAgent: ElasticSearchAgent): Promise<BlockDoc> => {
    const blockJson = block.toJSON();
    const parcelDocs = await Promise.all(_.map(block.parcels, parcel => fromParcel(block, parcel, elasticSearchAgent)));

    return {
        parentHash: blockJson.parentHash,
        timestamp: blockJson.timestamp,
        number: blockJson.number,
        author: blockJson.author,
        extraData: blockJson.extraData,
        parcelsRoot: blockJson.parcelsRoot,
        stateRoot: blockJson.stateRoot,
        invoicesRoot: blockJson.invoicesRoot,
        score: blockJson.score,
        seal: blockJson.seal,
        hash: blockJson.hash,
        parcels: parcelDocs,
        isRetracted: false
    }
}

function isChangeShardStateDoc(action: ActionDoc) {
    return action.action === "changeShardState";
}

function isPaymentDoc(action: ActionDoc) {
    return action.action === "payment";
}

function isSetRegularKeyDoc(action: ActionDoc) {
    return action.action === "setRegularKey";
}

function isCreateShardDoc(action: ActionDoc) {
    return action.action === "createShard";
}

function isAssetTransferTransactionDoc(transaction: TransactionDoc) {
    return transaction.type === "assetTransfer";
}

function isAssetMintTransactionDoc(transaction: TransactionDoc) {
    return transaction.type === "assetMint";
}

function getAssetSchemeDoc(transaction: AssetMintTransactionDoc): AssetSchemeDoc {
    return {
        metadata: transaction.data.metadata,
        registrar: transaction.data.registrar,
        amount: transaction.data.amount,
        networkId: transaction.data.networkId
    }
}

export let Type = {
    isChangeShardStateDoc,
    isPaymentDoc,
    isSetRegularKeyDoc,
    isCreateShardDoc,
    isAssetTransferTransactionDoc,
    isAssetMintTransactionDoc,
    getAssetSchemeDoc
}

export let Converter = {
    fromBlock,
    fromAsset,
    fromAssetScheme,
}
