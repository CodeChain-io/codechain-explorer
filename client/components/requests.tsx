import * as React from "react";
import * as _ from "lodash";

import { Block, SignedParcel, AssetScheme, U256, H256, Invoice } from "codechain-sdk/lib/primitives";

import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../redux/actions";

const pingReducer = (state: RootState, __: undefined, res: string) => {
    return { isNodeAlive: res === "pong" };
};
export const RequestPing = () => (
    <ApiDispatcher
        api={"ping"}
        reducer={pingReducer} />
);

const blockNumberReducer = (state: RootState, __: undefined, res: string) => {
    return { bestBlockNumber: Number.parseInt(res) };
};
export const RequestBlockNumber = () => (
    <ApiDispatcher
        api={"blockNumber"}
        reducer={blockNumberReducer} />
);

interface RequestBlockHashProps {
    num: number;
}
const blockHashReducer = (state: RootState, req: RequestBlockHashProps, res: string) => {
    return {
        blockHashesByNumber: {
            ...state.blockHashesByNumber,
            [req.num]: new H256(res),
        }
    }
}
export const RequestBlockHash = (props: RequestBlockHashProps) => {
    return <ApiDispatcher
        api={`block/${props.num}/hash`}
        reducer={blockHashReducer}
        requestProps={props} />
}

interface RequestBlockProps {
    id: number | string;
}
const blockReducer = (state: RootState, req: RequestBlockProps, res: any) => {
    const block = Block.fromJSON(res);
    return {
        blocksByNumber: {
            ...state.blocksByNumber,
            [res.number]: block,
        },
        blocksByHash: {
            ...state.blocksByHash,
            [res.hash]: block,
        }
    };
};
export const RequestBlock = (props: RequestBlockProps) => (
    <ApiDispatcher
        api={`block/${props.id}`}
        reducer={blockReducer}
        requestProps={props} />
);

interface RequestParcelProps {
    hash: string;
}
const parcelReducer = (state: RootState, req: RequestParcelProps, res: any) => {
    const parcel = SignedParcel.fromJSON(res);
    return {
        parcelByHash: {
            ...state.parcelByHash,
            [req.hash]: parcel
        }
    };
};
export const RequestParcel = (props: RequestParcelProps) => (
    <ApiDispatcher
        api={`parcel/${props.hash}`}
        reducer={parcelReducer}
        requestProps={props} />
);

interface RequestTransactionInvoiceProps {
    hash: string;
}
const transactionInvoiceReducer = (state: RootState, req: RequestTransactionInvoiceProps, res: any) => {
    const invoice = Invoice.fromJSON(res);
    return {
        transactionInvoicesByHash: {
            ...state.transactionInvoicesByHash,
            [req.hash]: invoice
        }
    };
};
export const RequestTransactionInvoice = (props: RequestTransactionInvoiceProps) => (
    <ApiDispatcher
        api={`tx/${props.hash}/invoice`}
        reducer={transactionInvoiceReducer}
        requestProps={props} />
);

interface RequestAccountProps {
    address: string;
}
export const RequestAccount = (props: RequestAccountProps) => {
    const reducer = (state: RootState, req: RequestAccountProps, res: any) => {
        const { nonce, balance } = res;
        return {
            accountsByAddress: {
                ...state.accountsByAddress,
                [req.address]: {
                    nonce: new U256(nonce),
                    balance: new U256(balance),
                }
            }
        };
    };
    return <ApiDispatcher
        api={`account/${props.address}`}
        reducer={reducer}
        requestProps={props} />
};

interface RequestAssetSchemeProps {
    txhash: string;
}
export const RequestAssetScheme = (props: RequestAssetSchemeProps) => {
    const reducer = (state: RootState, req: RequestAssetSchemeProps, res: any) => {
        const assetScheme = AssetScheme.fromJSON(res);
        return {
            assetSchemeByTxhash: {
                ...state.assetSchemeByTxhash,
                [req.txhash]: assetScheme
            }
        };
    };
    return <ApiDispatcher
        api={`asset/${props.txhash}`}
        reducer={reducer}
        requestProps={props} />
}

export const RequestPendingParcels = () => {
    const reducer = (state: RootState, __: undefined, res: any[]) => {
        const parcels = res.map(p => SignedParcel.fromJSON(p));
        return {
            pendingParcels: {
                ...state.pendingParcels,
                ..._.keyBy(parcels, parcel => parcel.hash().value)
            }
        };
    };
    return <ApiDispatcher
        api={`parcel/pending`}
        reducer={reducer} />
};
