import * as React from "react";
import * as _ from "lodash";
import { Container } from "reactstrap";

import { RequestPendingParcels } from "../../request";

import "./PendingParcels.scss";
import { PendingParcelDoc, Type } from "../../../db/DocType";
import PendingParcelTable from "../../components/pendingParcels/PendingParcelTable/PendingParcelTable";

interface State {
    pendingParcels: PendingParcelDoc[];
    requested: boolean;
    isChangeShardStateFilterOn: boolean;
    isPaymentFilterOn: boolean;
    isSetRegularKeyFilterOn: boolean;
}

class PendingParcels extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            pendingParcels: [],
            requested: false,
            isChangeShardStateFilterOn: true,
            isPaymentFilterOn: true,
            isSetRegularKeyFilterOn: true
        };
    }

    public render() {
        const { pendingParcels, requested, isChangeShardStateFilterOn, isPaymentFilterOn, isSetRegularKeyFilterOn } = this.state;
        if (!requested) {
            return (
                <div>
                    <RequestPendingParcels
                        onPendingParcels={this.onPendingParcels}
                        onError={this.onError} />
                </div>
            );
        }
        const filteredPendingParcel = this.getFilteredPendingParcel(pendingParcels);
        return (
            <Container className="pending-parcels">
                <div className="d-flex align-items-end">
                    <h1 className="d-inline mr-auto">Pending Parcels</h1>
                    <div className="d-inline"><h3>Total Pending Parcels <span className="blue-color">{pendingParcels.length}</span></h3></div>
                </div>
                <div className="filter-container mt-3">
                    <div className="type-filter">
                        <span>Type Filter</span>
                        <span onClick={this.toggleChangeShardStateFilter} className={`filter-btn change-shard-state-btn ${isChangeShardStateFilterOn ? "" : "disable"}`}>changeShardSate</span>
                        <span onClick={this.togglePaymentFilter} className={`filter-btn payment-btn ${isPaymentFilterOn ? "" : "disable"}`}>payment</span>
                        <span onClick={this.toggleSetRegularKeyFilter} className={`filter-btn set-regular-key-btn ${isSetRegularKeyFilterOn ? "" : "disable"}`}>setRegularKey</span>
                    </div>
                </div>
                <PendingParcelTable pendingParcels={filteredPendingParcel} />
            </Container>
        )
    }

    private getFilteredPendingParcel = (pendingParcels: PendingParcelDoc[]): PendingParcelDoc[] => {
        return _.filter(pendingParcels, (pendingParcel: PendingParcelDoc) => {
            if (Type.isChangeShardStateDoc(pendingParcel.parcel.action) && !this.state.isChangeShardStateFilterOn) {
                return false;
            }
            if (Type.isPaymentDoc(pendingParcel.parcel.action) && !this.state.isPaymentFilterOn) {
                return false;
            }
            if (Type.isSetRegularKeyDoc(pendingParcel.parcel.action) && !this.state.isSetRegularKeyFilterOn) {
                return false;
            }
            return true;
        })
    }

    private toggleChangeShardStateFilter = () => {
        this.setState({ isChangeShardStateFilterOn: !this.state.isChangeShardStateFilterOn });
    }

    private togglePaymentFilter = () => {
        this.setState({ isPaymentFilterOn: !this.state.isPaymentFilterOn });
    }

    private toggleSetRegularKeyFilter = () => {
        this.setState({ isSetRegularKeyFilterOn: !this.state.isSetRegularKeyFilterOn });
    }

    private onPendingParcels = (pendingParcels: PendingParcelDoc[]) => {
        this.setState({ pendingParcels });
        this.setState({ requested: true });
    }

    private onError = () => ({/* Not implemented */ });
}

export default PendingParcels;
