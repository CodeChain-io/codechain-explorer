import { Block, H256, Invoice, U256, AssetScheme, SignedParcel } from "codechain-sdk/lib/primitives";

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
    accountsByAddress: {
        [address: string]: {
            nonce: U256;
            balance: U256;
        }
    };
    assetSchemeByTxhash: {
        [txhash: string]: AssetScheme;
    };
    pendingParcels: {
        [hash: string]: SignedParcel;
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
    accountsByAddress: {},
    assetSchemeByTxhash: {},
    pendingParcels: {},
};

interface BestBlockNumberAction {
    type: "BEST_BLOCK_NUMBER_ACTION";
    data: number;
}

interface CacheBlockAction {
    type: "CACHE_BLOCK";
    data: Block;
};

type Action = BestBlockNumberAction | CacheBlockAction | ApiDispatcherResult;

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
    }

    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
