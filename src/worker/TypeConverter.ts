import { SignedParcel, Transaction, AssetTransferInput, H256, AssetTransferOutput, AssetMintTransaction, AssetTransferTransaction, Action, ChangeShardState, SetRegularKey, Payment, CreateShard, Block, U256, Invoice, AssetScheme } from "codechain-sdk/lib/core/classes";
import { ElasticSearchAgent } from "../db/ElasticSearchAgent";
import { AssetTransferAddress } from "codechain-sdk/lib/key/classes";
import { AssetTransferInputDoc, AssetTransferOutputDoc, TransactionDoc, ActionDoc, ParcelDoc, BlockDoc, PendingParcelDoc, AssetSchemeDoc, Type } from "../db/DocType";
import { CodeChainAgent } from "./CodeChainAgent";
import { BigNumber } from "bignumber.js";
import * as _ from "lodash";

class TypeConverter {
    private P2PKH_HASH = "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3";
    private elasticSearchAgent: ElasticSearchAgent;
    private codechainAgent: CodeChainAgent;

    public constructor(elasticSearchAgent: ElasticSearchAgent, codechainAgent: CodeChainAgent) {
        this.elasticSearchAgent = elasticSearchAgent;
        this.codechainAgent = codechainAgent;
    }

    public fromAssetTransferInput = async (assetTransferInput: AssetTransferInput): Promise<AssetTransferInputDoc> => {
        const assetScheme = await this.getAssetScheme(assetTransferInput.prevOut.assetType);
        let transaction = await this.codechainAgent.getTransaction(assetTransferInput.prevOut.transactionHash);
        if (!transaction) {
            const pendingParcels = await this.codechainAgent.getPendingParcels();
            const pendingTransactions = _.chain(pendingParcels).filter(parcel => parcel.unsigned.action instanceof ChangeShardState)
                .flatMap(parcel => (parcel.unsigned.action as ChangeShardState).transactions)
                .value();
            transaction = _.find(pendingTransactions, tx => (tx as Transaction).hash().value === assetTransferInput.prevOut.transactionHash.value);
        }

        let owner = "";
        if (transaction instanceof AssetMintTransaction) {
            if (transaction.output.lockScriptHash.value === this.P2PKH_HASH) {
                owner = AssetTransferAddress.fromPublicKeyHash(new H256(Buffer.from(transaction.output.parameters[0]).toString("hex"))).value;
            }
        } else if (transaction instanceof AssetTransferTransaction) {
            if (transaction.outputs[assetTransferInput.prevOut.index].lockScriptHash.value === this.P2PKH_HASH) {
                owner = AssetTransferAddress.fromPublicKeyHash(new H256(Buffer.from(transaction.outputs[assetTransferInput.prevOut.index].parameters[0]).toString("hex"))).value;
            }
        } else {
            throw new Error("Unexpected transaction");
        }
        return {
            prevOut: {
                transactionHash: assetTransferInput.prevOut.transactionHash.value,
                index: assetTransferInput.prevOut.index,
                assetType: assetTransferInput.prevOut.assetType.value,
                assetScheme,
                amount: assetTransferInput.prevOut.amount,
                owner
            },
            lockScript: assetTransferInput.lockScript,
            unlockScript: assetTransferInput.unlockScript
        }
    }

    public fromAssetTransferOutput = async (assetTransferOutput: AssetTransferOutput): Promise<AssetTransferOutputDoc> => {
        const assetScheme = await this.getAssetScheme(assetTransferOutput.assetType);
        return {
            lockScriptHash: assetTransferOutput.lockScriptHash.value,
            owner: assetTransferOutput.lockScriptHash.value === this.P2PKH_HASH ? AssetTransferAddress.fromPublicKeyHash(new H256(Buffer.from(assetTransferOutput.parameters[0]).toString("hex"))).value : "",
            parameters: _.map(assetTransferOutput.parameters, p => Buffer.from(p)),
            assetType: assetTransferOutput.assetType.value,
            assetScheme,
            amount: assetTransferOutput.amount
        }
    }

