import * as React from "react";

import { H256 } from "codechain-sdk/lib/primitives";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    blockNumber: number;
    onBlockHash: (hash: H256) => void;
    onNotFound: () => void;
    onError: (e: ApiError) => void;
}

class RequestBlockHash extends React.Component<OwnProps> {
    public componentWillMount() {
        const { blockNumber, onBlockHash, onNotFound, onError } = this.props;
        apiRequest({ path: `block/${blockNumber}/hash` }).then((response: string) => {
            if (!response) {
                return onNotFound();
            }
            onBlockHash(new H256(response));
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestBlockHash;
