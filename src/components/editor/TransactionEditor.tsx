import * as React from "react";

import { Transaction } from "codechain-sdk/lib/core/classes";
import AssetMintTransactionEditor from "./AssetMintTransactionEditor";
import AssetTransferTransactionEditor from "./AssetTransferTransactionEditor";

interface Props {
    type: "payment" | "setRegularKey" | "assetMint" | "assetTransfer";
    nonce?: number;
    onChangeTransaction: (t: Transaction) => void;
}

export default class TransactionEditor extends React.Component<Props> {
    public render() {
        const { type } = this.props;
        if (type === "assetMint") {
            return <AssetMintTransactionEditor onChange={this.props.onChangeTransaction} />;
        }
        if (type === "assetTransfer") {
            return <AssetTransferTransactionEditor onChange={this.props.onChangeTransaction} />;
        }
        return <div>Not implemented for type: {type}</div>;
    }
}
