import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { Block as CoreBlock } from "codechain-sdk/lib/core/classes";

import { RequestBlock } from "../request";
import BlockDetails from "../components/block/BlockDetails/BlockDetails";

interface State {
    block?: CoreBlock;
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
            <div>
                <Container>
                    <BlockDetails block={block} />
                </Container>
            </div>
        );
    }

    private onBlock = (block: CoreBlock) => {
        this.setState({ block });
    };

    private onError = () => ({});
}

export default Block;
