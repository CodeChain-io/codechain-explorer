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
    miningReward: string;
}

export interface ParcelDoc {
    blockNumber: number | null;
    blockHash: string | null;
    parcelIndex: number | null;
    nonce: string;
    fee: string;
    networkId: string;
    sig: string;
    hash: string;
    action: ActionDoc;
    /* custom field for indexing */
    sender: string;
    timestamp: number;
    countOfTransaction: number;
    isRetracted: boolean;
}

export type ActionDoc =
    | ChangeShardStateDoc
    | PaymentDoc
    | SetRegularKeyDoc
    | CreateShardDoc;

export interface ChangeShardStateDoc {
    action: string;
    transactions: TransactionDoc[];
}

export interface PaymentDoc {
    action: string;
    receiver: string;
    amount: string;
    /* custom field for indexing */
    invoice?: boolean;
    errorType?: string;
}

export interface SetRegularKeyDoc {
    action: string;
    key: string;
    /* custom field for indexing */
    invoice?: boolean;
    errorType?: string;
}

export interface CreateShardDoc {
    action: string;
    /* custom field for indexing */
    invoice?: boolean;
    errorType?: string;
}

export type TransactionDoc =
    | AssetMintTransactionDoc
    | AssetTransferTransactionDoc;

export interface AssetSchemeDoc {
    metadata: string;
    registrar: string | null;
    amount: number | null;
    networkId: string;
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
        };
        networkId: string;
        metadata: string;
        registrar: string | null;
        nonce: number;
        hash: string;
        /* custom field for indexing */
        timestamp: number;
        assetName: string;
        parcelHash: string;
        blockNumber: number;
        parcelIndex: number;
        transactionIndex: number;
        invoice?: boolean;
        errorType?: string;
    };
    isRetracted: boolean;
}

export interface AssetTransferTransactionDoc {
    type: string;
    data: {
        networkId: string;
        burns: AssetTransferInputDoc[];
        inputs: AssetTransferInputDoc[];
        outputs: AssetTransferOutputDoc[];
        nonce: number;
        hash: string;
        /* custom field for indexing */
        timestamp: number;
        parcelHash: string;
        blockNumber: number;
        parcelIndex: number;
        transactionIndex: number;
        invoice?: boolean;
        errorType?: string;
    };
    isRetracted: boolean;
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

function getAssetSchemeDoc(
    transaction: AssetMintTransactionDoc
): AssetSchemeDoc {
    return {
        metadata: transaction.data.metadata,
        registrar: transaction.data.registrar,
        amount: transaction.data.output.amount,
        networkId: transaction.data.networkId
    };
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
};

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
};
