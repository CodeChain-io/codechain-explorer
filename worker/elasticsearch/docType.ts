import { Block } from "codechain-sdk/lib/primitives";

export interface BlockDocValue {
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
    isRetracted: boolean;
}

export class BlockDoc {
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
    isRetracted: boolean;

    constructor(data: BlockDocValue) {
        const { parentHash, timestamp, number, author, extraData,
            parcelsRoot, stateRoot, invoicesRoot, score, seal, hash, parcels } = data;
        this.parentHash = parentHash;
        this.timestamp = timestamp;
        this.number = number;
        this.author = author;
        this.extraData = extraData;
        this.parcelsRoot = parcelsRoot;
        this.stateRoot = stateRoot;
        this.invoicesRoot = invoicesRoot;
        this.score = score;
        this.seal = seal;
        this.hash = hash;
        this.parcels = parcels;
        this.isRetracted = false;
    }

    static fromBlock(block: Block): BlockDoc {
        return new BlockDoc(block.toJSON() as any);
    }
}

export class ParcelDoc {
    v: number;
    r: string;
    s: string;
    blockNumber: number;
    blockHash: string;
    parcelIndex: number;
    nonce: string;
    fee: string;
    transactions: TransactionDoc[];
    networkId: string;
}

export class PaymentTransactionDoc {
    hash: string;
    nonce: string;
    sender: string;
    receiver: string;
    value: string;
}

export class SetRegularKeyTransactionDoc {
    address: string;
    nonce: string;
    key: string;
}

export class AssetMintTransactionDoc {
    metadata: string;
    lockScriptHash: string;
    parameters: Buffer[];
    amount: number | null;
    registrar: string | null;
    nonce: number;
}

export class AssetTransferTransactionDoc {
    networkId: number;
    inputs: {
        prevOut: {
            transactionHash: string;
            index: number;
            assetType: string;
            amount: number;
        };
        lockScript: Buffer;
        unlockScript: Buffer;
    }[];
    outputs: {
        lockScriptHash: string;
        parameters: Buffer[];
        assetType: string;
        amount: number;
    }[];
    nonce: number;
}

export declare type TransactionDoc = PaymentTransactionDoc | SetRegularKeyTransactionDoc | AssetMintTransactionDoc | AssetTransferTransactionDoc;
