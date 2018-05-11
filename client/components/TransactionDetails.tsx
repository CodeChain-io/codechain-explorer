import * as React from "react";

interface Props {
    transaction: any;
}

const TransactionDetails = (props: Props) => {
    const { transaction } = props;
    const { action, fee, hash, networkId, nonce } = transaction;
    const actionType = Object.keys(action)[0];
    const actionData = action[actionType];

    return <div>
        <h4>Transaction {hash}</h4>
        <table>
            <tbody>
                <tr>
                    <td>Action Type</td>
                    <td>{actionType}</td>
                </tr>
                <tr>
                    <td>Action Data</td>
                    <td><pre>{JSON.stringify(actionData, null, 4)}</pre></td>
                </tr>
                <tr>
                    <td>Fee</td>
                    <td>{fee}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{nonce}</td>
                </tr>
                <tr>
                    <td>Network ID</td>
                    <td>{networkId}</td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default TransactionDetails;
