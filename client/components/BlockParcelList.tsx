import * as React from "react";
import { Link } from "react-router-dom";

interface Props {
    parcels: any[];
}

const BlockParcelList = (props: Props) => {
    const { parcels } = props;
    return <div>{parcels.map((parcel: any, i: number) => (
        <div key={`block-tx-${parcel.hash}`}>
            <hr />
            <b>Parcel {i} - </b>
            <span><Link to={`/parcel/${parcel.hash}`}>{parcel.hash}</Link></span>
            <span> Transaction: {Object.keys(parcel.transaction)}</span>
        </div>
    ))}</div>
};

export default BlockParcelList;
