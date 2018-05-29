import * as React from "react";
import { RootState } from "../redux/actions";
import { connect } from "react-redux";

import { Block } from "codechain-sdk/lib/primitives";

import { RequestBlock } from "./api_request";
import BlockParcelList from "./BlockParcelList";
import BlockHeaderTable from "./BlockHeaderTable";

interface Props {
    // FIXME: blockNumber or blockHash
    blockNumber: number;
}

interface StateProps {
    blocksByNumber: {
        [n: number]: Block;
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
                <BlockParcelList parcels={block.parcels} />
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
