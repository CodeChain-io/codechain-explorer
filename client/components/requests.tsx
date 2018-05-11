import * as React from "react";
import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../redux/actions";

type PingResponse = string;
const pingReducer = (state: RootState, _: undefined, res: PingResponse) => {
    return { isNodeAlive: res === "pong" };
};
export const RequestPing = () => (
    <ApiDispatcher
        api={"ping"}
        reducer={pingReducer} />
);

type BlockNumberResponse = number;
const blockNumberReducer = (state: RootState, _: undefined, res: BlockNumberResponse) => {
    return { bestBlockNumber: res };
};
export const RequestBlockNumber = () => (
    <ApiDispatcher
        api={"blockNumber"}
        reducer={blockNumberReducer} />
);

interface RequestBlockHashProps {
    num: number;
}
type BlockHashResponse = string;
const blockHashReducer = (state: RootState, req: RequestBlockHashProps, res: BlockHashResponse) => {
    return {
        blockHashesByNumber: {
            ...state.blockHashesByNumber,
            [req.num]: res,
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
type BlockResponse = any;
const blockReducer = (state: RootState, req: RequestBlockProps, res: BlockResponse) => {
    return {
        blocksByNumber: {
            ...state.blocksByNumber,
            [res.number]: res,
        },
        blocksByHash: {
            ...state.blocksByHash,
            [res.hash]: res,
        }
    };
};
export const RequestBlock = (props: RequestBlockProps) => (
    <ApiDispatcher
        api={`block/${props.id}`}
        reducer={blockReducer}
        requestProps={props} />
);

interface RequestTransactionProps {
    hash: string;
}
type TransactionResponse = any;
const transactionReducer = (state: RootState, req: RequestTransactionProps, res: TransactionResponse) => {
    return {
        transactionsByHash: {
            ...state.transactionsByHash,
            [req.hash]: res
        }
    };
};
export const RequestTransaction = (props: RequestTransactionProps) => (
    <ApiDispatcher
        api={`tx/${props.hash}`}
        reducer={transactionReducer}
        requestProps={props} />
);
