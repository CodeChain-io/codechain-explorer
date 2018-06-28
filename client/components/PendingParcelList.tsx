import * as React from "react";
import * as _ from "lodash";

import { SignedParcel } from "codechain-sdk";

import { RequestPendingParcels } from "./api_request";

interface State {
    pendingParcels?: SignedParcel[];
}

class PendingParcelList extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {}
    }
    public render() {
        const { pendingParcels } = this.state;

        if (pendingParcels === undefined) {
            return <div>
                Loading pending parcels...
                <RequestPendingParcels onPendingParcels={this.onParcels} onError={this.onError} />
            </div>
        } else if (pendingParcels.length === 0) {
            return <div>No pending parcels</div>;
        }

        const parcels = _.values(pendingParcels);
        const parcelElems = _.map(parcels, parcel => (
            <div key={`pending-${parcel.hash}`}>
                <pre>{JSON.stringify(parcel, null, 4)}</pre>
            </div>
        ));

        return <div>
            <h4>Pending Parcels</h4>
            {parcelElems}
        </div>;
    }

    private onParcels = (pendingParcels: SignedParcel[]) => {
        this.setState({ pendingParcels })
    }

    private onError = (e: any) => { console.error(e); }
}

export default PendingParcelList
