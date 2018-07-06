import * as React from "react";

import { Block } from "codechain-sdk";

import BlockParcelList from "../BlockParcelList/BlockParcelList";
import BlockHeaderTable from "../BlockHeaderTable/BlockHeaderTable";

import "./BlockDetails.scss"

interface OwnProps {
    block: Block;
}

class BlockDetails extends React.Component<OwnProps> {
    public render() {
        const { block } = this.props;
        return (
            <div className="block-detail-container">
                <h3 className="mt-3">Block #{block.number}</h3>
                <h4 className="hash">0x{block.hash.value}</h4>
                <h3 className="mt-3">Summary</h3>
                <BlockHeaderTable block={block} />
                <BlockParcelList parcels={block.parcels} />
            </div>
        );
    }
}

export default BlockDetails;
