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

const initialState = {
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
} as RootState;

export const rootReducer = (state = initialState, action: any) => {
    const update = action.getUpdate ? action.getUpdate(state) : {};
    return {
        ...state,
        ...update
    };
};
