import * as React from "react";

import { SignedParcel, Payment, SetRegularKey, ChangeShardState } from "codechain-sdk/lib/core/classes";

import "./ParcelHeaderTable.scss"
import HexString from "../../util/HexString/HexString";

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
                    <HexString link={`/addr-platform/0x${parcel.getSender().value}`} text={parcel.getSender().value} />
                </td>
            </tr>,
            <tr className="custom-row" key="parcel-header-table-payment-receiver">
                <td>
                    Receiver
                </td>
                <td>
                    <HexString link={`/addr-platform/0x${parcel.unsigned.action.receiver.value}`} text={parcel.unsigned.action.receiver.value} />
                </td>
            </tr>,
            <tr className="custom-row" key="parcel-header-table-payment-amount">
                <td>
                    Amount
                </td>
                <td>
                    {parcel.unsigned.action.amount.value.toString()}
                </td>
            </tr>
        ];
    } else if (parcel.unsigned.action instanceof SetRegularKey) {
        return <tr className="custom-row">
            <td>
                Key
            </td>
            <td>
                <HexString text={parcel.unsigned.action.key.value} />
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
                    <td><HexString text={parcel.hash().value} /></td>
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
                    <td><HexString text={parcel.getSender().value} /></td>
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