    public fromTransaction = async (transaction: Transaction, timestamp: number, parcel: SignedParcel, transactionIndex: number): Promise<TransactionDoc> => {
        const parcelInvoice = await this.codechainAgent.getParcelInvoice(parcel.hash());
        const transactionInvoice = parcelInvoice ? (parcelInvoice as Invoice[])[transactionIndex] : undefined;
        if (transaction instanceof AssetMintTransaction) {
            const metadata = Type.getMetadata(transaction.metadata);
            return {
                type: transaction.type,
                data: {
                    output: {
                        lockScriptHash: transaction.output.lockScriptHash.value,
                        parameters: _.map(transaction.output.parameters, p => Buffer.from(p)),
                        amount: transaction.output.amount,
                        assetType: transaction.getAssetSchemeAddress().value,
                        owner: transaction.output.lockScriptHash.value === this.P2PKH_HASH ? AssetTransferAddress.fromPublicKeyHash(new H256(Buffer.from(transaction.output.parameters[0]).toString("hex"))).value : ""
                    },
                    networkId: transaction.networkId,
                    metadata: transaction.metadata,
                    registrar: transaction.registrar ? transaction.registrar.value : "",
                    nonce: transaction.nonce,
                    hash: transaction.hash().value,
                    timestamp,
                    assetName: metadata.name || "",
                    parcelHash: parcel ? parcel.hash().value : "",
                    blockNumber: parcel ? parcel.blockNumber || 0 : 0,
                    parcelIndex: parcel ? parcel.parcelIndex || 0 : 0,
                    transactionIndex,
                    invoice: transactionInvoice ? transactionInvoice.success : undefined,
                    errorType: transactionInvoice ? (transactionInvoice.error ? transactionInvoice.error.type : "") : undefined
                },
                isRetracted: false
            }
        } else if (transaction instanceof AssetTransferTransaction) {
            const transactionJson = transaction.toJSON();
            const burns = await Promise.all(_.map(transaction.burns, burn => this.fromAssetTransferInput(burn)));
            const inputs = await Promise.all(_.map(transaction.inputs, input => this.fromAssetTransferInput(input)));
            const outputs = await Promise.all(_.map(transaction.outputs, output => this.fromAssetTransferOutput(output)));
            return {
                type: transactionJson.type,
                data: {
                    networkId: transactionJson.data.networkId,
                    burns,
                    inputs,
                    outputs,
                    nonce: transactionJson.data.nonce,
                    hash: transaction.hash().value,
                    timestamp,
                    parcelHash: parcel ? parcel.hash().value : "",
                    blockNumber: parcel ? parcel.blockNumber || 0 : 0,
                    parcelIndex: parcel ? parcel.parcelIndex || 0 : 0,
                    transactionIndex,
                    invoice: transactionInvoice ? transactionInvoice.success : undefined,
                    errorType: transactionInvoice ? (transactionInvoice.error ? transactionInvoice.error.type : "") : undefined
                },
                isRetracted: false
            };
        }
        throw new Error("Unexpected transaction");
    }

    public fromAction = async (action: Action, timestamp: number, parcel: SignedParcel): Promise<ActionDoc> => {
        if (action instanceof ChangeShardState) {
            const actionJson = action.toJSON();
            const transactionDocs = await Promise.all(_.map(action.transactions, (transaction, i) => this.fromTransaction(transaction, timestamp, parcel, i)));
            return {
                action: actionJson.action,
                transactions: transactionDocs
            }
        } else if (action instanceof SetRegularKey) {
            const parcelInvoice = await this.codechainAgent.getParcelInvoice(parcel.hash()) as Invoice;
            const actionJson = action.toJSON();
            return {
                action: actionJson.action,
                key: actionJson.key,
                invoice: parcelInvoice ? parcelInvoice.success : undefined,
                errorType: parcelInvoice ? (parcelInvoice.error ? parcelInvoice.error.type : "") : undefined
            }
        } else if (action instanceof Payment) {
            const actionJson = action.toJSON();
            const parcelInvoice = await this.codechainAgent.getParcelInvoice(parcel.hash()) as Invoice;
            return {
                action: actionJson.action,
                receiver: actionJson.receiver,
                amount: actionJson.amount,
                invoice: parcelInvoice ? parcelInvoice.success : undefined,
                errorType: parcelInvoice ? (parcelInvoice.error ? parcelInvoice.error.type : "") : undefined
            }
        } else if (action instanceof CreateShard) {
            const actionJson = action.toJSON();
            const parcelInvoice = await this.codechainAgent.getParcelInvoice(parcel.hash()) as Invoice;
            return {
                action: actionJson.action,
                invoice: parcelInvoice ? parcelInvoice.success : undefined,
                errorType: parcelInvoice ? (parcelInvoice.error ? parcelInvoice.error.type : "") : undefined
            }
        }
        throw new Error("Unexpected action");
    }

