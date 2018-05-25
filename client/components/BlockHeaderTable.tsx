import * as React from "react";
import { Link } from "react-router-dom";

import { Block } from "codechain-sdk/lib/primitives";

interface Props {
    block: Block;
}

const BlockHeaderTable = (props: Props) => {
    const { author, extraData, hash, invoicesRoot,
        stateRoot, parentHash, score, seal, timestamp,
        parcels, parcelsRoot } = props.block;
    return (
        <table>
            <tbody>
                <tr>
                    <td>Author</td>
                    <td><Link to={`/account/${author.value}`}>{author.value}</Link></td>
                </tr>
                <tr>
                    <td>Extra Data</td>
                    <td>{extraData}</td>
                </tr>
                <tr>
                    <td>Block Hash</td>
                    <td>{hash.value}</td>
                </tr>
                <tr>
                    <td>Invoices Root</td>
                    <td>{invoicesRoot.value}</td>
                </tr>
                <tr>
                    <td>State Root</td>
                    <td>{stateRoot.value}</td>
                </tr>
                <tr>
                    <td>Parent Block Hash</td>
                    <td><Link to={`/block/${parentHash.value}`}>{parentHash.value}</Link></td>
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
                    <td>Timestamp</td>
                    <td>{timestamp}</td>
                </tr>
                <tr>
                    <td>Parcels Root</td>
                    <td>{parcelsRoot.value}</td>
                </tr>
                <tr>
                    <td>Number of Parcels</td>
                    <td>{parcels.length}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default BlockHeaderTable;
