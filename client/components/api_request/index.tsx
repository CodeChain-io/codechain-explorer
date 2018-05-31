import * as React from "react";

import { H256, Invoice } from "codechain-sdk/lib/primitives";

import RequestBlockNumber from "./RequestBlockNumber";
import RequestBlock from "./RequestBlock";
import RequestParcel from "./RequestParcel";
import RequestAssetScheme from "./RequestAssetScheme";
import RequestAccount from "./RequestAccount";
import RequestPendingParcels from "./RequestPendingParcels";

import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../../redux/actions";

export { RequestParcel };
export { RequestBlockNumber };
export { RequestBlock };
export { RequestAssetScheme };
export { RequestAccount };
export { RequestPendingParcels };

const pingReducer = (state: RootState, __: undefined, res: string) => {
    return { isNodeAlive: res === "pong" };
};
export const RequestPing = () => (
    <ApiDispatcher
        api={"ping"}
        reducer={pingReducer} />
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

interface RequestTransactionInvoiceProps {
    hash: string;
}
const transactionInvoiceReducer = (state: RootState, req: RequestTransactionInvoiceProps, res: any) => {
    return {
        transactionInvoicesByHash: {
            ...state.transactionInvoicesByHash,
            [req.hash]: res && Invoice.fromJSON(res),
        }
    };
};
export const RequestTransactionInvoice = (props: RequestTransactionInvoiceProps) => (
    <ApiDispatcher
        api={`tx/${props.hash}/invoice`}
        reducer={transactionInvoiceReducer}
        requestProps={props} />
);
