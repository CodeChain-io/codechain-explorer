import * as React from "react";

import { Parcel, U256, H160, H256 } from "codechain-sdk/lib/primitives"
import { PaymentTransaction, Transaction } from "codechain-sdk/lib/primitives/transaction";
import { RequestSendSignedParcel } from "../components/api_request/RequestSendSignedParcel";
import TransactionInput from "../components/TransactionInput";
import { Link } from "react-router-dom";

type Status = "input" | "sending" | "sent" | "error";

interface State {
    transactionType: "payment" | "setRegularKey" | "assetMint" | "assetTransfer";
    nonce: number;
    fee: number;
    networkId: number;
    secret: string;
    transaction: Transaction;

    status: Status;
    errorMessage?: string;
    sentHash?: H256;
}

export default class SendSignedParcel extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            transactionType: "payment",
            nonce: 0,
            fee: 10,
            networkId: 17,
            secret: "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
            status: "input",
            transaction: new PaymentTransaction({
                nonce: new U256(1),
                sender: new H160("0xa6594b7196808d161b6fb137e781abbc251385d9"),
                receiver: new H160("0xa6594b7196808d161b6fb137e781abbc251385d9"),
                value: new U256(0),
            }),
        };
    }
    
    public render() {
        const { transactionType, nonce, fee, networkId,
            secret, status, transaction, sentHash, errorMessage} = this.state;

        if (status === "sent" && sentHash) {
            return <div>
                <Link to={`/parcel/${sentHash.value}`}>{sentHash.value}</Link>
            </div>
        }

        if (status === "error") {
            return <div>SendSignedParcel Error: {JSON.stringify(errorMessage)}</div>
        }

        if (status === "sending") {
            const parcel = new Parcel(
                new U256(nonce),
                new U256(fee),
                networkId,
                transaction
            ).sign(new H256(secret));
            return <RequestSendSignedParcel
                parcel={parcel}
                onSuccess={this.onFinishSend}
                onError={this.onErrorSend} />;
        }

        return <div>
            <h4>Send Signed Parcel</h4>
            <span>Nonce</span>
            <input onChange={this.onChangeNonce} value={nonce} />
            <br/>
            <span>Fee</span>
            <input onChange={this.onChangeFee} value={fee} />
            <br/>
            <span>Network Id</span>
            <input onChange={this.onChangeNetworkId} value={networkId} />
            <br/>
            <span>Secret</span>
            <input onChange={this.onChangeSecret} value={secret} />

            <hr/>
            <select onChange={this.onChangeTransactionType}>
                <option value="payment">Payment</option>
                <option value="setRegularKey">Set Regular Key</option>
                <option value="assetMint">Asset Mint</option>
                <option value="assetTransfer">Asset Transfer</option>
            </select>
            <TransactionInput
                type={transactionType}
                nonce={nonce + 1}
                onChangeTransaction={this.onChangeTransaction} />
            <hr/>
            <button onClick={this.onClickSend}>Send</button>
        </div>
    }

    private onChangeTransactionType = (event: any) => {
        this.setState({
            ...this.state,
            transactionType: event.target.value
        });
    }

    private onChangeTransaction = (transaction: Transaction) => {
        this.setState({
            ...this.state,
            transaction,
        });
    }

    private onChangeNonce = (event: any) => {
        this.setState({
            ...this.state,
            nonce: event.target.value
        });
    }

    private onChangeFee = (event: any) => {
        this.setState({
            ...this.state,
            fee: event.target.value
        });
    }

    private onChangeNetworkId = (event: any) => {
        this.setState({
            ...this.state,
            networkId: event.target.value
        });
    }

    private onChangeSecret = (event: any) => {
        this.setState({
            ...this.state,
            secret: event.target.value
        });
    }

    private onClickSend = () => {
        this.setState({
            ...this.state,
            status: "sending"
        })
    }

    private onFinishSend = (hash: H256) => {
        this.setState({
            ...this.state,
            status: "sent",
            sentHash: hash,
        })
    }

    private onErrorSend = ({ message }: { message: string }) => {
        this.setState({
            ...this.state,
            status: "error",
            errorMessage: message,
        })
    }
}
