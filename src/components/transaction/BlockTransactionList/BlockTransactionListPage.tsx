import { faChevronCircleDown, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import {
    ComposeAssetTransactionDoc,
    DecomposeAssetTransactionDoc,
    MintAssetTransactionDoc,
    PayTransactionDoc,
    TransactionDoc,
    TransferAssetTransactionDoc
} from "codechain-indexer-types";
import { H160 } from "codechain-sdk/lib/core/classes";

import RequestBlockTransactions from "src/request/RequestBlockTransactions";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import { StatusBadge } from "../../util/StatusBadge/StatusBadge";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    blockId: number | string;
    assetType?: H160;
    owner?: string;
}

interface State {
    transactions?: TransactionDoc[];
}

type Props = OwnProps;

class TransactionLoadableListPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const { transactions } = this.state;
        if (transactions == null) {
            const { blockId, page, itemsPerPage } = this.props;
            return (
                <RequestBlockTransactions
                    id={blockId}
                    page={page}
                    itemsPerPage={itemsPerPage}
                    onTransactions={this.onLoad}
                    onError={console.error}
                />
            );
        }
        return this.renderTransactionListItems(transactions);
    }

    private onLoad = (transactions: TransactionDoc[]) => {
        this.setState({ transactions });
    };

    private renderTransactionListItems = (transactions: TransactionDoc[]) => {
        const { assetType, owner } = this.props;
        return (
            <Row>
                <Col>
                    {transactions.map(transaction => (
                        <div key={`parcel-transaction-${transaction.hash}`} className="card-list-item mt-small">
                            <div className="card-list-item-header">
                                <Row>
                                    <Col md="3" />
                                    <Col md="9">
                                        <span className="timestamp float-right">
                                            {!transaction.isPending
                                                ? moment.unix(transaction.timestamp!).format("YYYY-MM-DD HH:mm:ssZ")
                                                : "Pending"}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                            <DataSet className="card-list-item-body">
                                {this.renderTransactionCommons(transaction)}
                                {this.renderTransactionAction(transaction, assetType, owner)}
                            </DataSet>
                        </div>
                    ))}
                </Col>
            </Row>
        );
    };

    private renderTransactionCommons = (transaction: TransactionDoc) => {
        const hash = transaction.hash;
        return [
            <Row key="type">
                <Col md="3">Type</Col>
                <Col md="9">
                    <TypeBadge transaction={transaction} />
                </Col>
            </Row>,
            <hr key="line1" />,
            <Row key="hash">
                <Col md="3">Hash</Col>
                <Col md="9">
                    <HexString link={`/tx/0x${hash}`} text={hash} />
                </Col>
            </Row>,
            <hr key="line2" />,
            <Row key="status">
                <Col md="3">Status</Col>
                <Col md="9">
                    <StatusBadge tx={transaction} />
                </Col>
            </Row>,
            <hr key="line3" />,
            <Row key="sequence">
                <Col md="3">Sequence</Col>
                <Col md="9">{transaction.seq}</Col>
            </Row>,
            <hr key="line4" />,
            <Row key="fee">
                <Col md="3">Fee</Col>
                <Col md="9">
                    {transaction.fee}
                    CCC
                </Col>
            </Row>,
            <hr key="line5" />,
            <Row key="signer">
                <Col md="3">Signer</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${transaction.signer}`}>{transaction.signer}</Link>
                </Col>
            </Row>
        ];
    };

    private renderPay = (transaction: PayTransactionDoc) => {
        return [
            <hr key="line1" />,
            <Row key="quantity">
                <Col md="3">Quantity</Col>
                <Col md="9">
                    {transaction.pay.quantity}
                    CCC
                </Col>
            </Row>,
            <hr key="line2" />,
            <Row key="receiver">
                <Col md="3">Receiver</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${transaction.pay.receiver}`}>{transaction.pay.receiver}</Link>
                </Col>
            </Row>
        ];
    };

    private renderMintAsset = (transaction: MintAssetTransactionDoc, assetType?: H160, owner?: string) => {
        return [
            <hr key="line1" />,
            <Row key="asset-type">
                <Col md="3">AssetType</Col>
                <Col md="9">
                    <ImageLoader
                        data={transaction.mintAsset.assetType}
                        className="icon mr-2"
                        size={18}
                        isAssetImage={true}
                    />
                    {assetType && assetType.value === transaction.mintAsset.assetType ? (
                        <HexString text={transaction.mintAsset.assetType} />
                    ) : (
                        <HexString
                            link={`/asset/0x${transaction.mintAsset.assetType}`}
                            text={transaction.mintAsset.assetType}
                        />
                    )}
                </Col>
            </Row>,
            <hr key="line2" />,
            <Row key="amount">
                <Col md="3">Total supply</Col>
                <Col md="9">{transaction.mintAsset.supply ? transaction.mintAsset.supply.toLocaleString() : 0}</Col>
            </Row>,
            <hr key="line3" />,
            <Row key="approver">
                <Col md="3">Approver</Col>
                <Col md="9">
                    {transaction.mintAsset.approver ? (
                        <Link to={`/addr-platform/${transaction.mintAsset.approver}`}>
                            {transaction.mintAsset.approver}
                        </Link>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="line4" />,
            <Row key="owner">
                <Col md="3">Recipient</Col>
                <Col md="9">
                    {transaction.mintAsset.recipient ? (
                        owner && owner === transaction.mintAsset.recipient ? (
                            transaction.mintAsset.recipient
                        ) : (
                            <Link to={`/addr-asset/${transaction.mintAsset.recipient}`}>
                                {transaction.mintAsset.recipient}
                            </Link>
                        )
                    ) : (
                        "Unknown"
                    )}
                </Col>
            </Row>
        ];
    };

    private renderTransferAsset = (transaction: TransferAssetTransactionDoc, assetType?: H160, owner?: string) => {
        return [
            <hr key="line1" />,
            <Row key="count-of-input">
                <Col md="3"># of Input</Col>
                <Col md="9">{transaction.transferAsset.inputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="line2" />,
            <Row key="count-of-output">
                <Col md="3"># of Output</Col>
                <Col md="9">{transaction.transferAsset.outputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="line3" />,
            <Row key="count-of-burn">
                <Col md="3"># of Burn</Col>
                <Col md="9">{transaction.transferAsset.burns.length.toLocaleString()}</Col>
            </Row>,
            <hr key="line4" />,
            <div key="input-output-burn">
                {transaction.transferAsset.inputs.length > 0
                    ? [
                          <div key="input-output">
                              <Row>
                                  <Col md="5">
                                      <p className="mt-1 mb-0">Input</p>
                                      {_.map(transaction.transferAsset.inputs.slice(0, 3), (input, i) => {
                                          return (
                                              <DataSet
                                                  key={`input-${i}`}
                                                  className={`input-output-container ${
                                                      owner && input.prevOut.owner === owner ? "input-highlight" : ""
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
                                                          {assetType && assetType.value === input.prevOut.assetType ? (
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
                                                      <Col md="8">{input.prevOut.quantity.toLocaleString()}</Col>
                                                  </Row>
                                              </DataSet>
                                          );
                                      })}
                                      {transaction.transferAsset.inputs.length > 3 ? (
                                          <div className="view-more-transfer-btn">
                                              <Link to={`/tx/0x${transaction.hash}`}>
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
                                      {_.map(transaction.transferAsset.outputs.slice(0, 3), (output, i) => {
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
                                                      <Col md="8">{output.quantity.toLocaleString()}</Col>
                                                  </Row>
                                              </DataSet>
                                          );
                                      })}
                                      {transaction.transferAsset.outputs.length > 3 ? (
                                          <div className="view-more-transfer-btn">
                                              <Link to={`/tx/0x${transaction.hash}`}>
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
                {transaction.transferAsset.burns.length > 0
                    ? [
                          <div key="burn-container">
                              <Row>
                                  <Col md="5">
                                      <p className="mt-1 mb-0">Burn</p>
                                      {_.map(transaction.transferAsset.burns.slice(0, 3), (burn, i) => {
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
                                                          {assetType && assetType.value === burn.prevOut.assetType ? (
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
                                                      <Col md="8">{burn.prevOut.quantity.toLocaleString()}</Col>
                                                  </Row>
                                              </DataSet>
                                          );
                                      })}
                                      {transaction.transferAsset.burns.length > 3 ? (
                                          <div className="view-more-transfer-btn">
                                              <Link to={`/tx/0x${transaction.hash}`}>
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
    };

    private renderComposeAsset = (transaction: ComposeAssetTransactionDoc, assetType?: H160, owner?: string) => {
        return [
            <hr key="line1" />,
            <Row key="count-of-input">
                <Col md="3"># of Input</Col>
                <Col md="9">{transaction.composeAsset.inputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="line2" />,
            <Row key="count-of-output">
                <Col md="3"># of Output</Col>
                <Col md="9">1</Col>
            </Row>,
            <hr key="line3" />,
            <div key="input-output-burn">
                {transaction.composeAsset.inputs.length > 0
                    ? [
                          <div key="input-output">
                              <Row>
                                  <Col md="5">
                                      <p className="mt-1 mb-0">Input</p>
                                      {_.map(transaction.composeAsset.inputs.slice(0, 3), (input, i) => {
                                          return (
                                              <DataSet
                                                  key={`input-${i}`}
                                                  className={`input-output-container ${
                                                      owner && input.prevOut.owner === owner ? "input-highlight" : ""
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
                                                          {assetType && assetType.value === input.prevOut.assetType ? (
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
                                                      <Col md="8">{input.prevOut.quantity.toLocaleString()}</Col>
                                                  </Row>
                                              </DataSet>
                                          );
                                      })}
                                      {transaction.composeAsset.inputs.length > 3 ? (
                                          <div className="view-more-transfer-btn">
                                              <Link to={`/tx/0x${transaction.hash}`}>
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
                                      <DataSet
                                          className={`input-output-container ${
                                              owner && transaction.composeAsset.recipient === owner
                                                  ? "output-highlight"
                                                  : ""
                                          }`}
                                      >
                                          <Row>
                                              <Col md="0" />
                                              <Col md="12">
                                                  <ImageLoader
                                                      data={transaction.composeAsset.assetType}
                                                      className="icon mr-2"
                                                      size={18}
                                                      isAssetImage={true}
                                                  />
                                                  {assetType &&
                                                  assetType.value === transaction.composeAsset.assetType ? (
                                                      <HexString text={transaction.composeAsset.assetType} />
                                                  ) : (
                                                      <HexString
                                                          link={`/asset/0x${transaction.composeAsset.assetType}`}
                                                          text={transaction.composeAsset.assetType}
                                                      />
                                                  )}
                                              </Col>
                                          </Row>
                                          <Row>
                                              <Col md="4">Recipient</Col>
                                              <Col md="8">
                                                  {transaction.composeAsset.recipient ? (
                                                      owner && owner === transaction.composeAsset.recipient ? (
                                                          transaction.composeAsset.recipient
                                                      ) : (
                                                          <Link
                                                              to={`/addr-asset/${transaction.composeAsset.recipient}`}
                                                          >
                                                              {transaction.composeAsset.recipient}
                                                          </Link>
                                                      )
                                                  ) : (
                                                      "Unknown"
                                                  )}
                                              </Col>
                                          </Row>
                                          <hr />
                                          <Row>
                                              <Col md="4">Total supply</Col>
                                              <Col md="8">{transaction.composeAsset.supply}</Col>
                                          </Row>
                                      </DataSet>
                                  </Col>
                              </Row>
                          </div>
                      ]
                    : null}
            </div>
        ];
    };

    private renderDecomposeAsset = (transaction: DecomposeAssetTransactionDoc, assetType?: H160, owner?: string) => {
        return [
            <hr key="line1" />,
            <Row key="count-of-output">
                <Col md="3"># of Output</Col>
                <Col md="9">{transaction.decomposeAsset.outputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="line2" />,
            <div key="input-output-burn">
                <div key="input-output">
                    <Row>
                        <Col md="5">
                            <p className="mt-1 mb-0">Input</p>
                            <DataSet
                                className={`input-output-container ${
                                    owner && transaction.decomposeAsset.input.prevOut.owner === owner
                                        ? "input-highlight"
                                        : ""
                                }`}
                            >
                                <Row>
                                    <Col md="0" />
                                    <Col md="12">
                                        <ImageLoader
                                            data={transaction.decomposeAsset.input.prevOut.assetType}
                                            className="icon mr-2"
                                            size={18}
                                            isAssetImage={true}
                                        />
                                        {assetType &&
                                        assetType.value === transaction.decomposeAsset.input.prevOut.assetType ? (
                                            <HexString text={transaction.decomposeAsset.input.prevOut.assetType} />
                                        ) : (
                                            <HexString
                                                link={`/asset/0x${transaction.decomposeAsset.input.prevOut.assetType}`}
                                                text={transaction.decomposeAsset.input.prevOut.assetType}
                                            />
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4">Recipient</Col>
                                    <Col md="8">
                                        {transaction.decomposeAsset.input.prevOut.owner ? (
                                            owner && owner === transaction.decomposeAsset.input.prevOut.owner ? (
                                                transaction.decomposeAsset.input.prevOut.owner
                                            ) : (
                                                <Link
                                                    to={`/addr-asset/${transaction.decomposeAsset.input.prevOut.owner}`}
                                                >
                                                    {transaction.decomposeAsset.input.prevOut.owner}
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
                                    <Col md="8">
                                        {transaction.decomposeAsset.input.prevOut.quantity.toLocaleString()}
                                    </Col>
                                </Row>
                            </DataSet>
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
                            {_.map(transaction.decomposeAsset.outputs.slice(0, 3), (output, i) => {
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
                                                        <Link to={`/addr-asset/${output.owner}`}>{output.owner}</Link>
                                                    )
                                                ) : (
                                                    "Unknown"
                                                )}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="4">Quantity</Col>
                                            <Col md="8">{output.quantity.toLocaleString()}</Col>
                                        </Row>
                                    </DataSet>
                                );
                            })}
                            {transaction.decomposeAsset.outputs.length > 3 ? (
                                <div className="view-more-transfer-btn">
                                    <Link to={`/tx/0x${transaction.hash}`}>
                                        <button type="button" className="btn btn-primary w-100">
                                            <span>View more outputs</span>
                                        </button>
                                    </Link>
                                </div>
                            ) : null}
                        </Col>
                    </Row>
                </div>
            </div>
        ];
    };

    private renderTransactionAction = (transaction: TransactionDoc, assetType?: H160, owner?: string) => {
        if (transaction.type === "pay") {
            return this.renderPay(transaction);
        } else if (transaction.type === "mintAsset") {
            return this.renderMintAsset(transaction, assetType, owner);
        } else if (transaction.type === "transferAsset") {
            return this.renderTransferAsset(transaction, assetType, owner);
        } else if (transaction.type === "composeAsset") {
            return this.renderComposeAsset(transaction, assetType, owner);
        } else if (transaction.type === "decomposeAsset") {
            return this.renderDecomposeAsset(transaction, assetType, owner);
        }
        return null;
    };
}

export default TransactionLoadableListPage;
