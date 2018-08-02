import * as React from "react";
import * as moment from "moment";
import * as FontAwesome from "react-fontawesome";
import * as _ from "lodash";

import "./ParcelList.scss"
import HexString from "../../util/HexString/HexString";
import { Row, Col } from "reactstrap";
import * as arrow from "./img/arrow.png";
import { ParcelDoc, Type, PaymentDoc, ChangeShardStateDoc, SetRegularKeyDoc } from "../../../../db/DocType";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { Link } from "react-router-dom";
import { ActionBadge } from "../../util/ActionBadge/ActionBadge";

interface Props {
    parcels: ParcelDoc[];
    address?: string;
    fullScreen: boolean;
}

interface State {
    page: number;
}

class ParcelList extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1,
        };
    }

    public componentWillReceiveProps() {
        this.setState({ page: 1 });
    }

    public render() {
        const { page } = this.state;
        const { parcels, address, fullScreen } = this.props;
        const loadedParcels = parcels.slice(0, this.itemPerPage * page);
        return <div className="block-parcel-list">
            <Row className="mb-3">
                <Col lg={fullScreen ? "12" : "9"}>
                    <div className="d-flex justify-content-between align-items-end">
                        <h2>Parcels</h2>
                        <span>{parcels.length} parcels in this block</span>
                    </div>
                    <hr className="heading-hr" />
                </Col>
            </Row>
            <Row>
                <Col lg={fullScreen ? "12" : "9"}>
                    {
                        loadedParcels.map((parcel, i: number) => {
                            const hash = parcel.hash;
                            return <div key={`block-parcel-${hash}`} className="card-list-item mb-3">
                                <div className="card-list-item-header">
                                    <Row>
                                        <Col md="3">
                                            <span className="title">#{i}</span>
                                        </Col>
                                        <Col md="9">
                                            <span className="timestamp float-right">{moment.unix(parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="card-list-item-body data-set">
                                    <Row>
                                        <Col md="3">
                                            Action
                                        </Col>
                                        <Col md="9">
                                            <ActionBadge parcel={parcel} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md="3">
                                            Hash
                                        </Col>
                                        <Col md="9">
                                            <HexString link={`/parcel/0x${hash}`} text={hash} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md="3">
                                            Signer
                                        </Col>
                                        <Col md="9">
                                            {
                                                address && address === PlatformAddress.fromAccountId(parcel.sender).value ?
                                                    PlatformAddress.fromAccountId(parcel.sender).value :
                                                    <Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value}</Link>
                                            }
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md="3">
                                            Fee
                                        </Col>
                                        <Col md="9">
                                            {parcel.fee}
                                        </Col>
                                    </Row>
                                    <hr />
                                    {this.ParcelObjectByType(parcel, address)}
                                </div>
                            </div>
                        })
                    }
                </Col>
            </Row>
            {
                this.itemPerPage * page < parcels.length ?
                    <Row>
                        <Col lg={fullScreen ? "12" : "9"}>
                            <div className="margin-20-top">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Parcels
                            </button>
                            </div>
                        </Col>
                    </Row>
                    : null
            }
        </div >
    }
    private ParcelObjectByType = (parcel: ParcelDoc, address?: string) => {
        if (Type.isPaymentDoc(parcel.action)) {
            return ([
                <Row key="payment-amount">
                    <Col md="3">
                        Amount
                    </Col>
                    <Col md="9">
                        {(parcel.action as PaymentDoc).amount}
                    </Col>
                </Row>,
                <Row key="payment-sender-receiver">
                    <Col>
                        <Row>
                            <Col md="5">
                                <div className="sender-receiver-container">
                                    {
                                        address && address === PlatformAddress.fromAccountId(parcel.sender).value ?
                                            `${PlatformAddress.fromAccountId(parcel.sender).value.slice(0, 15)}...`
                                            : <Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value.slice(0, 15)}...</Link>
                                    }
                                </div>
                            </Col>
                            <Col md="2" className="text-center">
                                <img src={arrow} alt="arrow" />
                            </Col>
                            <Col md="5">
                                <div className="sender-receiver-container">
                                    {
                                        address && address === PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value ?
                                            `${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value.slice(0, 15)}...`
                                            : <Link to={`/addr-platform/${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value}`}>{PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value.slice(0, 15)}...</Link>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>])
        } else if (Type.isChangeShardStateDoc(parcel.action)) {
            return <Row>
                <Col md="3">
                    # of Txs
                </Col>
                <Col md="9">
                    {(parcel.action as ChangeShardStateDoc).transactions.length}
                    <div className="small-text">
                        <FontAwesome name="square" className="asset-transfer-transaction-text-color" /> Transfer: {_.filter((parcel.action as ChangeShardStateDoc).transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length}
                    </div>
                    <div className="small-text">
                        <FontAwesome name="square" className="asset-mint-transaction-text-color" /> Mint: {_.filter((parcel.action as ChangeShardStateDoc).transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length}
                    </div>
                </Col>
            </Row>
        } else if (Type.isSetRegularKeyDoc(parcel.action)) {
            return <Row>
                <Col md="3">
                    Key
                </Col>
                <Col md="9">
                    <HexString text={(parcel.action as SetRegularKeyDoc).key} />
                </Col>
            </Row>
        }
        return null;
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
    }
};

export default ParcelList;
