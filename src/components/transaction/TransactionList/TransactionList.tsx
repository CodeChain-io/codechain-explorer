import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";

import { Col, Row } from "reactstrap";

import { faChevronCircleDown, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HexString from "../../util/HexString/HexString";
import "./TransactionList.scss";

import { AssetMintTransactionDoc, AssetTransferTransactionDoc, TransactionDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Link } from "react-router-dom";
import DataSet from "../../util/DataSet/DataSet";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";

interface Props {
    owner?: string;
    assetType?: H256;
    transactions: TransactionDoc[];
    loadMoreAction?: () => void;
    totalCount: number;
    hideMoreButton?: boolean;
    hideTitle?: boolean;
}

interface State {
    page: number;
}

class TransactionList extends React.Component<Props, State> {
    private itemPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    public render() {
        const { page } = this.state;
        const { transactions, assetType, owner, loadMoreAction, totalCount, hideMoreButton, hideTitle } = this.props;
        let loadedTransactions;
        if (loadMoreAction) {
            loadedTransactions = transactions;
        } else {
            loadedTransactions = transactions.slice(0, this.itemPerPage * page);
        }
        return (
            <div className="parcel-transaction-list">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Transactions</h2>
                            <span>Total {totalCount} transactions</span>
                        </div>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {loadedTransactions.map((transaction, i: number) => {
                            const hash = transaction.data.hash;
                            return (
                                <div key={`parcel-transaction-${hash}`} className="card-list-item mt-small">
                                    <div className="card-list-item-header">
                                        <Row>
                                            <Col md="3">
                                                {!hideTitle ? <span className="title">Transaction #{i}</span> : null}
                                            </Col>
                                            <Col md="9">
                                                <span className="timestamp float-right">
                                                    {transaction.data.timestamp !== 0
                                                        ? moment
                                                              .unix(transaction.data.timestamp)
                                                              .format("YYYY-MM-DD HH:mm:ssZ")
                                                        : ""}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                    <DataSet className="card-list-item-body">
                                        <Row>
                                            <Col md="3">Type</Col>
                                            <Col md="9">
                                                <TypeBadge transaction={transaction} />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Hash</Col>
                                            <Col md="9">
                                                <HexString link={`/tx/0x${hash}`} text={hash} />
                                            </Col>
                                        </Row>
                                        <hr />
                                        {this.TransactionObjectByType(transaction, assetType, owner)}
                                    </DataSet>
                                </div>
                            );
                        })}
                    </Col>
                </Row>
                {!hideMoreButton && (loadMoreAction || this.itemPerPage * page < transactions.length) ? (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Transactions
                                </button>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </div>
        );
    }
    private TransactionObjectByType = (transaction: TransactionDoc, assetType?: H256, owner?: string) => {
        if (Type.isAssetMintTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetMintTransactionDoc;
            return [
                <Row key="asset-type">
                    <Col md="3">AssetType</Col>
                    <Col md="9">
                        <ImageLoader
                            data={transactionDoc.data.output.assetType}
                            className="icon mr-2"
                            size={18}
                            isAssetImage={true}
                        />
                        {assetType && assetType.value === transactionDoc.data.output.assetType ? (
                            <HexString text={transactionDoc.data.output.assetType} />
                        ) : (
                            <HexString
                                link={`/asset/0x${transactionDoc.data.output.assetType}`}
                                text={transactionDoc.data.output.assetType}
                            />
                        )}
                    </Col>
                </Row>,
                <hr key="line3" />,
                <Row key="amount">
                    <Col md="3">Quantity</Col>
                    <Col md="9">
                        {transactionDoc.data.output.amount ? transactionDoc.data.output.amount.toLocaleString() : 0}
                    </Col>
                </Row>,
                <hr key="line1" />,
                <Row key="registrar">
                    <Col md="3">Registrar</Col>
                    <Col md="9">
                        {transactionDoc.data.registrar ? (
                            <Link to={`/addr-platform/${transactionDoc.data.registrar}`}>
                                {transactionDoc.data.registrar}
                            </Link>
                        ) : (
                            "None"
                        )}
                    </Col>
                </Row>,
                <hr key="line2" />,
                <Row key="owner">
                    <Col md="3">Owner</Col>
                    <Col md="9">
                        {transactionDoc.data.output.owner ? (
                            owner && owner === transactionDoc.data.output.owner ? (
                                transactionDoc.data.output.owner
                            ) : (
                                <Link to={`/addr-asset/${transactionDoc.data.output.owner}`}>
                                    {transactionDoc.data.output.owner}
                                </Link>
                            )
                        ) : (
                            "Unknown"
                        )}
                    </Col>
                </Row>
            ];
        } else if (Type.isAssetTransferTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetTransferTransactionDoc;
            return [
                <Row key="count-of-input">
                    <Col md="3"># of Input</Col>
                    <Col md="9">{transactionDoc.data.inputs.length.toLocaleString()}</Col>
                </Row>,
                <hr key="line1" />,
                <Row key="count-of-output">
                    <Col md="3"># of Output</Col>
                    <Col md="9">{transactionDoc.data.outputs.length.toLocaleString()}</Col>
                </Row>,
                <hr key="line2" />,
                <Row key="count-of-burn">
                    <Col md="3"># of Burn</Col>
                    <Col md="9">{transactionDoc.data.burns.length.toLocaleString()}</Col>
                </Row>,
                <hr key="line3" />,
                <div key="input-output-burn">
                    {transactionDoc.data.inputs.length > 0
                        ? [
                              <div key="input-output">
                                  <Row>
                                      <Col md="5">
                                          <p className="mt-1 mb-0">Input</p>
                                          {_.map(transactionDoc.data.inputs.slice(0, 3), (input, i) => {
                                              return (
                                                  <DataSet
                                                      key={`input-${i}`}
                                                      className={`input-output-container ${
                                                          owner && input.prevOut.owner === owner
                                                              ? "input-highlight"
                                                              : ""
                                                      }`}
                                                  >
                                                      <Row>
                                                          <Col md="0" />
                                                          <Col md="12">
                                                              <ImageLoader
                                                                  data={input.prevOut.assetType}
                                                                  className="icon mr-2"
                                                                  size={18}
                                                                  isAssetImage={true}
                                                              />
                                                              {assetType &&
                                                              assetType.value === input.prevOut.assetType ? (
                                                                  <HexString text={input.prevOut.assetType} />
                                                              ) : (
                                                                  <HexString
                                                                      link={`/asset/0x${input.prevOut.assetType}`}
                                                                      text={input.prevOut.assetType}
                                                                  />
                                                              )}
                                                          </Col>
                                                      </Row>
                                                      <Row>
                                                          <Col md="4">Owner</Col>
                                                          <Col md="8">
                                                              {input.prevOut.owner ? (
                                                                  owner && owner === input.prevOut.owner ? (
                                                                      input.prevOut.owner
                                                                  ) : (
                                                                      <Link to={`/addr-asset/${input.prevOut.owner}`}>
                                                                          {input.prevOut.owner}
                                                                      </Link>
                                                                  )
                                                              ) : (
                                                                  "Unknown"
                                                              )}
                                                          </Col>
                                                      </Row>
                                                      <hr />
                                                      <Row>
                                                          <Col md="4">Quantity</Col>
                                                          <Col md="8">{input.prevOut.amount.toLocaleString()}</Col>
                                                      </Row>
                                                  </DataSet>
                                              );
                                          })}
                                          {transactionDoc.data.inputs.length > 3 ? (
                                              <div className="view-more-transfer-btn">
                                                  <Link to={`/tx/0x${transactionDoc.data.hash}`}>
                                                      <button type="button" className="btn btn-primary w-100">
                                                          <span>View more inputs</span>
                                                      </button>
                                                  </Link>
                                              </div>
                                          ) : null}
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
                                          <p className="mt-1 mb-0">Output</p>
                                          {_.map(transactionDoc.data.outputs.slice(0, 3), (output, i) => {
                                              return (
                                                  <DataSet
                                                      key={`output-${i}`}
                                                      className={`input-output-container ${
                                                          owner && output.owner === owner ? "output-highlight" : ""
                                                      }`}
                                                  >
                                                      <Row>
                                                          <Col md="0" />
                                                          <Col md="12">
                                                              <ImageLoader
                                                                  data={output.assetType}
                                                                  className="icon mr-2"
                                                                  size={18}
                                                                  isAssetImage={true}
                                                              />
                                                              {assetType && assetType.value === output.assetType ? (
                                                                  <HexString text={output.assetType} />
                                                              ) : (
                                                                  <HexString
                                                                      link={`/asset/0x${output.assetType}`}
                                                                      text={output.assetType}
                                                                  />
                                                              )}
                                                          </Col>
                                                      </Row>
                                                      <Row>
                                                          <Col md="4">Owner</Col>
                                                          <Col md="8">
                                                              {output.owner ? (
                                                                  owner && owner === output.owner ? (
                                                                      output.owner
                                                                  ) : (
                                                                      <Link to={`/addr-asset/${output.owner}`}>
                                                                          {output.owner}
                                                                      </Link>
                                                                  )
                                                              ) : (
                                                                  "Unknown"
                                                              )}
                                                          </Col>
                                                      </Row>
                                                      <hr />
                                                      <Row>
                                                          <Col md="4">Quantity</Col>
                                                          <Col md="8">{output.amount.toLocaleString()}</Col>
                                                      </Row>
                                                  </DataSet>
                                              );
                                          })}
                                          {transactionDoc.data.outputs.length > 3 ? (
                                              <div className="view-more-transfer-btn">
                                                  <Link to={`/tx/0x${transactionDoc.data.hash}`}>
                                                      <button type="button" className="btn btn-primary w-100">
                                                          <span>View more outputs</span>
                                                      </button>
                                                  </Link>
                                              </div>
                                          ) : null}
                                      </Col>
                                  </Row>
                              </div>
                          ]
                        : null}
                    {transactionDoc.data.burns.length > 0
                        ? [
                              <div key="burn-container">
                                  <Row>
                                      <Col md="5">
                                          <p className="mt-1 mb-0">Burn</p>
                                          {_.map(transactionDoc.data.burns.slice(0, 3), (burn, i) => {
                                              return (
                                                  <DataSet
                                                      key={`burn-${i}`}
                                                      className={`input-output-container ${
                                                          owner && burn.prevOut.owner === owner ? "input-highlight" : ""
                                                      }`}
                                                  >
                                                      <Row>
                                                          <Col md="0" />
                                                          <Col md="12">
                                                              <ImageLoader
                                                                  data={burn.prevOut.assetType}
                                                                  className="icon mr-2"
                                                                  size={18}
                                                                  isAssetImage={true}
                                                              />
                                                              {assetType &&
                                                              assetType.value === burn.prevOut.assetType ? (
                                                                  <HexString text={burn.prevOut.assetType} />
                                                              ) : (
                                                                  <HexString
                                                                      link={`/asset/0x${burn.prevOut.assetType}`}
                                                                      text={burn.prevOut.assetType}
                                                                  />
                                                              )}
                                                          </Col>
                                                      </Row>
                                                      <Row>
                                                          <Col md="4">Owner</Col>
                                                          <Col md="8">
                                                              {burn.prevOut.owner ? (
                                                                  owner && owner === burn.prevOut.owner ? (
                                                                      burn.prevOut.owner
                                                                  ) : (
                                                                      <Link to={`/addr-asset/${burn.prevOut.owner}`}>
                                                                          {burn.prevOut.owner}
                                                                      </Link>
                                                                  )
                                                              ) : (
                                                                  "Unknown"
                                                              )}
                                                          </Col>
                                                      </Row>
                                                      <hr />
                                                      <Row>
                                                          <Col md="4">Quantity</Col>
                                                          <Col md="8">{burn.prevOut.amount.toLocaleString()}</Col>
                                                      </Row>
                                                  </DataSet>
                                              );
                                          })}
                                          {transactionDoc.data.burns.length > 3 ? (
                                              <div className="view-more-transfer-btn">
                                                  <Link to={`/tx/0x${transactionDoc.data.hash}`}>
                                                      <button type="button" className="btn btn-primary w-100">
                                                          <span>View more burns</span>
                                                      </button>
                                                  </Link>
                                              </div>
                                          ) : null}
                                      </Col>
                                  </Row>
                              </div>
                          ]
                        : null}
                </div>
            ];
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

export default TransactionList;
