import * as React from "react";
import { Link } from "react-router-dom";

import { SignedParcel } from "codechain-sdk/lib/primitives";

interface Props {
    parcels: SignedParcel[];
}

const BlockParcelList = (props: Props) => {
    const { parcels } = props;
    return <div>{parcels.map((parcel, i: number) => {
        const hash = parcel.hash().value;
        const { transactions } = parcel.unsigned;
        return <div key={`block-tx-${hash}`}>
            <hr />
            <b>Parcel {i} - </b>
            <span><Link to={`/parcel/${hash}`}>{hash}</Link></span>
            <span> Transaction: {Object.keys(transactions).length}</span>
        </div>
    })}</div>
};

export default BlockParcelList;
