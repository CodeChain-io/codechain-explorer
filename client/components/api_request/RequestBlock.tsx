import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Block } from "codechain-sdk/lib/primitives";

import { apiRequest } from "./ApiRequest";
import { RootState } from "../../redux/actions";

interface OwnProps {
    id: number | string;
    onBlock: (b: Block) => void;
    onError: (e: any) => void;
}

interface StateProps {
    cached: Block;
}

interface DispatchProps {
    dispatch: Dispatch;
}

class RequestBlockInternal extends React.Component<OwnProps & StateProps & DispatchProps> {
    public componentWillMount() {
        const { cached, dispatch, onError, onBlock, id } = this.props;
        if (cached) {
            onBlock(cached);
        }
        apiRequest({ path: `block/${id}` }).then(response => {
            const block = Block.fromJSON(response);
            dispatch({
                type: "CACHE_BLOCK",
                data: block
            });
            onBlock(block);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestBlock = connect((state: RootState, props: OwnProps) => {
    const { blocksByHash, blocksByNumber } = state;
    const { id } = props;
    return {
        cached: blocksByNumber[id] || blocksByHash[id]
    };
})(RequestBlockInternal);

export default RequestBlock;
