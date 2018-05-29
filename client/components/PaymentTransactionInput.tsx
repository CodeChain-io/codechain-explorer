import * as React from "react";

import { H160, U256 } from "codechain-sdk/lib/primitives";
import { PaymentTransaction } from "codechain-sdk/lib/primitives/transaction";

interface Props {
    nonce?: number;
    onChange: (t: PaymentTransaction) => void;
}

interface State {
    nonce: number;
    sender: string;
    receiver: string;
    value: number;
}

export default class PaymentTransactionInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            nonce: this.props.nonce || 0,
            sender: "0xa6594b7196808d161b6fb137e781abbc251385d9",
            receiver: "0xa6594b7196808d161b6fb137e781abbc251385d9",
            value: 0,
        };
        this.emitChange();
    }

    public componentDidUpdate(_: Props, prevState: State) {
        if (prevState !== this.state) {
            this.emitChange();
        }
    }

    public render() {
        const { nonce, receiver, sender, value } = this.state;
        return <div>
            <span>Nonce</span>
            <input onChange={this.onChangeNonce} value={nonce} />
            <span>Sender</span>
            <input onChange={this.onChangeSender} value={sender} />
            <span>Receiver</span>
            <input onChange={this.onChangeReceiver} value={receiver} />
            <span>Value</span>
            <input onChange={this.onChangeValue} value={value} />
        </div>
    }

    private onChangeNonce = (event: any) => {
        this.setState({
            ...this.state,
            nonce: event.target.value,
        });
    }

    private onChangeSender = (event: any) => {
        this.setState({
            ...this.state,
            sender: event.target.value,
        });
    }

    private onChangeReceiver = (event: any) => {
        this.setState({
            ...this.state,
            receiver: event.target.value,
        });
    }

    private onChangeValue = (event: any) => {
        this.setState({
            ...this.state,
            value: event.target.value,
        });
    }

    // FIXME: throttle
    private emitChange = () => {
        const { nonce, sender, receiver, value } = this.state;
        this.props.onChange(new PaymentTransaction({
            nonce: new U256(nonce),
            sender: new H160(sender),
            receiver: new H160(receiver),
            value: new U256(value),
        }))
    }
}