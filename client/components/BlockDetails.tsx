import * as React from "react";
import { RootState } from "../redux/actions";
import { connect } from "react-redux";
import BlockHeaderTable from "./BlockHeaderTable";
import { RequestBlock } from "./requests";
import BlockTransactionList from "./BlockTransactionList";

interface Props {
    // FIXME: blockNumber or blockHash
    blockNumber: number;
}

interface StateProps {
    blocksByNumber: {
        [n: number]: any;
    };
}

class BlockDetailsInternal extends React.Component<Props & StateProps> {
    public render() {
        const { blockNumber, blocksByNumber } = this.props;
        const block = blocksByNumber[blockNumber];
        if (!block) {
            return <RequestBlock id={blockNumber} />
        }

        return (
            <div>
                <BlockHeaderTable block={block} />
                <BlockTransactionList transactions={block.transactions} />
            </div>
        );
    }
}

const BlockDetails = connect((state: RootState) => {
    return {
        blocksByNumber: state.blocksByNumber
    } as StateProps;
})(BlockDetailsInternal);

export default BlockDetails;
