import { Block, H256, Invoice, AssetScheme, SignedParcel } from "codechain-sdk/lib/primitives";

export interface RootState {
    isNodeAlive?: boolean;
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: Block;
    };
    blocksByHash: {
        [hash: string]: Block;
    };
    blockHashesByNumber: {
        [n: number]: H256;
    };
    parcelByHash: {
        [hash: string]: SignedParcel;
    };
    transactionInvoicesByHash: {
        [hash: string]: Invoice;
    };
    assetSchemeByTxhash: {
        [txhash: string]: AssetScheme;
    };
}

const initialState: RootState = {
    isNodeAlive: undefined,
    bestBlockNumber: undefined,
    blocksByNumber: {},
    blocksByHash: {},
    blockHashesByNumber: {},
    parcelByHash: {},
    transactionInvoicesByHash: {},
    assetSchemeByTxhash: {},
};

interface BestBlockNumberAction {
    type: "BEST_BLOCK_NUMBER_ACTION";
    data: number;
}

interface CacheBlockAction {
    type: "CACHE_BLOCK";
    data: Block;
};

interface CacheParcelAction {
    type: "CACHE_PARCEL";
    data: SignedParcel;
}

interface CacheAssetSchemeAction {
    type: "CACHE_ASSET_SCHEME";
    data: {
        txhash: string;
        assetScheme: AssetScheme;
    };
}

type Action = BestBlockNumberAction | CacheAssetSchemeAction | CacheBlockAction | CacheParcelAction | ApiDispatcherResult;

interface ApiDispatcherResult {
    type: "API_DISPATCHER_OK" | "API_DISPATCHER_ERROR";
    getUpdate: (state: RootState) => Partial<RootState>;
}

export const rootReducer = (state = initialState, action: any | Action) => {
    if (action.type === "BEST_BLOCK_NUMBER_ACTION") {
        return { ...state, bestBlockNumber: action.data }
    } else if (action.type === "CACHE_BLOCK") {
        const { number: n, hash } = action.data as Block;
        const blocksByNumber = { ...state.blocksByNumber, [n]: action.data };
        const blocksByHash = { ...state.blocksByNumber, [hash.value]: action.data };
        return { ...state, blocksByNumber, blocksByHash };
    } else if (action.type === "CACHE_PARCEL") {
        const parcel = action.data as SignedParcel;
        const parcelByHash = { ...state.parcelByHash, [parcel.hash().value]: parcel };
        return { ...state, parcelByHash };
    } else if (action.type === "CACHE_ASSET_SCHEME") {
        const { txhash, assetScheme } = (action as CacheAssetSchemeAction).data;
        const assetSchemeByTxhash = { ...state.assetSchemeByTxhash, [txhash]: assetScheme };
        return { ...state, assetSchemeByTxhash };
    }

    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
