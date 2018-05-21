import * as React from "react";
import { H256 } from "codechain-sdk/lib/primitives";
import { AssetMintTransaction } from "codechain-sdk/lib/primitives/transaction";
import { Link } from "react-router-dom";

interface Props {
    parcel: any;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;
    const { transaction: { type, data }, fee, hash, networkId, nonce } = parcel;

    /* FIXME: Use some kind of Transaction.fromJSON() */
    const assetSchemeAddress = type === "assetMint" && new AssetMintTransaction({
        ...data,
        lockScriptHash: new H256(data.lock_script_hash),
    }).getAssetSchemeAddress().value;

    return <div>
        <h4>Parcel {hash}</h4>
        <table>
            <tbody>
                <tr>
                    <td>Transaction Type</td>
                    <td>{type}</td>
                </tr>
                <tr>
                    <td>Transaction Data</td>
                    <td>
                        <pre>{JSON.stringify(data, null, 4)}</pre>
                        {assetSchemeAddress && (
                            <div>
                                AssetSchemeAddress:
                                <Link to={`/asset/${assetSchemeAddress}`}>{assetSchemeAddress}</Link>
                            </div>
                        )}
                    </td>
                </tr>
                <tr>
                    <td>Fee</td>
                    <td>{fee.value}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{nonce.value}</td>
                </tr>
                <tr>
                    <td>Network ID</td>
                    <td>{networkId.value}</td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default ParcelDetails;
