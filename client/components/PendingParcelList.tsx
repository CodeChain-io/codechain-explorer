import * as React from "react";
import * as _ from "lodash";
import { connect } from "react-redux";

import { RootState } from "../redux/actions";
import { RequestPendingParcels } from "./api_request";

interface StateProps {
    pendingParcels: any;
}

class PendingParcelListInternal extends React.Component<StateProps> {
    public render() {
        const { pendingParcels } = this.props;
        const hashes = Object.keys(pendingParcels);
        if (hashes.length === 0) {
            return <div>No pending parcels<RequestPendingParcels /></div>
        }

        const parcels = _.values(pendingParcels);
        const parcelElems = _.map(parcels, parcel => (
            <div key={`pending-${parcel.hash}`}>
                <pre>{JSON.stringify(parcel, null, 4)}</pre>
            </div>
        ));

        return <div>
            <h4>Pending Transactions</h4>
            {parcelElems}
            <RequestPendingParcels />
        </div>;
    }
}

const PendingParcelList = connect((state: RootState) => ({
    pendingParcels: state.pendingParcels
} as StateProps))(PendingParcelListInternal);

export default PendingParcelList
