import * as React from "react";
import * as _ from "lodash";

import { Transaction, AssetTransferTransaction, AssetMintTransaction, Script } from "codechain-sdk/lib/core/classes";

import "./TransactionHeaderTable.scss"
import HexString from "../../util/HexString/HexString";

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
                        <td><HexString text={transaction.hash().value} /></td>
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
                                                <td><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} /></td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{input.prevOut.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>LockScript</td>
                                                <td>{_.map(new Script(input.lockScript).toTokens(), (token) => token.length > 10 ? token.slice(0, 10) + "..." : token).join(" ")}</td>
                                            </tr>
                                            <tr>
                                                <td>UnlockScript</td>
                                                <td>{_.map(new Script(input.unlockScript).toTokens(), (token) => token.length > 10 ? token.slice(0, 10) + "..." : token).join(" ")}</td>
                                            </tr>
                                            <tr>
                                                <td>Prev Tx</td>
                                                <td><HexString link={`/tx/0x${input.prevOut.transactionHash}`} text={input.prevOut.transactionHash} /></td>
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
                                                <td><HexString link={`/asset/0x${output.assetType}`} text={output.assetType} /></td>
                                            </tr>
                                            <tr>
                                                <td>Owner</td>
                                                <td>{
                                                    output.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? <HexString link={`/addr-asset/0x${output.parameters[0].toString("hex")}`} text={output.parameters[0].toString("hex")} /> : "Unknown"
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{output.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>LockScriptHash</td>
                                                <td>{output.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? "P2PKH" : <HexString text={output.lockScriptHash} />}</td>
                                            </tr>
                                            <tr>
                                                <td>Parameters</td>
                                                <td>{_.map(output.parameters, (parameter, i) => {
                                                    return <div key={`transaction-paramter-${i}`}><HexString text={parameter.toString("hex")} /></div>
                                                })}</td>
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
        const metadata = getMetadata(transaction.toJSON().data.metadata);
        return (
            <table className="transaction-header-table">
                <tbody>
                    <tr>
                        <td>Hash</td>
                        <td><HexString text={transaction.hash().value} /></td>
                    </tr>
                    <tr>
                        <td>Registrar</td>
                        <td>{transaction.toJSON().data.registrar ? <HexString link={`/addr-platform/0x${transaction.toJSON().data.registrar}`} text={(transaction.toJSON().data.registrar as string)} /> : "Not existed"}</td>
                    </tr>
                    <tr>
                        <td>Metadata</td>
                        <td>
                            <table className="inner-table">
                                <tbody>
                                    <tr>
                                        <td>
                                            Name
                                        </td>
                                        <td>
                                            {metadata.name ? metadata.name : "Unknown"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Description
                                        </td>
                                        <td>
                                            {metadata.description ? metadata.description : "Unknown"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Icon
                                        </td>
                                        <td>
                                            {metadata.icon_url ? <img className="asset-icon" src={metadata.icon_url} /> : "Unknown"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>Nonce</td>
                        <td>{transaction.toJSON().data.nonce}</td>
                    </tr>
                    <tr>
                        <td>Owner</td>
                        <td>{
                            transaction.toJSON().data.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? <HexString link={`/addr-asset/0x${transaction.toJSON().data.parameters[0].toString("hex")}`} text={transaction.toJSON().data.parameters[0].toString("hex")} /> : "Unknown"
                        }</td>
                    </tr>
                    <tr>
                        <td>AssetType</td>
                        <td><HexString text={transaction.getAssetSchemeAddress().value} /></td>
                    </tr>
                    <tr>
                        <td>Amount</td>
                        <td>{transaction.toJSON().data.amount}</td>
                    </tr>
                    <tr>
                        <td>LockScriptHash</td>
                        <td>{transaction.toJSON().data.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? "P2PKH" : <HexString text={transaction.toJSON().data.lockScriptHash} />}</td>
                    </tr>
                    <tr>
                        <td>Parameters</td>
                        <td>{_.map(transaction.toJSON().data.parameters, (parameter, i) => {
                            return <div key={`transaction-heder-param-${i}`}><HexString text={parameter.toString("hex")} /></div>
                        })}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
    return (null)
};

export default TransactionHeaderTable;
