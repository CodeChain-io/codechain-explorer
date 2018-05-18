import * as React from "react";

interface Props {
    parcel: any;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;
    const { transaction, fee, hash, networkId, nonce } = parcel;
    const txType = Object.keys(transaction)[0];
    const txData = transaction[txType];

    return <div>
        <h4>Parcel {hash}</h4>
        <table>
            <tbody>
                <tr>
                    <td>Transaction Type</td>
                    <td>{txType}</td>
                </tr>
                <tr>
                    <td>Transaction Data</td>
                    <td><pre>{JSON.stringify(txData, null, 4)}</pre></td>
                </tr>
                <tr>
                    <td>Fee</td>
                    <td>{fee}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{nonce}</td>
                </tr>
                <tr>
                    <td>Network ID</td>
                    <td>{networkId}</td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default ParcelDetails;
