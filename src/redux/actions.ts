import { AssetSchemeDoc, BlockDoc, TransactionDoc } from "codechain-indexer-types";
import { loadingBarReducer } from "react-redux-loading-bar";
import { combineReducers } from "redux";
import { getCurrentTimestamp } from "../utils/Time";

export interface RootState {
    appReducer: AppReducer;
}

interface AppReducer {
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: {
            data: BlockDoc;
            updatedAt: number;
        };
    };
    blocksByHash: {
        [hash: string]: {
            data: BlockDoc;
            updatedAt: number;
        };
    };
    transactionByHash: {
        [hash: string]: {
            data: TransactionDoc;
            updatedAt: number;
        };
    };
    assetSchemeByAssetType: {
        [assetType: string]: {
            data: AssetSchemeDoc;
            updatedAt: number;
        };
    };
}

const initialState: AppReducer = {
    bestBlockNumber: undefined,
    blocksByNumber: {},
    blocksByHash: {},
    assetSchemeByAssetType: {},
    transactionByHash: {}
};

interface BestBlockNumberAction {
    type: "BEST_BLOCK_NUMBER_ACTION";
    data: number;
}

interface CacheBlockAction {
    type: "CACHE_BLOCK";
    data: BlockDoc;
}

interface CacheTransactionAction {
    type: "CACHE_TRANSACTION";
    data: TransactionDoc;
}

interface CacheAssetSchemeAction {
    type: "CACHE_ASSET_SCHEME";
    data: {
        assetType: string;
        assetScheme: AssetSchemeDoc;
    };
}

type Action = BestBlockNumberAction | CacheAssetSchemeAction | CacheBlockAction | CacheTransactionAction;

const appReducer = (state = initialState, action: Action) => {
    if (action.type === "BEST_BLOCK_NUMBER_ACTION") {
        return { ...state, bestBlockNumber: action.data };
    } else if (action.type === "CACHE_BLOCK") {
        const { number: n, hash } = action.data as BlockDoc;
        const blocksByNumber = {
            ...state.blocksByNumber,
            [n]: { data: action.data, updatedAt: getCurrentTimestamp() }
        };
        const blocksByHash = { ...state.blocksByHash, [hash]: { data: action.data, updatedAt: getCurrentTimestamp() } };
        return { ...state, blocksByNumber, blocksByHash };
    } else if (action.type === "CACHE_TRANSACTION") {
        const transaction = action.data as TransactionDoc;
        const transactionByHash = {
            ...state.transactionByHash,
            [transaction.hash]: { data: transaction, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, transactionByHash };
    } else if (action.type === "CACHE_ASSET_SCHEME") {
        const { assetType, assetScheme } = (action as CacheAssetSchemeAction).data;
        const assetSchemeByAssetType = {
            ...state.assetSchemeByAssetType,
            [assetType]: { data: assetScheme, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, assetSchemeByAssetType };
    } else {
        return state;
    }
};

export const rootReducer = combineReducers({
    appReducer,
    loadingBar: loadingBarReducer
});
