import { AssetSchemeDoc, BlockDoc, ParcelDoc, TransactionDoc } from "codechain-es/lib/types";
import { loadingBarReducer } from "react-redux-loading-bar";
import { combineReducers } from "redux";

export interface RootState {
    appReducer: AppReducer;
}

interface AppReducer {
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: BlockDoc;
    };
    blocksByHash: {
        [hash: string]: BlockDoc;
    };
    parcelByHash: {
        [hash: string]: ParcelDoc;
    };
    transactionByHash: {
        [hash: string]: TransactionDoc;
    };
    assetSchemeByAssetType: {
        [assetType: string]: AssetSchemeDoc;
    };
    transactionsByAssetType: {
        [assetType: string]: TransactionDoc[];
    };
    moveToSectionRef?: string;
}

const initialState: AppReducer = {
    bestBlockNumber: undefined,
    blocksByNumber: {},
    blocksByHash: {},
    parcelByHash: {},
    assetSchemeByAssetType: {},
    transactionByHash: {},
    transactionsByAssetType: {},
    moveToSectionRef: undefined
};

interface BestBlockNumberAction {
    type: "BEST_BLOCK_NUMBER_ACTION";
    data: number;
}

interface CacheBlockAction {
    type: "CACHE_BLOCK";
    data: BlockDoc;
}

interface CacheParcelAction {
    type: "CACHE_PARCEL";
    data: ParcelDoc;
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

interface CacheAssetTransactionsAction {
    type: "CACHE_ASSET_TRANSACTIONS";
    data: {
        assetType: string;
        transactions: TransactionDoc[];
    };
}

interface MoveToSectionAction {
    type: "MOVE_TO_SECTION";
    data: string;
}

type Action =
    | BestBlockNumberAction
    | CacheAssetSchemeAction
    | CacheBlockAction
    | CacheParcelAction
    | CacheTransactionAction
    | CacheAssetTransactionsAction
    | MoveToSectionAction;

const appReducer = (state = initialState, action: Action) => {
    if (action.type === "BEST_BLOCK_NUMBER_ACTION") {
        return { ...state, bestBlockNumber: action.data };
    } else if (action.type === "CACHE_BLOCK") {
        const { number: n, hash } = action.data as BlockDoc;
        const blocksByNumber = { ...state.blocksByNumber, [n]: action.data };
        const blocksByHash = { ...state.blocksByHash, [hash]: action.data };
        return { ...state, blocksByNumber, blocksByHash };
    } else if (action.type === "CACHE_PARCEL") {
        const parcel = action.data as ParcelDoc;
        const parcelByHash = { ...state.parcelByHash, [parcel.hash]: parcel };
        return { ...state, parcelByHash };
    } else if (action.type === "CACHE_TRANSACTION") {
        const transaction = action.data as TransactionDoc;
        const transactionByHash = {
            ...state.transactionByHash,
            [transaction.data.hash]: transaction
        };
        return { ...state, transactionByHash };
    } else if (action.type === "CACHE_ASSET_SCHEME") {
        const { assetType, assetScheme } = (action as CacheAssetSchemeAction).data;
        const assetSchemeByAssetType = {
            ...state.assetSchemeByAssetType,
            [assetType]: assetScheme
        };
        return { ...state, assetSchemeByAssetType };
    } else if (action.type === "CACHE_ASSET_TRANSACTIONS") {
        const { assetType, transactions } = (action as CacheAssetTransactionsAction).data;
        const transactionsByAssetType = {
            ...state.transactionsByAssetType,
            [assetType]: transactions
        };
        return { ...state, transactionsByAssetType };
    } else if (action.type === "MOVE_TO_SECTION") {
        return { ...state, moveToSectionRef: action.data };
    } else {
        return state;
    }
};

export const rootReducer = combineReducers({
    appReducer,
    loadingBar: loadingBarReducer
});
