import * as React from "react";

import { SignedParcel, ChangeShardState, Payment, SetRegularKey } from "codechain-sdk/lib/core/classes";

import "./BlockParcelList.scss"
import HexString from "../../util/HexString/HexString";

interface Props {
    parcels: SignedParcel[];
}

const ParcelObject = (parcel: SignedParcel) => {
    if (parcel.unsigned.action instanceof Payment) {
        return [<tr key="first">
            <td>Receiver</td>
            <td><HexString text={parcel.unsigned.action.receiver.value} /></td>
        </tr>, <tr key="second">
            <td>Amount</td>
            <td>{parcel.unsigned.action.amount.value.toString()}</td>
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
            <td><HexString text={parcel.unsigned.action.key.value} /></td>
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
                        <td><HexString link={`/parcel/0x${hash}`} text={hash} /></td>
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
                        <td><HexString link={`/address/0x${parcel.getSender().value}`} text={parcel.getSender().value} /></td>
                    </tr>
                    {ParcelObject(parcel)}
                </tbody>
            </table>
        </div>
    })}</div>
};

export default BlockParcelList;
