import * as React from "react";

import { SignedParcel } from "codechain-sdk";

import "./ParcelHeaderTable.scss"

interface Props {
    parcel: SignedParcel;
}

const ParcelHeaderTable = (props: Props) => {
    const { parcel } = props;
    return (
        <table className="parcel-header-table">
            <tbody>
                <tr>
                    <td>Network ID</td>
                    <td>{parcel.unsigned.networkId.value.toString()}</td>
                </tr>
                <tr>
                    <td>Block No.</td>
                    <td>{parcel.blockNumber}</td>
                </tr>
                <tr>
                    <td>Parcel Index</td>
                    <td>{parcel.parcelIndex}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{parcel.unsigned.nonce.value.toString()}</td>
                </tr>
                <tr>
                    <td>Signer</td>
                    <td>0x{parcel.getSender().value}</td>
                </tr>
                <tr>
                    <td>Fee</td>
                    <td>{parcel.unsigned.fee.value.toString()}</td>
                </tr>
                <tr>
                    <td>Timestamp</td>
                    <td>?</td>
                </tr>
                <tr>
                    <td>r</td>
                    <td>{parcel.r.value.toString()}</td>
                </tr>
                <tr>
                    <td>s</td>
                    <td>{parcel.s.value.toString()}</td>
                </tr>
                <tr>
                    <td>v</td>
                    <td>{parcel.v}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default ParcelHeaderTable;
