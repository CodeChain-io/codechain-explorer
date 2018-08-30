import * as React from "react";

import { AssetTransferTransaction } from "codechain-sdk/lib/core/classes";

import AssetTransferInputListEditor from "./AssetTransferInputListEditor";

interface Props {
    onChange: (t: AssetTransferTransaction) => void;
}

interface State {
    // FIXME: U64
    nonce: number;
    networkId: string;
}

export default class AssetTransferTransactionEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nonce: 0,
            networkId: "c"
        };
    }
    public render() {
        const { nonce, networkId } = this.state;
        return (
            <div>
                <span>Nonce</span>
                <input onChange={this.onChangeNonce} value={nonce} />
                <br />
                <span>Network ID</span>
                <input onChange={this.onChangeNetworkId} value={networkId} />
                <br />
                <span>Inputs</span>
                <AssetTransferInputListEditor onChange={this.onChangeInputs} />
            </div>
        );
    }

    private onChangeNonce = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            nonce: Number.parseInt(event.target.value)
        });
    };

    private onChangeNetworkId = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            networkId: event.target.value
        });
    };

    // FIXME: any[]
    private onChangeInputs = (inputs: any[]) => {
        console.log(inputs);
    };
}
