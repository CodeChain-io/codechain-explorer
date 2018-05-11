import * as React from "react";
import { Link } from "react-router-dom";

interface Props {
    block: any;
}

const BlockHeaderTable = (props: Props) => {
    const { author, extraData, hash, invoicesRoot,
        stateRoot, parentHash, score, seal, timestamp,
        transactions, transactionsRoot } = props.block;
    return (
        <table>
            <tbody>
                <tr>
                    <td>Author</td>
                    <td><Link to={`/account/${author}`}>{author}</Link></td>
                </tr>
                <tr>
                    <td>Extra Data</td>
                    <td>{extraData}</td>
                </tr>
                <tr>
                    <td>Block Hash</td>
                    <td>{hash}</td>
                </tr>
                <tr>
                    <td>Invoices Root</td>
                    <td>{invoicesRoot}</td>
                </tr>
                <tr>
                    <td>State Root</td>
                    <td>{stateRoot}</td>
                </tr>
                <tr>
                    <td>Parent Block Hash</td>
                    <td><Link to={`/block/${parentHash}`}>{parentHash}</Link></td>
                </tr>
                <tr>
                    <td>Score</td>
                    <td>{score}</td>
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
                    <td>Transactions Root</td>
                    <td>{transactionsRoot}</td>
                </tr>
                <tr>
                    <td>Number of Transactions</td>
                    <td>{transactions.length}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default BlockHeaderTable;
