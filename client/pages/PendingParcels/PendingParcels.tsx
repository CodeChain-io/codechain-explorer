import * as React from "react";
import { Container } from 'reactstrap';

import { RequestPendingParcels } from "../../request";

import "./PendingParcels.scss";
import { PendingParcelDoc } from "../../db/DocType";
import PendingParcelTable from "../../components/pendingParcels/PendingParcelTable/PendingParcelTable";

interface State {
    pendingParcels: PendingParcelDoc[];
    requested: boolean;
}

class PendingParcels extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            pendingParcels: [],
            requested: false
        };
    }

    public componentDidMount() {
        this.updateRequestState()
    }

    public render() {
        const { pendingParcels, requested } = this.state;
        if (!requested) {
            return (
                <div>
                    <RequestPendingParcels
                        onPendingParcels={this.onPendingParcels}
                        onError={this.onError} />
                </div>
            );
        }
        return (
            <Container className="pending-parcels">
                <div className="d-flex align-items-end">
                    <h1 className="d-inline mr-auto">Pending Parcels</h1>
                    <div className="d-inline"><h3>Total Pending Parcels <span className="blue-color">{pendingParcels.length}</span></h3></div>
                </div>
                <div className="filter-container mt-3">
                    <div className="type-filter">
                        <span>Type Filter</span>
                        <span className="filter-btn change-shard-state-btn">changeShardSate</span>
                        <span className="filter-btn payment-btn">payment</span>
                        <span className="filter-btn set-regular-key-btn">setRegularKey</span>
                    </div>
                </div>
                <PendingParcelTable pendingParcels={pendingParcels} />
            </Container>
        )
    }

    private updateRequestState() {
        this.setState({ requested: true })
    }

    private onPendingParcels = (pendingParcels: PendingParcelDoc[]) => {
        this.setState({ pendingParcels });
    }

    private onError = () => ({/* Not implemented */ });
}

export default PendingParcels;
