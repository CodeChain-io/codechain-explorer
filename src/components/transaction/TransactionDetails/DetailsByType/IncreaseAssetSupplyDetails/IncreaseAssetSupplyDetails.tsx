import { IncreaseAssetSupplyTransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { getLockScriptName } from "src/utils/Transactions";
import HexString from "../../../../util/HexString/HexString";
import { ImageLoader } from "../../../../util/ImageLoader/ImageLoader";

interface Props {
    tx: IncreaseAssetSupplyTransactionDoc;
}

export default class IncreaseAssetSupplyDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        return [
            <Row key="shardId">
                <Col md="3">ShardId</Col>
                <Col md="9">{tx.increaseAssetSupply.shardId}</Col>
            </Row>,
            <hr key="shardId-hr" />,
            <Row key="parameters">
                <Col md="3">Parameters</Col>
                <Col md="9">
                    <div className="text-area">
                        {_.map(tx.increaseAssetSupply.parameters, (parameter, i) => {
                            return <div key={`transaction-heder-param-${i}`}>{parameter}</div>;
                        })}
                    </div>
                </Col>
            </Row>,
            <hr key="parameters-hr" />,
            <Row key="recipient">
                <Col md="3">Recipient</Col>
                <Col md="9">
                    {tx.increaseAssetSupply.recipient ? (
                        <Link to={`/addr-asset/${tx.increaseAssetSupply.recipient}`}>
                            {tx.increaseAssetSupply.recipient}
                        </Link>
                    ) : (
                        "Unknown"
                    )}
                </Col>
            </Row>,
            <hr key="recipient-hr" />,
            <Row key="lockScriptHash">
                <Col md="3">LockScriptHash</Col>
                <Col md="9">{getLockScriptName(tx.increaseAssetSupply.lockScriptHash)}</Col>
            </Row>,
            <hr key="lockScriptHash-hr" />,
            <Row key="approvals">
                <Col md="3">Approvals</Col>
                <Col md="9">
                    {tx.increaseAssetSupply.approvals.length !== 0 ? (
                        <div className="text-area">
                            {_.map(tx.increaseAssetSupply.approvals, (approval, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{approval}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="approvals-hr" />,
            <Row key="assetType">
                <Col md="3">AssetType</Col>
                <Col md="9">
                    <ImageLoader
                        data={tx.increaseAssetSupply.assetType}
                        size={18}
                        className="mr-2"
                        isAssetImage={true}
                    />
                    <HexString
                        link={`/asset/0x${tx.increaseAssetSupply.assetType}`}
                        text={tx.increaseAssetSupply.assetType}
                    />
                </Col>
            </Row>,
            <hr key="assetType-hr" />,
            <Row key="supply">
                <Col md="3">Supply</Col>
                <Col md="9">{tx.increaseAssetSupply.supply}</Col>
            </Row>,
            <hr key="supply-hr" />
        ];
    }
}
