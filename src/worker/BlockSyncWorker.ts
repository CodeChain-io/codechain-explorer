import { scheduleJob, Job } from "node-schedule";
import { WorkerConfig } from "./";
import { CodeChainAgent } from "./CodeChainAgent";
import { ElasticSearchAgent } from "../db/ElasticSearchAgent";
import { Block, H256, ChangeShardState, Payment, SetRegularKey, AssetMintTransaction, AssetTransferTransaction, SignedParcel, Invoice } from "codechain-sdk/lib/core/classes";
import { BlockDoc, Type, ChangeShardStateDoc, PaymentDoc } from "../db/DocType";
import * as moment from "moment";
import * as _ from "lodash";
import { LogType } from "../db/actions/QueryLog";
import { BigNumber } from "bignumber.js";

export class BlockSyncWorker {
    private watchJob: Job;
    private config: WorkerConfig;
    private codeChainAgent: CodeChainAgent;
    private elasticSearchAgent: ElasticSearchAgent;

    private jobIsRunning: boolean;

    constructor(config: WorkerConfig, codeChainAgent: CodeChainAgent, elasticSearchAgent: ElasticSearchAgent) {
        this.config = config;
        this.codeChainAgent = codeChainAgent;
        this.elasticSearchAgent = elasticSearchAgent;
        this.jobIsRunning = false;
    }

    public start() {
        this.startSync();
    }

    public destroy() {
        if (this.watchJob) {
            this.watchJob.cancel(false);
            this.watchJob = null;
        }
    }

    private async startSync() {
        try {
            await this.sync();
        } catch (error) {
            console.error(error);
            return;
        }
        this.watchJob = scheduleJob(this.config.cron.blockWatch, async () => {
            if (this.jobIsRunning) {
                return;
            }
            this.jobIsRunning = true;
            try {
                await this.sync();
            } catch (error) {
                console.error(error);
            }
            this.jobIsRunning = false;
        });
    }

    private async sync() {
        console.log("================ sync start ==================");
        await this.elasticSearchAgent.checkIndexOrCreate();
        let latestSyncBlockNumber: number = await this.elasticSearchAgent.getLastBlockNumber();
        const latestCodechainBlockNumber: number = await this.codeChainAgent.getLastBlockNumber();
        if (latestSyncBlockNumber === -1) {
            console.log("There is no synchronized block");
        } else {
            console.log("lastest indexed block number : %d", latestSyncBlockNumber);
        }
        console.log("lastest codechain block number : %d", latestCodechainBlockNumber);
        while (latestSyncBlockNumber < latestCodechainBlockNumber) {
            const nextBlockIndex: number = latestSyncBlockNumber + 1;
            const nextBlock: Block = await this.codeChainAgent.getBlock(nextBlockIndex);
            if (latestSyncBlockNumber > 0) {
                const lastSyncBlock: BlockDoc = await this.elasticSearchAgent.getBlock(latestSyncBlockNumber);
                if (nextBlock.parentHash.value !== lastSyncBlock.hash) {
                    latestSyncBlockNumber = await this.checkRetractAndReturnSyncNumber(latestSyncBlockNumber);
                    continue;
                }
            }
            await this.indexingNewBlock(nextBlock);
            console.log("%d block is synchronized", nextBlockIndex);
            latestSyncBlockNumber = nextBlockIndex;
        }
        await this.indexingPendingParcel();
        console.log("================ sync done ===================\n");
    }

    private indexingPendingParcel = async () => {
        console.log("========== indexing pending parcels ==========");
        const pendingParcels = await this.codeChainAgent.getPendingParcels();
        const indexedParcels = await this.elasticSearchAgent.getAllOfCurrentPendingParcels();

        console.log("current indexed pending parcels : %d", indexedParcels.length);
        console.log("codechain pending parcels : %d", pendingParcels.length);

        // Update pending parcel status
        const pendingParcelHashList = _.map(pendingParcels, (p) => p.hash().value);
        const removedPendingParcels = _.filter(indexedParcels, indexedParcel => !_.includes(pendingParcelHashList, indexedParcel.parcel.hash));
        await Promise.all(_.map(removedPendingParcels, async (removedPendingParcel) => {
            const blockedParcel = await this.elasticSearchAgent.getParcel(new H256(removedPendingParcel.parcel.hash));
            if (blockedParcel) {
                return this.elasticSearchAgent.removePendingParcel(new H256(removedPendingParcel.parcel.hash));
            } else {
                return this.elasticSearchAgent.deadPendingParcel(new H256(removedPendingParcel.parcel.hash));
            }
        }));

        // Index new pending parcel
        const indexedPendingParcelHashList = _.map(indexedParcels, (p) => p.parcel.hash);
        const newPendingParcels = _.filter(pendingParcels, pendingParcel => !_.includes(indexedPendingParcelHashList, pendingParcel.hash().value));
        await Promise.all(_.map(newPendingParcels, async (pendingParcel) => {
            return this.elasticSearchAgent.indexPendingParcel(newPendingParcels, pendingParcel);
        }));

        // Revival pending parcel
        const deadPendingParcels = await this.elasticSearchAgent.getDeadPendingParcels();
        const deadPendingParcelHashList = _.map(deadPendingParcels, (p) => p.parcel.hash);
        const revivalPendingParcels = _.filter(pendingParcels, pendingParcel => _.includes(deadPendingParcelHashList, pendingParcel.hash().value));
        await Promise.all(_.map(revivalPendingParcels, async (revivalPendingParcel) => {
            return this.elasticSearchAgent.revialPendingParcel(revivalPendingParcel.hash());
        }));
    }

