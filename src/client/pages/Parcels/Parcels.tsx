import * as React from "react";
import { Container } from "reactstrap";

import { RequestParcels } from "../../request";
import "./Parcels.scss";
import { ParcelDoc } from "../../../db/DocType";
import ParcelTable from "../../components/parcel/ParcelTable/ParcelTable";

interface State {
    parcels: ParcelDoc[];
    requested: boolean;
}

class Parcels extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            parcels: [],
            requested: false
        };
    }

    public render() {
        const { parcels, requested } = this.state;

        if (!requested) {
            return <RequestParcels onParcels={this.onParcels} onError={this.onError} />;
        }
        return (
            <Container className="parcels">
                <h1>Latest parcels</h1>
                <ParcelTable parcels={parcels} />
            </Container>
        );
    }

    private onParcels = (parcels: ParcelDoc[]) => {
        this.setState({ parcels });
        this.setState({ requested: true });
    };

    private onError = () => ({});
}

export default Parcels;
