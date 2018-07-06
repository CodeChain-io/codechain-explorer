import * as React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";

import { Transaction, AssetTransferTransaction, AssetMintTransaction } from "codechain-sdk";

import "./TransactionHeaderTable.scss"

interface Props {
    transaction: Transaction;
}

const TransactionHeaderTable = (props: Props) => {
    const { transaction } = props;
    if (transaction instanceof AssetTransferTransaction) {
        return (
            <table className="transaction-header-table">
                <tbody>
                    <tr>
                        <td>NetworkID</td>
                        <td>{transaction.toJSON().data.networkId}</td>
                    </tr>
                    <tr>
                        <td>Nonce</td>
                        <td>{transaction.toJSON().data.nonce}</td>
                    </tr>
                    <tr>
                        <td rowSpan={2}>Input</td>
                    </tr>
                    {
                        _.map(transaction.toJSON().data.inputs, (input, index) => {
                            return [<td key={`transaction-header-table-input-asset-${index}`}>Asset {index}</td>,
                            <td key={`transaction-header-table-input-detail-${index}`}>
                                <table>
                                    <tr>
                                        <td>AssetType</td>
                                        <td>{input.prevOut.assetType}</td>
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
                                </table>
                            </td>]
                        })
                    }
                    <tr>
                        <td rowSpan={2}>Output</td>
                    </tr>
                    {
                        _.map(transaction.toJSON().data.outputs, (output, index) => {
                            return [<td key={`transaction-header-table-output-asset-${index}`}>Asset {index}</td>,
                            <td key={`transaction-header-table-output-detail-${index}`}>
                                <table>
                                    <tr>
                                        <td>AssetType</td>
                                        <td>{output.assetType}</td>
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
                                        <td>{output.lockScriptHash}</td>
                                    </tr>
                                    <tr>
                                        <td>Parameters</td>
                                        <td>{output.parameters.toString()}</td>
                                    </tr>
                                </table>
                            </td>]
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
