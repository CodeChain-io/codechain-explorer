import { faChevronCircleDown, faChevronCircleRight, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";

import { AssetTransactionGroupDoc, ParcelDoc, PaymentDoc, SetRegularKeyDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { changeQuarkStringToCCC } from "../../../utils/Formatter";
import { ActionBadge } from "../../util/ActionBadge/ActionBadge";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import "./ParcelList.scss";

interface Props {
    parcels: ParcelDoc[];
    address?: string;
    loadMoreAction?: () => void;
    totalCount: number;
    hideMoreButton?: boolean;
    hideTitle?: boolean;
}

interface State {
    page: number;
}

class ParcelList extends React.Component<Props, State> {
    private itemPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    public render() {
        const { page } = this.state;
        const { parcels, address, loadMoreAction, totalCount, hideMoreButton, hideTitle } = this.props;
        let loadedParcels;
        if (loadMoreAction) {
            loadedParcels = parcels;
        } else {
            loadedParcels = parcels.slice(0, this.itemPerPage * page);
        }
        return (
            <div className="block-parcel-list">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Parcels</h2>
                            <span>Total {totalCount} parcels</span>
                        </div>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {loadedParcels.map((parcel, i: number) => {
                            const hash = parcel.hash;
                            return (
                                <div key={`block-parcel-${hash}`} className="card-list-item mt-small">
                                    <div className="card-list-item-header">
                                        <Row>
                                            <Col md="3">
                                                {!hideTitle ? <span className="title">Parcel #{i}</span> : null}
                                            </Col>
                                            <Col md="9">
                                                <span className="timestamp float-right">
                                                    {parcel.timestamp !== 0
                                                        ? moment.unix(parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")
                                                        : ""}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                    <DataSet className="card-list-item-body">
                                        <Row>
                                            <Col md="3">Action</Col>
                                            <Col md="9">
                                                <ActionBadge parcel={parcel} />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Hash</Col>
                                            <Col md="9">
                                                <HexString link={`/parcel/0x${hash}`} text={hash} />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Signer</Col>
                                            <Col md="9">
                                                {address && address === parcel.signer ? (
                                                    parcel.signer
                                                ) : (
                                                    <Link to={`/addr-platform/${parcel.signer}`}>{parcel.signer}</Link>
                                                )}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Fee</Col>
                                            <Col md="9">
                                                <CommaNumberString text={changeQuarkStringToCCC(parcel.fee)} />
                                                CCC
                                            </Col>
                                        </Row>
                                        <hr />
                                        {this.ParcelObjectByType(parcel, address)}
                                    </DataSet>
                                </div>
                            );
                        })}
                    </Col>
                </Row>
                {!hideMoreButton && (loadMoreAction || this.itemPerPage * page < parcels.length) ? (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Parcels
                                </button>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </div>
        );
    }
    private ParcelObjectByType = (parcel: ParcelDoc, address?: string) => {
        if (Type.isPaymentDoc(parcel.action)) {
            return [
                <Row key="payment-amount">
                    <Col md="3">Amount</Col>
                    <Col md="9">
                        <CommaNumberString text={changeQuarkStringToCCC((parcel.action as PaymentDoc).amount)} />
                        CCC
                    </Col>
                </Row>,
                <Row key="payment-sender-receiver">
                    <Col>
                        <Row>
                            <Col md="5">
                                <div className="sender-receiver-container">
                                    {address && address === parcel.signer ? (
                                        parcel.signer
                                    ) : (
                                        <Link to={`/addr-platform/${parcel.signer}`}>{parcel.signer}</Link>
                                    )}
                                </div>
                            </Col>
                            <Col md="2" className="d-flex align-items-center justify-content-center">
                                <div className="text-center d-none d-md-block arrow-icon">
                                    <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
                                </div>
                                <div className="d-md-none text-center pt-2 pb-2 arrow-icon">
                                    <FontAwesomeIcon icon={faChevronCircleDown} size="2x" />
                                </div>
                            </Col>
                            <Col md="5">
                                <div className="sender-receiver-container">
                                    {address && address === (parcel.action as PaymentDoc).receiver ? (
                                        (parcel.action as PaymentDoc).receiver
                                    ) : (
                                        <Link to={`/addr-platform/${(parcel.action as PaymentDoc).receiver}`}>
                                            {(parcel.action as PaymentDoc).receiver}
                                        </Link>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ];
        } else if (Type.isAssetTransactionGroupDoc(parcel.action)) {
            return (
                <Row>
                    <Col md="3"># of Txs</Col>
                    <Col md="9">
                        {(parcel.action as AssetTransactionGroupDoc).transactions.length.toLocaleString()}
                        <div className="small-text">
                            <FontAwesomeIcon icon={faSquare} className="asset-transfer-transaction-text-color" />{" "}
                            Transfer:{" "}
                            {_.filter((parcel.action as AssetTransactionGroupDoc).transactions, tx =>
                                Type.isAssetTransferTransactionDoc(tx)
                            ).length.toLocaleString()}
                        </div>
                        <div className="small-text">
                            <FontAwesomeIcon icon={faSquare} className="asset-mint-transaction-text-color" /> Mint:{" "}
                            {_.filter((parcel.action as AssetTransactionGroupDoc).transactions, tx =>
                                Type.isAssetMintTransactionDoc(tx)
                            ).length.toLocaleString()}
                        </div>
                    </Col>
                </Row>
            );
        } else if (Type.isSetRegularKeyDoc(parcel.action)) {
            return (
                <Row>
                    <Col md="3">Key</Col>
                    <Col md="9">
                        <HexString text={(parcel.action as SetRegularKeyDoc).key} />
                    </Col>
                </Row>
            );
        }
        return null;
    };

    private loadMore = (e: any) => {
        e.preventDefault();
        if (this.props.loadMoreAction) {
            this.props.loadMoreAction();
        } else {
            this.setState({ page: this.state.page + 1 });
        }
    };
}

export default ParcelList;
