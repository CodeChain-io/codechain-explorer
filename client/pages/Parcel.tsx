import * as React from "react";
import { connect } from "react-redux";

import { SignedParcel } from "codechain-sdk/lib";

import { RootState } from "../redux/actions";
import { RequestParcel } from "../components/requests";
import ParcelDetails from "../components/ParcelDetails";

interface Props {
    match: any;
}

interface StateProps {
    parcelByHash: {
        [hash: string]: SignedParcel;
    };
}

class ParcelInternal extends React.Component<Props & StateProps> {
    public render() {
        const { parcelByHash, match } = this.props;
        const { hash } = match.params;
        const parcel = parcelByHash[hash];
        return (
            <div>
                {parcel
                    ? <ParcelDetails parcel={parcel} />
                    : <div>loading tx ... <RequestParcel hash={hash} /></div>}
                <hr />
                {/* Show Parcel Invoices here */}
            </div>
        )
    }
}

const Parcel = connect((state: RootState) => {
    return {
        parcelByHash: state.parcelByHash,
    } as StateProps;
})(ParcelInternal);

export default Parcel;
