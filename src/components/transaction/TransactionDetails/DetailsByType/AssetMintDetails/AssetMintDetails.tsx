import { MintAssetTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { getLockScriptName } from "../../../../../utils/Transactions";
import HexString from "../../../../util/HexString/HexString";
import { ImageLoader } from "../../../../util/ImageLoader/ImageLoader";

interface Props {
    tx: TransactionDoc;
}

export default class AssetMintDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as MintAssetTransactionDoc;
        return [
            <Row key="shardId">
                <Col md="3">ShardId</Col>
                <Col md="9">{transaction.mintAsset.shardId}</Col>
            </Row>,
            <hr key="shardId-hr" />,
            <Row key="tracker">
                <Col md="3">Tracker</Col>
                <Col md="9">
                    0x
                    {transaction.tracker}
                </Col>
            </Row>,
            <hr key="tracker-hr" />,
            <Row key="administrator">
                <Col md="3">Administrator</Col>
                <Col md="9">{transaction.mintAsset.administrator ? transaction.mintAsset.administrator : "None"}</Col>
            </Row>,
            <hr key="administrator-hr" />,
            <Row key="allowedScriptHashes">
                <Col md="3">AllowedScriptHashes</Col>
                <Col md="9">
                    {transaction.mintAsset.allowedScriptHashes.length !== 0 ? (
                        <div className="text-area">
                            {_.map(transaction.mintAsset.allowedScriptHashes, (allowedScriptHash, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{allowedScriptHash}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="allowedScriptHashes-hr" />,
            <Row key="approvals">
                <Col md="3">Approvals</Col>
                <Col md="9">
                    {transaction.mintAsset.approvals.length !== 0 ? (
                        <div className="text-area">
                            {_.map(transaction.mintAsset.approvals, (approval, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{approval}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="approvals-hr" />,
            <Row key="lockScriptHash">
                <Col md="3">LockScriptHash</Col>
                <Col md="9">{getLockScriptName(transaction.mintAsset.lockScriptHash)}</Col>
            </Row>,
            <hr key="lockScriptHash-hr" />,
            <Row key="parameters">
                <Col md="3">Parameters</Col>
                <Col md="9">
                    <div className="text-area">
                        {_.map(transaction.mintAsset.parameters, (parameter, i) => {
                            return <div key={`transaction-heder-param-${i}`}>{parameter}</div>;
                        })}
                    </div>
                </Col>
            </Row>,
            <hr key="parameters-hr" />,
            <Row key="assetType">
                <Col md="3">AssetType</Col>
                <Col md="9">
                    <ImageLoader
                        data={transaction.mintAsset.assetType}
                        size={18}
                        className="mr-2"
                        isAssetImage={true}
                    />
                    <HexString
                        link={`/asset/0x${transaction.mintAsset.assetType}`}
                        text={transaction.mintAsset.assetType}
                    />
                </Col>
            </Row>,
            <hr key="assetType-hr" />,
            <Row key="supply">
                <Col md="3">Supply</Col>
                <Col md="9">{transaction.mintAsset.supply ? transaction.mintAsset.supply.toLocaleString() : 0}</Col>
            </Row>,
            <hr key="supply-hr" />,
            <Row key="recipient">
                <Col md="3">Recipient</Col>
                <Col md="9">
                    {transaction.mintAsset.recipient ? (
                        <Link to={`/addr-asset/${transaction.mintAsset.recipient}`}>
                            {transaction.mintAsset.recipient}
                        </Link>
                    ) : (
                        "Unknown"
                    )}
                </Col>
            </Row>,
            <hr key="recipient-hr" />
        ];
    }
}
