import * as React from "react";

import { Block } from "codechain-sdk";

import BlockParcelList from "./BlockParcelList";
import BlockHeaderTable from "./BlockHeaderTable";

interface OwnProps {
    block: Block;
}

class BlockDetails extends React.Component<OwnProps> {
    public render() {
        const { block } = this.props;
        return (
            <div>
                <BlockHeaderTable block={block} />
                <BlockParcelList parcels={block.parcels} />
            </div>
        );
    }
}

export default BlockDetails;
