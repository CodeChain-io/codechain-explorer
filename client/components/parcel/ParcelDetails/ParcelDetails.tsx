import * as React from "react";

import { SignedParcel, ChangeShardState } from "codechain-sdk/lib/core/classes";

import ParcelHeaderTable from "../ParcelHeaderTable/ParcelHeaderTable";
import TransactionList from "../../transaction/TransactionList/TransactionList";

import "./ParcelDetails.scss"

interface Props {
    parcel: SignedParcel;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;

    return <div className="parcel-detail-container mb-3">
        <h3 className="mt-3">Parcel</h3>
        <h4 className="type">{parcel.unsigned.action.toJSON().action}</h4>
        <ParcelHeaderTable parcel={parcel} />
        {parcel.unsigned.action instanceof ChangeShardState ? <TransactionList searchByAssetType={false} transactions={parcel.unsigned.action.transactions} /> : ""}
    </div>
};

export default ParcelDetails;
