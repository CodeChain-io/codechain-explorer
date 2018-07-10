import * as React from "react";
import * as _ from "lodash";

import { Block, ChangeShardState } from "codechain-sdk/lib/core/classes";

import "./BlockHeaderTable.scss"
import HexString from "../../util/HexString/HexString";

interface Props {
    block: Block;
}

const BlockHeaderTable = (props: Props) => {
    const { hash, author, extraData, invoicesRoot,
        stateRoot, parentHash, score, seal, timestamp,
        parcels, parcelsRoot } = props.block;
    return (
        <table className="block-header-table">
            <tbody>
                <tr>
                    <td>Hash</td>
                    <td><HexString text={hash.value} /></td>
                </tr>
                <tr>
                    <td>Parent Block Hash</td>
                    <td><HexString link={`/block/0x${parentHash.value}`} text={parentHash.value} /></td>
                </tr>
                <tr>
                    <td>Timestamp</td>
                    <td>{timestamp}</td>
                </tr>
                <tr>
                    <td>Author</td>
                    <td><HexString link={`/address/0x${author.value}`} text={author.value} /></td>
                </tr>
                <tr>
                    <td>Parcels Root</td>
                    <td><HexString text={parcelsRoot.value} /></td>
                </tr>
                <tr>
                    <td>Invoices Root</td>
                    <td><HexString text={invoicesRoot.value} /></td>
                </tr>
                <tr>
                    <td>State Root</td>
                    <td><HexString text={stateRoot.value} /></td>
                </tr>
                <tr>
                    <td>Extra Data</td>
                    <td>{extraData}</td>
                </tr>
                <tr>
                    <td>Score</td>
                    <td>{score.value.toString()}</td>
                </tr>
                <tr>
                    <td>Seal</td>
                    <td>{seal}</td>
                </tr>
                <tr>
                    <td>Count of parcels</td>
                    <td>{parcels.length}</td>
                </tr>
                <tr>
                    <td>Count of transactions</td>
                    <td>{_.sumBy(parcels, (parcel) => (parcel.unsigned.action instanceof ChangeShardState ? parcel.unsigned.action.transactions.length : 0))}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default BlockHeaderTable;
