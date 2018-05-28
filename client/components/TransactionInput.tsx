import * as React from "react";

import { Transaction } from "codechain-sdk/lib";
import PaymentTransactionInput from "./PaymentTransactionInput";


interface Props {
    type: "payment" | "setRegularKey" | "assetMint" | "assetTransfer";
    nonce?: number;
    onChangeTransaction: (t: Transaction) => void;
}

export default class TransactionInput extends React.Component<Props> {
    public render() {
        const { nonce, type } = this.props;
        if (type === "payment") {
            return <PaymentTransactionInput
                nonce={nonce}
                onChange={this.props.onChangeTransaction} />
        }
        return <div>Not implemented for type: {type}</div>
    }
}