    private checkRetractAndReturnSyncNumber = async (currentBlockNumber): Promise<number> => {
        while (currentBlockNumber > -1) {
            const lastSynchronizedBlock: BlockDoc = await this.elasticSearchAgent.getBlock(currentBlockNumber);
            const codechainBlock: Block = await this.codeChainAgent.getBlock(currentBlockNumber);

            if (codechainBlock.hash.value === lastSynchronizedBlock.hash) {
                break;
            }

            console.log("%d block is retracted", currentBlockNumber);
            await this.retractBlock(lastSynchronizedBlock);
            currentBlockNumber--;
        }
        return currentBlockNumber;
    }

    private indexingNewBlock = async (nextBlock: Block) => {
        // indexing blocks
        await this.elasticSearchAgent.indexBlock(nextBlock, this.config.miningReward[process.env.CODECHAIN_CHAIN || "solo"]);
        // indexing parcels
        await Promise.all(_.map(nextBlock.parcels, (parcel) => this.elasticSearchAgent.indexParcel(nextBlock.parcels, parcel, nextBlock.timestamp)));

        // indexing transactions
        const indexTransactionJobs = [];
        _.each(nextBlock.parcels, parcel => {
            const action = parcel.unsigned.action;
            if (action instanceof ChangeShardState) {
                _.each(action.transactions, (transaction, i) => {
                    indexTransactionJobs.push(this.elasticSearchAgent.indexTransaction(action.transactions, transaction, nextBlock.timestamp, parcel, i));
                });
            }
        });
        await Promise.all(indexTransactionJobs);

        // index log
        const dateString = moment.unix(nextBlock.timestamp).utc().format("YYYY-MM-DD");
        await this.elasticSearchAgent.increaseLogCount(dateString, LogType.BLOCK_COUNT, 1);
        await this.elasticSearchAgent.increaseLogCount(dateString, LogType.BLOCK_MINING_COUNT, 1, nextBlock.author.value);

        const parcelCount = nextBlock.parcels.length;
        if (parcelCount > 0) {
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.PARCEL_COUNT, parcelCount);
            const paymentParcelCount = _.filter(nextBlock.parcels, p => p.unsigned.action instanceof Payment).length;
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.PARCEL_PAYMENT_COUNT, paymentParcelCount);
            const serRegularKeyParcelCount = _.filter(nextBlock.parcels, p => p.unsigned.action instanceof SetRegularKey).length;
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.PARCEL_SET_REGULAR_KEY_COUNT, serRegularKeyParcelCount);
            const changeShardStateParcelCount = _.filter(nextBlock.parcels, p => p.unsigned.action instanceof ChangeShardState).length;
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.PARCEL_CHANGE_SHARD_STATE_COUNT, changeShardStateParcelCount);
        }

        const txs = _.chain(nextBlock.parcels).filter(parcel => parcel.unsigned.action instanceof ChangeShardState)
            .flatMap(parcel => (parcel.unsigned.action as ChangeShardState).transactions).value();
        const txCount = txs.length
        if (txCount > 0) {
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.TX_COUNT, txCount);
            const assetMintTxCount = _.filter(txs, tx => tx instanceof AssetMintTransaction).length;
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.TX_ASSET_MINT_COUNT, assetMintTxCount);
            const assetTransferTxCount = _.filter(txs, tx => tx instanceof AssetTransferTransaction).length;
            await this.elasticSearchAgent.increaseLogCount(dateString, LogType.TX_ASSET_TRANSFER_COUNT, assetTransferTxCount);
        }

        // index genesis block
        if (nextBlock.number === 0) {
            const addressListJob = _.map(this.config.genesisAddressList[process.env.CODECHAIN_CHAIN || "solo"], async (address) => {
                const balance = await this.codeChainAgent.getBalance(address);
                return {
                    address,
                    balance: balance.value.toString(10)
                }
            })
            const addressList = await Promise.all(addressListJob);
            const updateAddressJob = _.map(addressList, address => this.elasticSearchAgent.increaseBalance(address.address, address.balance));
            await Promise.all(updateAddressJob);
        }

        // index account
        const blockMiner = nextBlock.author.value;
        const sumOfParcelFee = _.reduce(nextBlock.parcels, (memo, parcel) => new BigNumber(parcel.unsigned.fee.value.toString(10)).plus(memo), new BigNumber(0)).toString(10);
        const miningReward = new BigNumber(sumOfParcelFee).plus(new BigNumber(this.config.miningReward[process.env.CODECHAIN_CHAIN || "solo"])).toString(10);
        await this.elasticSearchAgent.increaseBalance(blockMiner, miningReward);

        const decreaseFeeJob = _.map(nextBlock.parcels, (parcel) => {
            const signer = parcel.getSignerAddress().value;
            const fee = parcel.unsigned.fee;
            return this.elasticSearchAgent.decreaseBalance(signer, fee.value.toString(10));
        });
        await Promise.all(decreaseFeeJob);

        const paymentParcels = _.filter(nextBlock.parcels, parcel => parcel.unsigned.action instanceof Payment);
        const succeedPaymentParcelJob = _.map(paymentParcels, async (parcel: SignedParcel) => {
            const invoices = await this.codeChainAgent.getParcelInvoice(parcel.hash()) as Invoice;
            if (invoices.success) {
                return parcel;
            } else {
                return null;
            }
        });
        const succeedPaymentParcels = _.compact(await Promise.all(succeedPaymentParcelJob));
        const changeBlanaceJob = _.map(succeedPaymentParcels, async (parcel) => {
            const action = parcel.unsigned.action as Payment;
            this.elasticSearchAgent.increaseBalance(action.receiver.value, action.amount.value.toString(10));
            this.elasticSearchAgent.decreaseBalance(parcel.getSignerAddress().value, action.amount.value.toString(10));
        });
        await Promise.all(changeBlanaceJob);
    }

    private retractBlock = async (lastSynchronizedBlock: BlockDoc) => {
        await this.elasticSearchAgent.retractBlock(new H256(lastSynchronizedBlock.hash));
        await Promise.all(_.map(lastSynchronizedBlock.parcels, async (parcel) => await this.elasticSearchAgent.retractParcel(new H256(parcel.hash))));

        const transactions = _.chain(lastSynchronizedBlock.parcels).filter(parcel => Type.isChangeShardStateDoc(parcel.action))
            .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions).value()
        await Promise.all(_.map(transactions, async (transaction) => await this.elasticSearchAgent.retractTransaction(new H256(transaction.data.hash))));

        // retract log
        const dateString = moment.unix(lastSynchronizedBlock.timestamp).utc().format("YYYY-MM-DD");
        await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.BLOCK_COUNT, 1);
        await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.BLOCK_MINING_COUNT, 1, lastSynchronizedBlock.author);
        const parcelCount = lastSynchronizedBlock.parcels.length;
        if (parcelCount > 0) {
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.PARCEL_COUNT, parcelCount);
            const paymentParcelCount = _.filter(lastSynchronizedBlock.parcels, p => Type.isPaymentDoc(p.action)).length;
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.PARCEL_PAYMENT_COUNT, paymentParcelCount);
            const setRegularKeyParcelCount = _.filter(lastSynchronizedBlock.parcels, p => Type.isSetRegularKeyDoc(p.action)).length;
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.PARCEL_SET_REGULAR_KEY_COUNT, setRegularKeyParcelCount);
            const changeShardStateParcelCount = _.filter(lastSynchronizedBlock.parcels, p => Type.isChangeShardStateDoc(p.action)).length;
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.PARCEL_CHANGE_SHARD_STATE_COUNT, changeShardStateParcelCount);
        }

        const txs = _.chain(lastSynchronizedBlock.parcels).filter(parcel => Type.isChangeShardStateDoc(parcel.action))
            .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions).value();
        const txCount = txs.length;
        if (txCount > 0) {
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.TX_COUNT, txCount);
            const assetMintTxCount = _.filter(txs, tx => Type.isAssetMintTransactionDoc(tx)).length;
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.TX_ASSET_MINT_COUNT, assetMintTxCount);
            const assetTransferTxCount = _.filter(txs, tx => Type.isAssetTransferTransactionDoc(tx)).length;
            await this.elasticSearchAgent.decreaseLogCount(dateString, LogType.TX_ASSET_TRANSFER_COUNT, assetTransferTxCount);
        }

        // retract account
        const blockMiner = lastSynchronizedBlock.author;
        await this.elasticSearchAgent.decreaseBalance(blockMiner, lastSynchronizedBlock.miningReward);

        const feeJob = _.map(lastSynchronizedBlock.parcels, (parcel) => {
            const signer = parcel.sender;
            const fee = parcel.fee;
            return this.elasticSearchAgent.increaseBalance(signer, fee);
        });
        await Promise.all(feeJob);

        const paymentParcels = _.filter(lastSynchronizedBlock.parcels, parcel => Type.isPaymentDoc(parcel.action));
        const succeedPaymentParcelJob = _.map(paymentParcels, async (parcel) => {
            const invoices = await this.codeChainAgent.getParcelInvoice(new H256(parcel.hash));
            if (invoices[0].success) {
                return parcel;
            } else {
                return null;
            }
        });
        const succeedPaymentParcels = _.compact(await Promise.all(succeedPaymentParcelJob));
        const changeBlanaceJob = _.map(succeedPaymentParcels, async (parcel) => {
            const action = parcel.action as PaymentDoc;
            this.elasticSearchAgent.decreaseBalance(action.receiver, action.amount);
            this.elasticSearchAgent.increaseBalance(parcel.sender, action.amount);
        });
        await Promise.all(changeBlanaceJob);
    }
}
