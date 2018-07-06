import * as React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";

import { Block, ChangeShardState } from "codechain-sdk";

import "./BlockHeaderTable.scss"

interface Props {
    block: Block;
}

const BlockHeaderTable = (props: Props) => {
    const { author, extraData, invoicesRoot,
        stateRoot, parentHash, score, seal, timestamp,
        parcels, parcelsRoot } = props.block;
    return (
        <table className="block-header-table">
            <tbody>
                <tr>
                    <td>Parent Block Hash</td>
                    <td><Link to={`/block/${parentHash.value}`}>0x{parentHash.value}</Link></td>
                </tr>
                <tr>
                    <td>Timestamp</td>
                    <td>{timestamp}</td>
                </tr>
                <tr>
                    <td>Author</td>
                    <td>0x{author.value}</td>
                </tr>
                <tr>
                    <td>Parcels Root</td>
                    <td>0x{parcelsRoot.value}</td>
                </tr>
                <tr>
                    <td>Invoices Root</td>
                    <td>0x{invoicesRoot.value}</td>
                </tr>
                <tr>
                    <td>State Root</td>
                    <td>0x{stateRoot.value}</td>
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
