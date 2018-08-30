import * as React from "react";

import { AssetMintTransaction, H256, Transaction } from "codechain-sdk/lib/core/classes";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import TransactionEditor from "../components/editor/TransactionEditor";

type Status = "input" | "sending" | "sent" | "error";
type TransactionType = "assetMint" | "assetTransfer";

interface State {
    transactionType: TransactionType;
    // FIXME: U256
    nonce: number;
    // FIXME: U256
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
            transactionType: "assetMint",
            nonce: 0,
            fee: 10,
            networkId: 17,
            secret: "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
            status: "input",
            transaction: new AssetMintTransaction({
                nonce: 1,
                metadata: "mint meta data",
                output: {
                    amount: 10,
                    parameters: [],
                    lockScriptHash: new H256("563d207a7b1d91f9b4440536bc4818e90263ada0707b41d119e667ed35524b68")
                },
                worldId: 1,
                shardId: 0,
                networkId: "c",
                registrar: null
            })
        };
    }

    public render() {
        const { transactionType, nonce, fee, networkId, secret, status, sentHash, errorMessage } = this.state;

        if (status === "sent" && sentHash) {
            return (
                <div>
                    <Container>
                        <Link to={`/parcel/${sentHash.value}`}>{sentHash.value}</Link>
                    </Container>
                </div>
            );
        }

        if (status === "error") {
            return <div>SendSignedParcel Error: {JSON.stringify(errorMessage)}</div>;
        }

        /*
        if (status === "sending") {
            const parcel = Parcel.transactions(
                nonce,
                new U256(fee),
                networkId,
                transaction
            ).sign(new H256(secret));
            return <RequestSendSignedParcel
                parcel={parcel}
                onSuccess={this.onFinishSend}
                onError={this.onErrorSend} />;
        }*/

        return (
            <div>
                <Container>
                    <h4>Send Signed Parcel</h4>
                    <span>Nonce</span>
                    <input onChange={this.onChangeNonce} value={nonce} />
                    <br />
                    <span>Fee</span>
                    <input onChange={this.onChangeFee} value={fee} />
                    <br />
                    <span>Network Id</span>
                    <input onChange={this.onChangeNetworkId} value={networkId} />
                    <br />
                    <span>Secret</span>
                    <input onChange={this.onChangeSecret} value={secret} />

                    <hr />
                    <select onChange={this.onChangeTransactionType}>
                        <option value="assetMint">Asset Mint</option>
                        <option value="assetTransfer">(Not implemented)Asset Transfer</option>
                    </select>
                    <TransactionEditor
                        type={transactionType}
                        nonce={nonce + 1}
                        onChangeTransaction={this.onChangeTransaction}
                    />
                    <hr />
                    <button onClick={this.onClickSend}>Send</button>
                </Container>
            </div>
        );
    }

    private onChangeTransactionType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            ...this.state,
            transactionType: event.target.value as TransactionType
        });
    };

    private onChangeTransaction = (transaction: Transaction) => {
        this.setState({
            ...this.state,
            transaction
        });
    };

    private onChangeNonce = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            nonce: Number.parseInt(event.target.value)
        });
    };

    private onChangeFee = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            fee: Number.parseInt(event.target.value)
        });
    };

    private onChangeNetworkId = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            networkId: Number.parseInt(event.target.value)
        });
    };

    private onChangeSecret = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            secret: event.target.value
        });
    };

    private onClickSend = () => {
        this.setState({
            ...this.state,
            status: "sending"
        });
    };
    /*
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
        }*/
}
