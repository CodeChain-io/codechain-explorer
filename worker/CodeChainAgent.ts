import { Block, SignedParcel } from "codechain-sdk/lib/core/classes";
import { SDK } from "codechain-sdk";

export class CodeChainAgent {
    private sdk: SDK;
    constructor(host) {
        this.sdk = new SDK({ server: host });
    }

    public getLastBlockNumber = async (): Promise<number> => {
        return this.sdk.rpc.chain.getBestBlockNumber();
    }

    public getBlock = async (blockNumber): Promise<Block> => {
        const blockHash = await this.sdk.rpc.chain.getBlockHash(blockNumber);
        return this.sdk.rpc.chain.getBlock(blockHash);
    }

    public getPendingParcels = async (): Promise<SignedParcel[]> => {
        return this.sdk.rpc.chain.getPendingParcels();
    }
}
