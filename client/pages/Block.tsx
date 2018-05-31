import * as React from "react";

import { Block as CoreBlock } from "codechain-sdk/lib/primitives";

import { RequestBlock } from "../components/api_request";
import BlockDetails from "../components/BlockDetails";

interface State {
    block?: CoreBlock;
}

interface Props {
    match: any;
}

class Block extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render() {
        const { match } = this.props;
        const { id } = match.params;
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
