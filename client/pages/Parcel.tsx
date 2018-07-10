import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { SignedParcel } from "codechain-sdk/lib/core/classes";

import { RequestParcel } from "../request";
import ParcelDetails from "../components/parcel/ParcelDetails/ParcelDetails";

interface Props {
    match: match<{ hash: string }>;
}

interface State {
    parcel?: SignedParcel;
}

class Parcel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ parcel: undefined });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { parcel } = this.state;
        return (
            <div>
                <Container>
                    {parcel
                        ? <ParcelDetails parcel={parcel} />
                        : <div>loading parcel ...
                        <RequestParcel hash={hash}
                                onParcel={this.onParcel}
                                onParcelNotExist={this.onParcelNotExist}
                                onError={this.onError} />
                        </div>}
                    {/* Show Parcel Invoices here */}
                </Container>
            </div>
        )
    }

    private onParcel = (parcel: SignedParcel) => {
        this.setState({ parcel });
    }

    private onParcelNotExist = () => {
        console.log("parcel not exist");
    }

    private onError = () => ({/* Not implemented */ });
}

export default Parcel;
