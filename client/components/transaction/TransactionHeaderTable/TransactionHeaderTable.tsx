import * as React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";

import { Transaction, AssetTransferTransaction, AssetMintTransaction } from "codechain-sdk";

import "./TransactionHeaderTable.scss"

interface Props {
    transaction: Transaction;
}

interface MetadataFormat {
    name?: string;
    description?: string;
    icon_url?: string;
}

const getMetadata = (data: string): MetadataFormat => {
    try {
        return JSON.parse(data);
    } catch (e) {
        // nothing
    }
    return {};
}

const TransactionHeaderTable = (props: Props) => {
    const { transaction } = props;
    if (transaction instanceof AssetTransferTransaction) {
        return (
            <table className="transaction-header-table">
                <tbody>
                    <tr>
                        <td>Hash</td>
                        <td>0x{transaction.hash().value}</td>
                    </tr>
                    <tr>
                        <td>NetworkID</td>
                        <td>{transaction.toJSON().data.networkId}</td>
                    </tr>
                    <tr>
                        <td>Nonce</td>
                        <td>{transaction.toJSON().data.nonce}</td>
                    </tr>
                    <tr className="title-row">
                        <td colSpan={2}>Input</td>
                    </tr>
                    {
                        _.map(transaction.toJSON().data.inputs, (input, index) => {
                            return <tr key={`transaction-header-table-input-${index}`}>
                                <td>Asset {index}</td>
                                <td>
                                    <table className="inner-table">
                                        <tbody>
                                            <tr>
                                                <td>AssetType</td>
                                                <td>0x{input.prevOut.assetType}</td>
                                            </tr>
                                            <tr>
                                                <td>Owner</td>
                                                <td>?</td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{input.prevOut.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>LockScript</td>
                                                <td>{input.lockScript.toString()}</td>
                                            </tr>
                                            <tr>
                                                <td>UnlockScript</td>
                                                <td>{input.unlockScript.toString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Prev Tx</td>
                                                <td><Link to={`/tx/${input.prevOut.transactionHash}`}>0x{input.prevOut.transactionHash}</Link></td>
                                            </tr>
                                            <tr>
                                                <td>Index</td>
                                                <td>{input.prevOut.index}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        })
                    }
                    <tr className="title-row">
                        <td colSpan={2}>Output</td>
                    </tr>
                    {
                        _.map(transaction.toJSON().data.outputs, (output, index) => {
                            return <tr key={`transaction-header-table-output-${index}`}><td >Asset {index}</td>
                                <td>
                                    <table className="inner-table">
                                        <tbody>
                                            <tr>
                                                <td>AssetType</td>
                                                <td>0x{output.assetType}</td>
                                            </tr>
                                            <tr>
                                                <td>Owner</td>
                                                <td>?</td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{output.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>LockScript</td>
                                                <td>0x{output.lockScriptHash}</td>
                                            </tr>
                                            <tr>
                                                <td>Parameters</td>
                                                <td>{output.parameters.toString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        );
    } else if (transaction instanceof AssetMintTransaction) {
        return (
            <table className="transaction-header-table">
                <tbody>
                    <tr>
                        <td>Registrar</td>
                        <td>{transaction.toJSON().data.registrar}</td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>{getMetadata(transaction.toJSON().data.metadata).name ? getMetadata(transaction.toJSON().data.metadata).name : "Not defined"}</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>{getMetadata(transaction.toJSON().data.metadata).description ? getMetadata(transaction.toJSON().data.metadata).description : "Not defined"}</td>
                    </tr>
                    <tr>
                        <td>Nonce</td>
                        <td>{transaction.toJSON().data.nonce}</td>
                    </tr>
                    <tr>
                        <td>AssetType</td>
                        <td>0x{transaction.getAssetSchemeAddress().value}</td>
                    </tr>
                    <tr>
                        <td>Amount</td>
                        <td>{transaction.toJSON().data.amount}</td>
                    </tr>
                    <tr>
                        <td>LockScriptHash</td>
                        <td>0x{transaction.toJSON().data.lockScriptHash}</td>
                    </tr>
                    <tr>
                        <td>Parameters</td>
                        <td>{transaction.toJSON().data.parameters}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
    return (null)
};

export default TransactionHeaderTable;
