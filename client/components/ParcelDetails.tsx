import * as React from "react";
import { H256 } from "codechain-sdk/lib/primitives";
import { AssetMintTransaction } from "codechain-sdk/lib/primitives/transaction";
import { Link } from "react-router-dom";

interface Props {
    parcel: any;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;
    const { transactions, fee, hash, networkId, nonce } = parcel;
    // FIXME: it's possible that parcel have 0 transactions
    const { type, data } = transactions[0];

    /* FIXME: Use some kind of Transaction.fromJSON() */
    const assetMintTx = type === "assetMint" && new AssetMintTransaction({
        ...data,
        lockScriptHash: new H256(data.lockScriptHash),
    });

    let assetSchemeAddress;
    let assetMintTxHash;
    if (assetMintTx instanceof AssetMintTransaction) {
        assetSchemeAddress = assetMintTx.getAssetSchemeAddress().value;
        assetMintTxHash = assetMintTx.hash().value;
    }

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
                        {assetMintTx && (
                            <div>
                                AssetSchemeAddress:
                                <Link to={`/asset/${assetMintTxHash}`}>{assetSchemeAddress}</Link>
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