    public fromParcel = async (parcel: SignedParcel, timestamp: number): Promise<ParcelDoc> => {
        const action = await this.fromAction(parcel.unsigned.action, timestamp, parcel);
        return {
            blockNumber: parcel.blockNumber,
            blockHash: parcel.hash().value,
            parcelIndex: parcel.parcelIndex,
            nonce: parcel.unsigned.nonce.value.toString(10),
            fee: parcel.unsigned.fee.value.toString(10),
            networkId: parcel.unsigned.networkId,
            sender: parcel.getSignerAddress().value,
            sig: parcel.toJSON().sig,
            hash: parcel.hash().value,
            action,
            timestamp,
            countOfTransaction: parcel.unsigned.action instanceof ChangeShardState ? parcel.unsigned.action.transactions.length : 0,
            isRetracted: false
        }
    }

    public fromBlock = async (block: Block, defaultMiningReward: number): Promise<BlockDoc> => {
        const blockJson = block.toJSON();
        const parcelDocs = await Promise.all(_.map(block.parcels, parcel => this.fromParcel(parcel, block.timestamp)));
        const miningReward = _.reduce(block.parcels, (memo, parcel) => new BigNumber((parcel.unsigned.fee as U256).value.toString(10)).plus(memo), new BigNumber(0)).div(Math.pow(10, 9)).plus(defaultMiningReward).toString(10)
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
            isRetracted: false,
            miningReward
        }
    }

    public fromPendingParcel = async (parcel: SignedParcel): Promise<PendingParcelDoc> => {
        const parcelDoc = await this.fromParcel(parcel, 0);
        return {
            parcel: parcelDoc,
            status: "pending",
            timestamp: Math.floor(Date.now() / 1000)
        }
    }

    private fromAssetScheme = (assetScheme: AssetScheme): AssetSchemeDoc => {
        return {
            metadata: assetScheme.metadata,
            registrar: assetScheme.registrar ? assetScheme.registrar.value : "",
            amount: assetScheme.amount,
            networkId: assetScheme.networkId
        }
    }

    private getAssetScheme = async (assetType: H256): Promise<AssetSchemeDoc> => {
        const assetScheme = await this.codechainAgent.getAssetSchemeByType(assetType);
        if (assetScheme) {
            return this.fromAssetScheme(assetScheme);
        }
        const pendingParcels = await this.codechainAgent.getPendingParcels();
        const pendingMintTransactions = _.chain(pendingParcels).filter(parcel => parcel.unsigned.action instanceof ChangeShardState)
            .flatMap(parcel => (parcel.unsigned.action as ChangeShardState).transactions)
            .filter(transaction => transaction instanceof AssetMintTransaction)
            .map(tx => tx as AssetMintTransaction)
            .value();
        const mintTransaction = _.find(pendingMintTransactions, (tx: AssetMintTransaction) => tx.getAssetSchemeAddress().value === assetType.value)
        if (mintTransaction) {
            return this.fromAssetScheme(mintTransaction.getAssetScheme());
        }
        throw new Error("Invalid asset type");
    }
}

export default TypeConverter;
