import * as React from "react";
import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../redux/actions";

type PingResponse = string;
const pingReducer = (state: RootState, res: PingResponse) => {
    return { isNodeAlive: res === "pong" };
};

export const RequestPing = () => <ApiDispatcher api={"ping"} reducer={pingReducer}/>

type BlockNumberResponse = number;
const blockNumberReducer = (state: RootState, res: BlockNumberResponse) => {
    return { bestBlockNumber: res };
};
export const RequestBlockNumber = () => <ApiDispatcher api={"blockNumber"} reducer={blockNumberReducer}/>

interface RequestBlockProps {
    number: number;
}
type BlockResponse = any;
const blockReducer = (state: RootState, res: BlockResponse) => {
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
export const RequestBlock = (props: RequestBlockProps) => <ApiDispatcher api={`block/${props.number}`} reducer={blockReducer} />