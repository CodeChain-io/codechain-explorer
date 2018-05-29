import * as React from "react";

import { H160, H256 } from "codechain-sdk/lib/primitives";
import { AssetMintTransaction } from "codechain-sdk/lib/primitives/transaction";

interface Props {
    onChange: (t: AssetMintTransaction) => void;
}

interface State {
    nonce: number;
    metadata: string;
    lockScriptHash: string;
    parameters: string[];
    amount: number;
    registrar: string;
}

export default class AssetMintTransactionInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            // FIXME: currently nonce is not used for AssetMint.
            nonce: 0,
            metadata: "",
            lockScriptHash: "0000000000000000000000000000000000000000000000000000000000000000",
            parameters: [],
            amount: 100,
            registrar: "",
        }
        this.emitChange();
    }

    public componentDidUpdate(_: Props, prevState: State) {
        if (prevState !== this.state) {
            this.emitChange();
        }
    }

    public render() {
        const { nonce, metadata, lockScriptHash, amount, registrar } = this.state;
        return <div>
            <span>Nonce</span>
            <input onChange={this.onChangeNonce} value={nonce} />
            <span>Metadata</span>
            <input onChange={this.onChangeMetadata} value={metadata} />
            <span>Lock Script Hash</span>
            <input onChange={this.onChangeLockScriptHash} value={lockScriptHash} />
            <span>Amount</span>
            <input onChange={this.onChangeAmount} value={amount} />
            <span>Registrar</span>
            <input onChange={this.onChangeRegistrar} value={registrar} />
        </div>;
    }

    private onChangeNonce = (event: any) => {
        this.setState({
            ...this.state,
            nonce: event.target.value
        });
    }

    private onChangeMetadata = (event: any) => {
        this.setState({
            ...this.state,
            metadata: event.target.value
        });
    }

    private onChangeLockScriptHash = (event: any) => {
        this.setState({
            ...this.state,
            lockScriptHash: event.target.value
        });
    }

    private onChangeAmount = (event: any) => {
        this.setState({
            ...this.state,
            amount: event.target.value
        });
    }

    private onChangeRegistrar = (event: any) => {
        this.setState({
            ...this.state,
            registrar: event.target.value
        });
    }

    // FIXME: throttle
    private emitChange = () => {
        const { nonce, metadata, lockScriptHash, amount, registrar } = this.state;
        this.props.onChange(new AssetMintTransaction({
            nonce,
            metadata,
            lockScriptHash: new H256(lockScriptHash),
            // FIXME:
            parameters: [],
            // FIXME: U256
            amount,
            registrar: registrar.length === 40 ? new H160(registrar) : null,
        }))
    }
}