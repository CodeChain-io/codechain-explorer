import { TransactionDoc, TransferAssetTransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class AssetTransferDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as TransferAssetTransactionDoc;
        return [
            <Row key="metadata">
                <Col md="3">Metadata</Col>
                <Col md="9">
                    <div className="text-area">{transaction.transferAsset.metadata}</div>
                </Col>
            </Row>,
            <hr key="metadata-hr" />,
            <Row key="approvals">
                <Col md="3">Approvals</Col>
                <Col md="9">
                    {transaction.transferAsset.approvals.length !== 0 ? (
                        <div className="text-area">
                            {_.map(transaction.transferAsset.approvals, (approval, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{approval}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="approvals-hr" />,
            <Row key="input">
                <Col md="3"># of Input</Col>
                <Col md="9">{transaction.transferAsset.inputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="input-hr" />,
            <Row key="output">
                <Col md="3"># of Output</Col>
                <Col md="9">{transaction.transferAsset.outputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="output-hr" />,
            <Row key="burn">
                <Col md="3"># of Burn</Col>
                <Col md="9">{transaction.transferAsset.burns.length.toLocaleString()}</Col>
            </Row>,
            <hr key="burn-hr" />
        ];
    }
}
