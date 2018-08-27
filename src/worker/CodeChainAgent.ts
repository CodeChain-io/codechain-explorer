import { Block, SignedParcel, Invoice, H256, U256, Transaction, AssetScheme } from "codechain-sdk/lib/core/classes";
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

    public getAssetSchemeByType = async (type: H256): Promise<AssetScheme> => {
        return this.sdk.rpc.chain.getAssetSchemeByType(type);
    }

    public getTransaction = async (hash: H256): Promise<Transaction> => {
        return this.sdk.rpc.chain.getTransaction(hash);
    }

    public getPendingParcels = async (): Promise<SignedParcel[]> => {
        return this.sdk.rpc.chain.getPendingParcels();
    }

    public getParcelInvoice = async (hash: H256): Promise<Invoice | Invoice[] | null> => {
        return this.sdk.rpc.chain.getParcelInvoice(hash);
    }

    public getBalance = async (address): Promise<U256> => {
        return this.sdk.rpc.chain.getBalance(address);
    }
}
