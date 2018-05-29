import * as React from "react";

import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../../redux/actions";

interface Props {
    onStart?: () => void;
    onFinish?: (n: number) => void;
    onError?: (e: any) => void;
    setRootState?: boolean;
}

const reducer = (state: RootState, __: undefined, res: string) => {
    return { bestBlockNumber: Number.parseInt(res) };
};

const RequestBlockNumber = (props: Props) => {
    return <ApiDispatcher
        api={"blockNumber"}
        reducer={props.setRootState ? reducer : () => ({})}
        onStart={props.onStart}
        onFinish={props.onFinish}
        onError={props.onError} />
};

export default RequestBlockNumber;
