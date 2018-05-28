import * as React from "react";

import { SignedParcel } from "codechain-sdk/lib/primitives";
import { AssetMintTransaction } from "codechain-sdk/lib/primitives/transaction";

import { Link } from "react-router-dom";

interface Props {
    parcel: SignedParcel;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;
    const { transactions, fee, networkId, nonce } = parcel.unsigned;
    const parcelHash = parcel.hash();
    const txRows = transactions.map((tx, i) => (<tr key={`${parcelHash}-${i}`}>
        <td>Tx {i}</td>
        <td>
            <pre>{JSON.stringify(tx.toJSON(), null, 4)}</pre>
            {tx instanceof AssetMintTransaction && (
                <div>
                    AssetType: <Link to={`/asset/${tx.hash().value}`}>{tx.getAssetSchemeAddress().value}</Link>
                </div>
            )}
        </td>
    </tr>));

    return <div>
        <h4>Parcel {parcelHash.value}</h4>
        <table>
            <tbody>
                {txRows}
                <tr>
                    <td>Fee</td>
                    <td>{fee.value.toString()}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{nonce.value.toString()}</td>
                </tr>
                <tr>
                    <td>Network ID</td>
                    <td>{networkId.value.toString()}</td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default ParcelDetails;
