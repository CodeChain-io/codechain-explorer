import * as React from "react";
import { Link } from "react-router-dom";

import { SignedParcel, ChangeShardState, Payment, SetRegularKey } from "codechain-sdk";

import "./BlockParcelList.scss"

interface Props {
    parcels: SignedParcel[];
}

const ParcelObject = (parcel: SignedParcel) => {
    if (parcel.unsigned.action instanceof Payment) {
        return [<tr key="first">
            <td>Receiver</td>
            <td>0x{parcel.unsigned.action.receiver.value}</td>
        </tr>, <tr key="second">
            <td>Amount</td>
            <td>{parcel.unsigned.action.value.value.toString()}</td>
        </tr>
        ]
    } else if (parcel.unsigned.action instanceof ChangeShardState) {
        return <tr>
            <td>Count of Transactions</td>
            <td>{parcel.unsigned.action.transactions.length}</td>
        </tr>
    } else if (parcel.unsigned.action instanceof SetRegularKey) {
        return <tr>
            <td>Key</td>
            <td>0x{parcel.unsigned.action.key.value}</td>
        </tr>
    }
    return null;
}

const BlockParcelList = (props: Props) => {
    const { parcels } = props;
    return <div className="mb-3">{parcels.map((parcel, i: number) => {
        const hash = parcel.hash().value;
        return <div key={`block-parcel-${hash}`} className="block-parcel-list-container mt-3">
            <b>Parcel {i}</b>
            <table>
                <tbody>
                    <tr>
                        <td>Hash</td>
                        <td><Link to={`/parcel/${hash}`}>0x{hash}</Link></td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{parcel.unsigned.action.toJSON().action}</td>
                    </tr>
                    <tr>
                        <td>Fee</td>
                        <td>{parcel.unsigned.fee.value.toString()}</td>
                    </tr>
                    <tr>
                        <td>Signer</td>
                        <td>0x{parcel.getSender().value}</td>
                    </tr>
                    {ParcelObject(parcel)}
                </tbody>
            </table>
        </div>
    })}</div>
};

export default BlockParcelList;
