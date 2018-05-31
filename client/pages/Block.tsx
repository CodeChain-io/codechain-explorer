import * as React from "react";
import { match } from "react-router";

import { Block as CoreBlock } from "codechain-sdk/lib/primitives";

import { RequestBlock } from "../components/api_request";
import BlockDetails from "../components/BlockDetails";

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
                <BlockDetails block={block} />
            </div>
        );
    }

    private onBlock = (block: CoreBlock) => {
        this.setState({ block });
    };

    private onError = () => ({});
}

export default Block;
