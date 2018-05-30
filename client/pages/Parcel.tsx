import * as React from "react";

import { SignedParcel } from "codechain-sdk/lib";

import { RequestParcel } from "../components/api_request";
import ParcelDetails from "../components/ParcelDetails";

interface Props {
    match: any;
}

interface State {
    parcel?: SignedParcel;
}

class Parcel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const { match } = this.props;
        const { hash } = match.params;
        const { parcel } = this.state;
        return (
            <div>
                {parcel
                    ? <ParcelDetails parcel={parcel} />
                    : <div>loading tx ...
                        <RequestParcel hash={hash}
                            onParcel={this.onParcel}
                            onParcelNotExist={this.onParcelNotExist}
                            onError={this.onError}/>
                    </div>}
                <hr />
                {/* Show Parcel Invoices here */}
            </div>
        )
    }

    private onParcel = (parcel: SignedParcel) => {
        this.setState({ parcel });
    }

    private onParcelNotExist = () => {
        console.log("parcel not exist");
    }

    private onError = () => ({/* Not implemented */});
}

export default Parcel;
