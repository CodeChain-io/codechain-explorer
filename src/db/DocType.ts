import { Block, Transaction, SignedParcel, Action, ChangeShardState, SetRegularKey, CreateShard, Payment, AssetTransferTransaction, AssetMintTransaction, AssetTransferInput, AssetTransferOutput, H256 } from "codechain-sdk/lib/core/classes";
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
    timestamp: number;
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

/*
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
*/

export interface AssetMintTransactionDoc {
    type: string;
    data: {
        output: {
            lockScriptHash: string;
            parameters: Buffer[];
            amount: number | null;
            /* custom field for indexing */
            owner: string;
            assetType: string;
        }
        networkId: number;
        metadata: string;
        registrar: string | null;
        nonce: number;
        hash: string;
        /* custom field for indexing */
        timestamp: number;
        assetName: string;
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
        /* custom field for indexing */
        timestamp: number;
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

export interface PendingParcelDoc {
    parcel: ParcelDoc;
    status: string;
    timestamp: number;
}

export interface PendingTransactionDoc {
    transaction: TransactionDoc;
    status: string;
    timestamp: number;
}

const fromAssetTransferInput = async (currentTransactions: Transaction[], assetTransferInput: AssetTransferInput, elasticSearchAgent: ElasticSearchAgent, timestamp: number): Promise<AssetTransferInputDoc> => {
    const assetTransferInputJson = assetTransferInput.toJSON();
    const indexedTransaction = await elasticSearchAgent.getTransaction(new H256(assetTransferInputJson.prevOut.transactionHash));
    const transactionInCurrentBlock = _.find(currentTransactions, transaction => transaction.hash().value === assetTransferInputJson.prevOut.transactionHash);
    let owner = "";
    let foundTransaction;
    if (indexedTransaction) {
        foundTransaction = indexedTransaction;
    }
    if (transactionInCurrentBlock) {
        foundTransaction = await fromTransaction(currentTransactions, transactionInCurrentBlock, elasticSearchAgent, timestamp);
    }
    if (foundTransaction && isAssetMintTransactionDoc(foundTransaction)) {
        owner = (foundTransaction as AssetMintTransactionDoc).data.output.owner;
    } else if (foundTransaction && isAssetTransferTransactionDoc(foundTransaction)) {
        owner = (foundTransaction as AssetTransferTransactionDoc).data.outputs[assetTransferInputJson.prevOut.index].owner;
    }
    const assetScheme = await getAssetScheme(currentTransactions, assetTransferInputJson.prevOut.assetType, elasticSearchAgent);
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

const getAssetScheme = async (currentTransactions: Transaction[], assetType: string, elasticSearchAgent: ElasticSearchAgent): Promise<AssetSchemeDoc> => {
    const indexedAssetScheme = await elasticSearchAgent.getAssetScheme(new H256(assetType));
    if (indexedAssetScheme) {
        return indexedAssetScheme
    }
    const transactionInCurrentBlock = _.chain(currentTransactions).filter((transaction: Transaction) => transaction instanceof AssetMintTransaction)
        .find((transaction: AssetMintTransaction) => transaction.getAssetSchemeAddress().value === assetType)
        .value()
    if (transactionInCurrentBlock) {
        return (transactionInCurrentBlock as AssetMintTransaction).getAssetScheme().toJSON()
    }
    throw new Error("Invalid asset type");
}

const fromAssetTransferOutput = async (currentTransactions: Transaction[], assetTransferOutput: AssetTransferOutput, elasticSearchAgent: ElasticSearchAgent): Promise<AssetTransferOutputDoc> => {
    const assetTransferOutputJson = assetTransferOutput.toJSON();
    const assetScheme = await getAssetScheme(currentTransactions, assetTransferOutputJson.assetType, elasticSearchAgent)
    return {
        lockScriptHash: assetTransferOutputJson.lockScriptHash,
        owner: assetTransferOutputJson.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? assetTransferOutputJson.parameters[0].toString("hex") : "",
        parameters: assetTransferOutputJson.parameters,
        assetType: assetTransferOutputJson.assetType,
        assetScheme,
        amount: assetTransferOutputJson.amount
    }
}

const fromTransaction = async (currentTransactions: Transaction[], transaction: Transaction, elasticSearchAgent: ElasticSearchAgent, timestamp: number): Promise<TransactionDoc> => {
    if (transaction instanceof AssetMintTransaction) {
        const transactionJson = transaction.toJSON();
        const metadata = getMetadata(transactionJson.data.metadata);
        return {
            type: transactionJson.type,
            data: {
                output: {
                    lockScriptHash: transactionJson.data.output.lockScriptHash,
                    parameters: transactionJson.data.output.parameters,
                    amount: transactionJson.data.output.amount,
                    assetType: transaction.getAssetSchemeAddress().value,
                    owner: transactionJson.data.output.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? transactionJson.data.output.parameters[0].toString("hex") : ""
                },
                networkId: transactionJson.data.networkId,
                metadata: transactionJson.data.metadata,
                registrar: transactionJson.data.registrar,
                nonce: transactionJson.data.nonce,
                hash: transactionJson.data.hash,
                timestamp,
                assetName: metadata.name || ""
            }
        }
    } else if (transaction instanceof AssetTransferTransaction) {
        const transactionJson = transaction.toJSON();
        const burns = await Promise.all(_.map(transaction.burns, burn => fromAssetTransferInput(currentTransactions, burn, elasticSearchAgent, timestamp)));
        const inputs = await Promise.all(_.map(transaction.inputs, input => fromAssetTransferInput(currentTransactions, input, elasticSearchAgent, timestamp)));
        const outputs = await Promise.all(_.map(transaction.outputs, output => fromAssetTransferOutput(currentTransactions, output, elasticSearchAgent)));
        return {
            type: transactionJson.type,
            data: {
                networkId: transactionJson.data.networkId,
                burns,
                inputs,
                outputs,
                nonce: transactionJson.data.nonce,
                hash: transactionJson.data.hash,
                timestamp
            }
        };
    }
    throw new Error("Unexpected transaction");
}

const fromAction = async (currentActions: Action[], action: Action, elasticSearchAgent: ElasticSearchAgent, timestamp: number): Promise<ActionDoc> => {
    if (action instanceof ChangeShardState) {
        const actionJson = action.toJSON();
        const currentTransactions = _.chain(currentActions).filter(currentAction => currentAction instanceof ChangeShardState)
            .flatMap(currentAction => (currentAction as ChangeShardState).transactions).value()
        const transactionDocs = await Promise.all(_.map(action.transactions, transaction => fromTransaction(currentTransactions, transaction, elasticSearchAgent, timestamp)));
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

const fromParcel = async (currentParcels: SignedParcel[], parcel: SignedParcel, elasticSearchAgent: ElasticSearchAgent, timestamp: number): Promise<ParcelDoc> => {
    const parcelJson = parcel.toJSON();
    const action = await fromAction(_.map(currentParcels, p => p.unsigned.action), parcel.unsigned.action, elasticSearchAgent, timestamp);
    return {
        blockNumber: parcelJson.blockNumber,
        blockHash: parcelJson.hash,
        parcelIndex: parcelJson.parcelIndex,
        nonce: parcelJson.nonce,
        fee: parcelJson.fee,
        networkId: parcelJson.networkId,
        sender: parcel.getSignerAccountId().value,
        sig: parcelJson.sig,
        hash: parcelJson.hash,
        action,
        timestamp
    }
}

export const fromBlock = async (block: Block, elasticSearchAgent: ElasticSearchAgent): Promise<BlockDoc> => {
    const blockJson = block.toJSON();
    const parcelDocs = await Promise.all(_.map(block.parcels, parcel => fromParcel(block.parcels, parcel, elasticSearchAgent, block.timestamp)));

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

export const fromPendingParcel = async (otherPendingParcels: SignedParcel[], parcel: SignedParcel, elasticSearchAgent: ElasticSearchAgent): Promise<PendingParcelDoc> => {
    const parcelDoc = await fromParcel(otherPendingParcels, parcel, elasticSearchAgent, 0);
    return {
        parcel: parcelDoc,
        status: "pending",
        timestamp: Math.floor(Date.now() / 1000)
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
        amount: transaction.data.output.amount,
        networkId: transaction.data.networkId
    }
}

function isH256String(data: string) {
    const regexp = /^(0x)?[0-9a-fA-F]+$/;
    return regexp.test(data) && (data.length === 64 || data.length === 66);
}

export interface MetadataFormat {
    name?: string;
    description?: string;
    icon_url?: string;
}

const getMetadata = (data: string): MetadataFormat => {
    try {
        return JSON.parse(data);
    } catch (e) {
        // nothing
    }
    return {};
}

export let Type = {
    isChangeShardStateDoc,
    isPaymentDoc,
    isSetRegularKeyDoc,
    isCreateShardDoc,
    isAssetTransferTransactionDoc,
    isAssetMintTransactionDoc,
    getAssetSchemeDoc,
    getMetadata,
    isH256String
}

export let Converter = {
    fromBlock,
    fromPendingParcel
}
