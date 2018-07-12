import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { U256, Parcel, Block } from "codechain-sdk/lib/core/classes"
import { RequestPlatformAddressAccount } from "../request";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    account?: {
        nonce: U256,
        balance: U256,
    },
    blocks: Block[],
    parcels: Parcel[]
}

class Address extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { blocks: [], parcels: [] };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ account: undefined, blocks: [], parcels: [] });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { account } = this.state;
        if (!account) {
            return <div><Container>Loading ... <RequestPlatformAddressAccount address={address} onAccount={this.onAccount} onError={this.onError} /></Container></div>
        }
        return (
            <div>
                <Container>
                    <h4>{address}</h4>
                    <div>Balance: {account.balance.value.toString()}</div>
                    <div>Nonce: {account.nonce.value.toString()}</div>
                    <hr />
                    <div>Transaction List</div>
                    <hr />
                    {/* FIXME: not implemented */}
                </Container>
            </div>
        )
    }

    private onAccount = (account: { nonce: U256, balance: U256 }) => {
        this.setState({ account });
    }
    private onError = (e: any) => { console.error(e); }
}

export default Address;
