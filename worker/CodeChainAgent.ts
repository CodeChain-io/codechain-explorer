import { Block, SDK } from "codechain-sdk";

export class CodeChainAgent {
    private sdk: SDK;
    constructor(host) {
        this.sdk = new SDK({ server: host });
    }

    public getLastBlockNumber = async (): Promise<number> => {
        return this.sdk.getBestBlockNumber();
    }

    public getBlock = async (blockNumber): Promise<Block> => {
        const blockHash = await this.sdk.getBlockHash(blockNumber);
        return this.sdk.getBlock(blockHash);
    }
}
