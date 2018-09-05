import { Block, H256, Invoice } from "codechain-sdk/lib/core/classes";
import * as fs from "fs-extra";
import * as _ from "lodash";
import * as moment from "moment";
import { Job, scheduleJob } from "node-schedule";
import * as path from "path";
import * as sharp from "sharp";
import { LogType } from "../db/actions/QueryLog";
import { AssetMintTransactionDoc, BlockDoc, ChangeShardStateDoc, PaymentDoc, Type } from "../db/DocType";
import { ElasticSearchAgent } from "../db/ElasticSearchAgent";
import { WorkerConfig } from "./";
import { CodeChainAgent } from "./CodeChainAgent";
import TypeConverter from "./TypeConverter";
const request = require("request-promise-native");
const mkdirp = require("mkdirp-promise");

export class BlockSyncWorker {
    private watchJob: Job;
    private config: WorkerConfig;
    private codeChainAgent: CodeChainAgent;
    private elasticSearchAgent: ElasticSearchAgent;
    private typeConverter: TypeConverter;

    private jobIsRunning: boolean;

    constructor(
        config: WorkerConfig,
        codeChainAgent: CodeChainAgent,
        elasticSearchAgent: ElasticSearchAgent,
        typeConverter: TypeConverter
    ) {
        this.config = config;
        this.codeChainAgent = codeChainAgent;
        this.elasticSearchAgent = elasticSearchAgent;
        this.typeConverter = typeConverter;
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
        const pendingParcelHashList = _.map(pendingParcels, p => p.hash().value);
        const removedPendingParcels = _.filter(
            indexedParcels,
            indexedParcel => !_.includes(pendingParcelHashList, indexedParcel.parcel.hash)
        );
        await Promise.all(
            _.map(removedPendingParcels, async removedPendingParcel => {
                const blockedParcel = await this.elasticSearchAgent.getParcel(
                    new H256(removedPendingParcel.parcel.hash)
                );
                if (blockedParcel) {
                    return this.elasticSearchAgent.removePendingParcel(new H256(removedPendingParcel.parcel.hash));
                } else {
                    const mintTxs = Type.getMintTransactionsByParcel(removedPendingParcel.parcel);
                    for (const mintTx of mintTxs) {
                        await this.handleAssetImage(mintTx as AssetMintTransactionDoc, true);
                    }
                    return this.elasticSearchAgent.deadPendingParcel(new H256(removedPendingParcel.parcel.hash));
                }
            })
        );

        // Index new pending parcel
        const indexedPendingParcelHashList = _.map(indexedParcels, p => p.parcel.hash);
        const newPendingParcels = _.filter(
            pendingParcels,
            pendingParcel => !_.includes(indexedPendingParcelHashList, pendingParcel.hash().value)
        );
        await Promise.all(
            _.map(newPendingParcels, async pendingParcel => {
                const pendingParcelDoc = await this.typeConverter.fromPendingParcel(pendingParcel);
                const mintTxs = Type.getMintTransactionsByParcel(pendingParcelDoc.parcel);
                for (const mintTx of mintTxs) {
                    await this.handleAssetImage(mintTx as AssetMintTransactionDoc, false);
                }
                return this.elasticSearchAgent.indexPendingParcel(pendingParcelDoc);
            })
        );

        // Revival pending parcel
        const deadPendingParcels = await this.elasticSearchAgent.getDeadPendingParcels();
        const deadPendingParcelHashList = _.map(deadPendingParcels, p => p.parcel.hash);
        const revivalPendingParcels = _.filter(pendingParcels, pendingParcel =>
            _.includes(deadPendingParcelHashList, pendingParcel.hash().value)
        );
        await Promise.all(
            _.map(revivalPendingParcels, async revivalPendingParcel => {
                const pendingParcelDoc = await this.typeConverter.fromPendingParcel(revivalPendingParcel);
                const mintTxs = Type.getMintTransactionsByParcel(pendingParcelDoc.parcel);
                for (const mintTx of mintTxs) {
                    await this.handleAssetImage(mintTx as AssetMintTransactionDoc, true);
                }
                return this.elasticSearchAgent.revialPendingParcel(new H256(pendingParcelDoc.parcel.hash));
            })
        );
    };

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
    };

    private indexingNewBlock = async (nextBlock: Block) => {
        const blockDoc = await this.typeConverter.fromBlock(
            nextBlock,
            this.config.miningReward[process.env.CODECHAIN_CHAIN || "solo"]
        );
        await this.elasticSearchAgent.indexBlock(blockDoc);
        if (blockDoc.number === 0) {
            await this.handleGenesisBlock(false);
        }
        await Promise.all(
            _.map(blockDoc.parcels, async parcel => {
                return this.elasticSearchAgent.indexParcel(parcel);
            })
        );
        const transactions = Type.getTransactionsByBlock(blockDoc);
        await Promise.all(
            _.map(transactions, async transaction => await this.elasticSearchAgent.indexTransaction(transaction))
        );
        const assetMintTransactions = _.filter(transactions, tx => Type.isAssetMintTransactionDoc(tx));
        for (const mintTx of assetMintTransactions) {
            await this.handleAssetImage(mintTx as AssetMintTransactionDoc, false);
        }

        await this.handleLogData(blockDoc, false);
        await this.handleBalance(blockDoc, false);
    };

    private retractBlock = async (retractedBlock: BlockDoc) => {
        await this.elasticSearchAgent.retractBlock(new H256(retractedBlock.hash));
        if (retractedBlock.number === 0) {
            await this.handleGenesisBlock(true);
        }
        await Promise.all(
            _.map(
                retractedBlock.parcels,
                async parcel => await this.elasticSearchAgent.retractParcel(new H256(parcel.hash))
            )
        );
        const transactions = Type.getTransactionsByBlock(retractedBlock);
        await Promise.all(
            _.map(
                transactions,
                async transaction => await this.elasticSearchAgent.retractTransaction(new H256(transaction.data.hash))
            )
        );
        await this.handleLogData(retractedBlock, true);
        await this.handleBalance(retractedBlock, true);
    };

    private queryLog = async (
        isRetract: boolean,
        dateString: string,
        logType: LogType,
        count: number,
        value?: string
    ) => {
        if (isRetract) {
            await this.elasticSearchAgent.decreaseLogCount(dateString, logType, count, value);
        } else {
            await this.elasticSearchAgent.increaseLogCount(dateString, logType, count, value);
        }
    };

    private handleLogData = async (blockDoc: BlockDoc, isRetract: boolean) => {
        const dateString = moment
            .unix(blockDoc.timestamp)
            .utc()
            .format("YYYY-MM-DD");
        await this.queryLog(isRetract, dateString, LogType.BLOCK_COUNT, 1);
        await this.queryLog(isRetract, dateString, LogType.BLOCK_MINING_COUNT, 1, blockDoc.author);
        const parcelCount = blockDoc.parcels.length;
        if (parcelCount > 0) {
            await this.queryLog(isRetract, dateString, LogType.PARCEL_COUNT, parcelCount);
            const paymentParcelCount = _.filter(blockDoc.parcels, p => Type.isPaymentDoc(p.action)).length;
            await this.queryLog(isRetract, dateString, LogType.PARCEL_PAYMENT_COUNT, paymentParcelCount);
            const serRegularKeyParcelCount = _.filter(blockDoc.parcels, p => Type.isSetRegularKeyDoc(p.action)).length;
            await this.queryLog(isRetract, dateString, LogType.PARCEL_SET_REGULAR_KEY_COUNT, serRegularKeyParcelCount);
            const changeShardStateParcelCount = _.filter(blockDoc.parcels, p => Type.isChangeShardStateDoc(p.action))
                .length;
            await this.queryLog(
                isRetract,
                dateString,
                LogType.PARCEL_CHANGE_SHARD_STATE_COUNT,
                changeShardStateParcelCount
            );
        }
        const transactions = Type.getTransactionsByBlock(blockDoc);
        const txCount = transactions.length;
        if (txCount > 0) {
            await this.queryLog(isRetract, dateString, LogType.TX_COUNT, txCount);
            const assetMintTxCount = _.filter(transactions, tx => Type.isAssetMintTransactionDoc(tx)).length;
            await this.queryLog(isRetract, dateString, LogType.TX_ASSET_MINT_COUNT, assetMintTxCount);
            const assetTransferTxCount = _.filter(transactions, tx => Type.isAssetTransferTransactionDoc(tx)).length;
            await this.queryLog(isRetract, dateString, LogType.TX_ASSET_TRANSFER_COUNT, assetTransferTxCount);
        }
    };

    private handleBalance = async (blockDoc, isRetract: boolean) => {
        if (isRetract) {
            await this.elasticSearchAgent.decreaseBalance(blockDoc.author, blockDoc.miningReward);
        } else {
            await this.elasticSearchAgent.increaseBalance(blockDoc.author, blockDoc.miningReward);
        }
        for (const parcel of blockDoc.parcels) {
            if (isRetract) {
                await this.elasticSearchAgent.increaseBalance(parcel.sender, parcel.fee);
            } else {
                await this.elasticSearchAgent.decreaseBalance(parcel.sender, parcel.fee);
            }
        }
        const paymentParcels = _.filter(blockDoc.parcels, parcel => Type.isPaymentDoc(parcel.action));
        const succeedPaymentParcelJob = _.map(paymentParcels, async parcel => {
            const invoices = (await this.codeChainAgent.getParcelInvoice(new H256(parcel.hash))) as Invoice;
            if (invoices.success) {
                return parcel;
            } else {
                return null;
            }
        });
        const succeedPaymentParcels = _.compact(await Promise.all(succeedPaymentParcelJob));
        for (const parcel of succeedPaymentParcels) {
            const paymentAction = parcel.action as PaymentDoc;
            if (isRetract) {
                await this.elasticSearchAgent.decreaseBalance(paymentAction.receiver, paymentAction.amount);
                await this.elasticSearchAgent.increaseBalance(parcel.sender, paymentAction.amount);
            } else {
                await this.elasticSearchAgent.increaseBalance(paymentAction.receiver, paymentAction.amount);
                await this.elasticSearchAgent.decreaseBalance(parcel.sender, paymentAction.amount);
            }
        }
    };

    private handleAssetImage = async (assetMintTx: AssetMintTransactionDoc, isRetract: boolean) => {
        const metadata = Type.getMetadata(assetMintTx.data.metadata);
        if (!metadata || !metadata.icon_url) {
            return;
        }
        const iconUrl = metadata.icon_url;
        const imageDir = path.join(__dirname, "../../", "/download/assetImage");
        const imagePath = path.join(imageDir, `${assetMintTx.data.output.assetType}.png`);
        if (!isRetract) {
            try {
                await mkdirp(imageDir);
                const isExists = await fs.pathExists(imagePath);
                if (!isExists) {
                    const imageBuffer = await request({ url: iconUrl, encoding: null });
                    await sharp(imageBuffer)
                        .resize(65, 65)
                        .png()
                        .toFile(imagePath);
                }
            } catch (e) {
                // nothing
            }
        } else {
            try {
                await fs.remove(imagePath);
            } catch (e) {
                // nothing
            }
        }
    };

    private handleGenesisBlock = async (isRetract: boolean) => {
        const addressListJob = _.map(
            this.config.genesisAddressList[process.env.CODECHAIN_CHAIN || "solo"],
            async address => {
                const balance = await this.codeChainAgent.getBalance(address, 0);
                return {
                    address,
                    balance: balance.value.toString(10)
                };
            }
        );
        const addressList = await Promise.all(addressListJob);
        const updateAddressJob = _.map(
            addressList,
            address =>
                isRetract
                    ? this.elasticSearchAgent.decreaseBalance(address.address, address.balance)
                    : this.elasticSearchAgent.increaseBalance(address.address, address.balance)
        );
        await Promise.all(updateAddressJob);
    };
}
