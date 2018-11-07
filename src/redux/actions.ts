import {
    AssetSchemeDoc,
    BlockDoc,
    ParcelDoc,
    PendingParcelDoc,
    PendingTransactionDoc,
    TransactionDoc
} from "codechain-indexer-types/lib/types";
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
    parcelByHash: {
        [hash: string]: {
            data: ParcelDoc;
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
    pendingParcelByHash: {
        [hash: string]: {
            data: PendingParcelDoc;
            updatedAt: number;
        };
    };
    pendingTransactionByHash: {
        [hash: string]: {
            data: PendingTransactionDoc;
            updatedAt: number;
        };
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
    pendingParcelByHash: {},
    pendingTransactionByHash: {},
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

interface CachePendingParcelAction {
    type: "CACHE_PENDING_PARCEL";
    data: PendingParcelDoc;
}

interface CachePendingTransactionAction {
    type: "CACHE_PENDING_TRANSACTION";
    data: PendingTransactionDoc;
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
    | MoveToSectionAction
    | CachePendingTransactionAction
    | CachePendingParcelAction;

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
    } else if (action.type === "CACHE_PARCEL") {
        const parcel = action.data as ParcelDoc;
        const parcelByHash = {
            ...state.parcelByHash,
            [parcel.hash]: { data: parcel, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, parcelByHash };
    } else if (action.type === "CACHE_TRANSACTION") {
        const transaction = action.data as TransactionDoc;
        const transactionByHash = {
            ...state.transactionByHash,
            [transaction.data.hash]: { data: transaction, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, transactionByHash };
    } else if (action.type === "CACHE_PENDING_PARCEL") {
        const pendingParcel = action.data as PendingParcelDoc;
        const pendingParcelByHash = {
            ...state.transactionByHash,
            [pendingParcel.parcel.hash]: { data: pendingParcel, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, pendingParcelByHash };
    } else if (action.type === "CACHE_PENDING_TRANSACTION") {
        const pendingTransaction = action.data as PendingTransactionDoc;
        const pendingTransactionByHash = {
            ...state.transactionByHash,
            [pendingTransaction.transaction.data.hash]: { data: pendingTransaction, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, pendingTransactionByHash };
    } else if (action.type === "CACHE_ASSET_SCHEME") {
        const { assetType, assetScheme } = (action as CacheAssetSchemeAction).data;
        const assetSchemeByAssetType = {
            ...state.assetSchemeByAssetType,
            [assetType]: { data: assetScheme, updatedAt: getCurrentTimestamp() }
        };
        return { ...state, assetSchemeByAssetType };
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
