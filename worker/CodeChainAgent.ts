import { Block } from "codechain-sdk/lib/primitives";
import { SDK } from "codechain-sdk";

export class CodeChainAgent {
    private sdk: SDK;
    constructor(host) {
        this.sdk = new SDK(host);
    }

    public getLastBlockNumber = async (): Promise<number> => {
        return this.sdk.getBlockNumber();
    }

    public getBlock = async (blockNumber): Promise<Block> => {
        let blockHash = await this.sdk.getBlockHash(blockNumber);
        return this.sdk.getBlock(blockHash);
    }
}
