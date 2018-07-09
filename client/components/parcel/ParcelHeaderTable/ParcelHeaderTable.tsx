import * as React from "react";

import { SignedParcel, Payment, SetRegularKey, ChangeShardState } from "codechain-sdk";

import "./ParcelHeaderTable.scss"

interface Props {
    parcel: SignedParcel;
}

const getParcelElement = (parcel: SignedParcel) => {
    if (parcel.unsigned.action instanceof Payment) {
        return [
            <tr className="custom-row" key="parcel-header-table-payment-sender">
                <td>
                    Sender
                </td>
                <td>
                    0x{parcel.getSender().value}
                </td>
            </tr>,
            <tr className="custom-row" key="parcel-header-table-payment-receiver">
                <td>
                    Receiver
                </td>
                <td>
                    0x{parcel.unsigned.action.receiver.value}
                </td>
            </tr>,
            <tr className="custom-row" key="parcel-header-table-payment-amount">
                <td>
                    Amount
                </td>
                <td>
                    {parcel.unsigned.action.value.value.toString()}
                </td>
            </tr>
        ];
    } else if (parcel.unsigned.action instanceof SetRegularKey) {
        return <tr className="custom-row">
            <td>
                Key
            </td>
            <td>
                0x{parcel.unsigned.action.key.value}
            </td>
        </tr>;
    } else if (parcel.unsigned.action instanceof ChangeShardState) {
        return <tr className="custom-row">
            <td>
                Count of transactions
            </td>
            <td>
                {parcel.unsigned.action.transactions.length}
            </td>
        </tr>;
    }
    return null;
}

const ParcelHeaderTable = (props: Props) => {
    const { parcel } = props;
    return (
        <table className="parcel-header-table">
            <tbody>
                <tr>
                    <td>Hash</td>
                    <td>0x{parcel.hash().value}</td>
                </tr>
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
                {
                    getParcelElement(parcel)
                }
            </tbody>
        </table>
    );
};

export default ParcelHeaderTable;
