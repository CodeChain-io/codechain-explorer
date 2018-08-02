import * as React from "react";
import { Container } from "reactstrap";

import { RequestBlocks } from "../../request";
import "./Blocks.scss";
import { BlockDoc } from "../../../db/DocType";
import BlockTable from "../../components/block/BlockTable/BlockTable";

interface State {
    blocks: BlockDoc[];
    requested: boolean;
}

class Blocks extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            blocks: [],
            requested: false
        };
    }

    public render() {
        const { blocks, requested } = this.state;

        if (!requested) {
            return <RequestBlocks onBlocks={this.onBlocks} onError={this.onError} />;
        }
        return (
            <Container className="blocks">
                <h1>Latest blocks</h1>
                <BlockTable blocks={blocks} />
            </Container>
        );
    }

    private onBlocks = (blocks: BlockDoc[]) => {
        this.setState({ blocks });
        this.setState({ requested: true });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Blocks;
