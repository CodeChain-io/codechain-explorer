import * as React from "react";

import { Block } from "codechain-sdk";

import BlockParcelList from "./BlockParcelList";
import BlockHeaderTable from "./BlockHeaderTable/BlockHeaderTable";

interface OwnProps {
    block: Block;
}

class BlockDetails extends React.Component<OwnProps> {
    public render() {
        const { block } = this.props;
        return (
            <div>
                <h2 className="mt-3">Block #{block.number}</h2>
                <h4>{block.hash.value}</h4>
                <h2 className="mt-3">Summary</h2>
                <BlockHeaderTable block={block} />
                <BlockParcelList parcels={block.parcels} />
            </div>
        );
    }
}

export default BlockDetails;
