import * as React from "react";

import { SignedParcel, ChangeShardState } from "codechain-sdk";

import ParcelHeaderTable from "../ParcelHeaderTable/ParcelHeaderTable";
import ParcelTransactionList from "../ParcelTransactionList/ParcelTransactionList";

import "./ParcelDetails.scss"

interface Props {
    parcel: SignedParcel;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;

    return <div className="parcel-detail-container">
        <h3 className="mt-3">Parcel</h3>
        <h4 className="hash">0x{parcel.hash().value}</h4>
        <h4 className="type">{parcel.unsigned.action.toJSON().action}</h4>
        <h3 className="mt-3">Summary</h3>
        <ParcelHeaderTable parcel={parcel} />
        {parcel.unsigned.action instanceof ChangeShardState ? <ParcelTransactionList transactions={parcel.unsigned.action.transactions} /> : ""}
    </div>
};

export default ParcelDetails;
