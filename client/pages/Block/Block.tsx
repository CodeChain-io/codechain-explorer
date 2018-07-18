import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestBlock } from "../../request";
import BlockDetails from "../../components/block/BlockDetails/BlockDetails";
import BlockParcelList from "../../components/block/BlockParcelList/BlockParcelList";

import "./Block.scss";
import { BlockDoc } from "../../db/DocType";

interface State {
    block?: BlockDoc;
}

interface Props {
    match: match<{ id: number | string }>;
}

class Block extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: nextId } } } = props;
        if (nextId !== id) {
            this.setState({ block: undefined });
        }
    }

    public render() {
        const { match: { params: { id } } } = this.props;
        const { block } = this.state;

        if (!block) {
            return <RequestBlock id={id} onBlock={this.onBlock} onError={this.onError} />;
        }
        return (
            <Container className="block">
                <h1>#{block.number} Block Infomation</h1>
                <BlockDetails block={block} />
                <div className="parcel-count-label">
                    <span className="blue-color">{block.parcels.length} Parcels</span> in this Block
                </div>
                <div className="mt-3">
                    <BlockParcelList parcels={block.parcels} />
                </div>
            </Container>
        );
    }

    private onBlock = (block: BlockDoc) => {
        this.setState({ block });
    };

    private onError = () => ({});
}

export default Block;
