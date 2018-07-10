import { scheduleJob, Job } from "node-schedule";
import { WorkerConfig } from "./";
import { CodeChainAgent } from "./CodeChainAgent";
import { ElasticSearchAgent } from "./ElasticSearchAgent";
import { Block } from "codechain-sdk/lib/core/classes";

export class BlockSyncWorker {
    private watchJob: Job;
    private config: WorkerConfig;
    private codeChainAgent: CodeChainAgent;
    private elasticSearchAgent: ElasticSearchAgent;

    constructor(config: WorkerConfig, codeChainAgent: CodeChainAgent, elasticSearchAgent: ElasticSearchAgent) {
        this.config = config;
        this.codeChainAgent = codeChainAgent;
        this.elasticSearchAgent = elasticSearchAgent;
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
        this.watchJob = scheduleJob(this.config.cron.blockWatch, () => {
            this.sync();
        });
    }

    private async sync() {
        console.log("sync start");
        await this.elasticSearchAgent.checkIndexOrCreate();
        let latestSyncBlockNumber: number = await this.elasticSearchAgent.getLastBlockNumber();
        const latestCodechainBlockNumber: number = await this.codeChainAgent.getLastBlockNumber();
        if (latestSyncBlockNumber === -1) {
            console.log("There is no synchronized block");
        } else {
            console.log("lastSyncBlockNumber : %d", latestSyncBlockNumber);
        }
        console.log("lastCodechainBlockNumber : %d", latestCodechainBlockNumber);
        while (latestSyncBlockNumber < latestCodechainBlockNumber) {
            const nextBlockIndex: number = latestSyncBlockNumber + 1;
            const nextBlock: Block = await this.codeChainAgent.getBlock(nextBlockIndex);

            if (latestSyncBlockNumber > 0) {
                console.log("checking indexed block : %d", latestSyncBlockNumber);
                const lastSyncBlock: Block = await this.elasticSearchAgent.getBlock(latestSyncBlockNumber);
                console.log("indexed block hash : %s", lastSyncBlock.hash.value);
                console.log("codechain block hash : %s", nextBlock.parentHash.value);
                if (nextBlock.parentHash.value !== lastSyncBlock.hash.value) {
                    latestSyncBlockNumber = await this.checkRetractAndReturnSyncNumber(latestSyncBlockNumber);
                    continue;
                }
            }

            await this.elasticSearchAgent.addBlock(nextBlock);
            console.log("%d block is synchronized", nextBlockIndex);
            latestSyncBlockNumber = nextBlockIndex;
        }
        console.log("sync done");
    }

    private checkRetractAndReturnSyncNumber = async (currentBlockNumber): Promise<number> => {
        while (currentBlockNumber > -1) {
            const lastSynchronizedBlock: Block = await this.elasticSearchAgent.getBlock(currentBlockNumber);
            const codechainBlock: Block = await this.codeChainAgent.getBlock(currentBlockNumber);

            if (codechainBlock.hash.value === lastSynchronizedBlock.hash.value) {
                break;
            }

            console.log("%d block is retracted", currentBlockNumber);
            await this.elasticSearchAgent.retractBlock(lastSynchronizedBlock.hash);
            currentBlockNumber--;
        }
        return currentBlockNumber;
    }
}
