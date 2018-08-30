import * as React from "react";

import { AssetMintTransaction } from "codechain-sdk/lib/core/classes";

interface Props {
    onChange: (t: AssetMintTransaction) => void;
}

interface State {
    // FIXME: U64
    nonce: number;
    metadata: string;
    lockScriptHash: string;
    parameters: string[];
    networkId: string;
    // FIXME: U64
    amount: number;
    registrar: string;
}

export default class AssetMintTransactionEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nonce: 0,
            metadata: "",
            lockScriptHash: "0000000000000000000000000000000000000000000000000000000000000000",
            parameters: [],
            networkId: "c",
            amount: 100,
            registrar: ""
        };
        this.emitChange();
    }

    public componentDidUpdate(_: Props, prevState: State) {
        if (prevState !== this.state) {
            this.emitChange();
        }
    }

    public render() {
        const { nonce, metadata, lockScriptHash, amount, registrar } = this.state;
        return (
            <div>
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
            </div>
        );
    }

    private onChangeNonce = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            nonce: Number.parseInt(event.target.value)
        });
    };

    private onChangeMetadata = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            metadata: event.target.value
        });
    };

    private onChangeLockScriptHash = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            lockScriptHash: event.target.value
        });
    };

    private onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            amount: Number.parseInt(event.target.value)
        });
    };

    private onChangeRegistrar = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            registrar: event.target.value
        });
    };

    // FIXME: throttle
    private emitChange = () => {
        /*
        const { nonce, metadata, lockScriptHash, amount, registrar } = this.state;
        this.props.onChange(new AssetMintTransaction({
            nonce,
            metadata,
            output: {
                amount,
                parameters: [],
                lockScriptHash: new H256(lockScriptHash),
            },
            // FIXME:
            networkId: 1,
            // FIXME: U256
            registrar: registrar.length === 40 ? new H160(registrar) : null,
        }))
        */
    };
}
