import * as React from "react";
import { connect } from "react-redux";

import { Block } from "codechain-sdk/lib/primitives";

import ApiDispatcher from "./ApiDispatcher";
import { RootState } from "../../redux/actions";

interface StateProps {
    blocksByNumber: {
        [n: number]: Block;
    };
    blocksByHash: {
        [hash: string]: Block;
    };
}
interface Props {
    id: number | string;
    onBlock?: (b: Block) => void;
    onError?: (e: any) => void;
}

const reducer = (state: RootState, req: Props, res: any) => {
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

class RequestBlockInternal extends React.Component<Props & StateProps> {
    public componentWillMount() {
        const { id, blocksByNumber, blocksByHash, onBlock } = this.props;
        const cached = blocksByNumber[id] || blocksByHash[id];
        if (cached && onBlock) {
            onBlock(cached);
        }
    }

    public render() {
        const { id, blocksByNumber, blocksByHash, onBlock, onError } = this.props;
        const cached = blocksByNumber[id] || blocksByHash[id];
        if (!cached) {
            return <ApiDispatcher
                api={`block/${id}`}
                reducer={reducer}
                onSuccess={onBlock}
                onError={onError}
                requestProps={{ id }} />
        }
        return <div/>;
    }
}

const RequestBlock = connect((state: RootState) => ({
    blocksByNumber: state.blocksByNumber,
    blocksByHash: state.blocksByHash
}))(RequestBlockInternal);

export default RequestBlock;
