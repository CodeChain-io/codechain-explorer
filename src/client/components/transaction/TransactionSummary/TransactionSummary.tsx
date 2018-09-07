import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { faChevronCircleDown, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Col, Popover, PopoverBody, Row } from "reactstrap";

import { AssetMintTransactionDoc, AssetTransferTransactionDoc, TransactionDoc } from "codechain-es/lib/types";
import { MetadataFormat, Type } from "codechain-es/lib/utils";
import { Link } from "react-router-dom";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import "./TransactionSummary.scss";

interface OwnProps {
    transaction: TransactionDoc;
}

interface DispatchProps {
    dispatch: Dispatch;
}

interface State {
    popoverOpen: boolean;
    popoverTarget?: string;
    popoverName?: string;
    popoverAmount?: number;
}

type Props = OwnProps & DispatchProps;

class TransactionSummaryInternal extends React.Component<Props, State> {
    private itemLimit = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            popoverOpen: false,
            popoverTarget: undefined,
            popoverName: undefined,
            popoverAmount: undefined
        };
    }
    public render() {
        const { transaction } = this.props;
        if (Type.isAssetTransferTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetTransferTransactionDoc;
            return (
                <div className="transaction-summary">
                    {this.state.popoverTarget ? (
                        <Popover placement="right" isOpen={this.state.popoverOpen} target={this.state.popoverTarget}>
                            <PopoverBody>
                                <div>
                                    <p className="mb-0">{this.state.popoverName}</p>
                                    <p className="mb-0">
                                        x{this.state.popoverAmount ? this.state.popoverAmount.toLocaleString() : 0}
                                    </p>
                                    <p className="mb-0 popover-detail-label">click item to view detail</p>
                                </div>
                            </PopoverBody>
                        </Popover>
                    ) : null}
                    <Row>
                        {transactionDoc.data.inputs.length > 0
                            ? [
                                  <Col key="col-1" lg="3">
                                      <div className="summary-item">
                                          <div className="title-panel">
                                              <h3>Inputs</h3>
                                          </div>
                                          <div className="item-panel">
                                              {_.map(transactionDoc.data.inputs.slice(0, this.itemLimit), (input, i) =>
                                                  this.getAssetIcon(
                                                      Type.getMetadata(input.prevOut.assetScheme.metadata),
                                                      input.prevOut.assetType,
                                                      i,
                                                      input.prevOut.amount,
                                                      "input",
                                                      _.partial(this.onClickItem, "input", i)
                                                  )
                                              )}
                                              {transactionDoc.data.inputs.length > this.itemLimit ? (
                                                  <p className="mb-0">
                                                      {transactionDoc.data.inputs.length - this.itemLimit} more inputs
                                                  </p>
                                              ) : null}
                                          </div>
                                      </div>
                                  </Col>,
                                  <Col key="col-2" lg="3" className="d-flex align-items-center justify-content-center">
                                      <div className="text-center d-none d-lg-block arrow-icon">
                                          <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
                                      </div>
                                      <div className="d-lg-none text-center pt-2 pb-2 arrow-icon">
                                          <FontAwesomeIcon icon={faChevronCircleDown} size="2x" />
                                      </div>
                                  </Col>,
                                  <Col key="col-3" lg="3">
                                      <div className="summary-item">
                                          <div className="title-panel">
                                              <h3>Outputs</h3>
                                          </div>
                                          <div className="item-panel">
                                              {_.map(
                                                  transactionDoc.data.outputs.slice(0, this.itemLimit),
                                                  (output, i) =>
                                                      this.getAssetIcon(
                                                          Type.getMetadata(output.assetScheme.metadata),
                                                          output.assetType,
                                                          i,
                                                          output.amount,
                                                          "output",
                                                          _.partial(this.onClickItem, "output", i)
                                                      )
                                              )}
                                              {transactionDoc.data.outputs.length > this.itemLimit ? (
                                                  <p className="mb-0">
                                                      {transactionDoc.data.outputs.length - this.itemLimit} more outputs
                                                  </p>
                                              ) : null}
                                          </div>
                                      </div>
                                  </Col>
                              ]
                            : null}
                        {transactionDoc.data.burns.length > 0 ? (
                            <Col lg="3" className="mt-3 mt-lg-0">
                                <div className="summary-item">
                                    <div className="title-panel">
                                        <h3 className="burn-title">Burns</h3>
                                    </div>
                                    <div className="item-panel">
                                        {_.map(transactionDoc.data.burns, (burn, i) =>
                                            this.getAssetIcon(
                                                Type.getMetadata(burn.prevOut.assetScheme.metadata),
                                                burn.prevOut.assetType,
                                                i,
                                                burn.prevOut.amount,
                                                "burn",
                                                _.partial(this.onClickItem, "burn", i)
                                            )
                                        )}
                                    </div>
                                </div>
                            </Col>
                        ) : null}
                    </Row>
                </div>
            );
        } else if (Type.isAssetMintTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetMintTransactionDoc;
            const metadata = Type.getMetadata(transactionDoc.data.metadata);
            return (
                <div className="transaction-summary">
                    <Row>
                        <Col lg="3">
                            <div className="summary-item">
                                <div className="title-panel">
                                    <h3>Asset</h3>
                                </div>
                                <div className="content-panel text-center">
                                    <div className="content-item d-flex justify-content-center">
                                        <ImageLoader
                                            className="mr-3"
                                            size={42}
                                            data={transactionDoc.data.output.assetType}
                                            isAssetImage={true}
                                        />
                                        <div className="content-title d-inline-block text-left">
                                            <Link to={`/asset/0x${transactionDoc.data.output.assetType}`}>
                                                {metadata.name || transactionDoc.data.output.assetType}
                                            </Link>
                                            <div>
                                                <span>x{transactionDoc.data.output.amount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-description">{metadata.description}</div>
                                </div>
                                <div className="registrar-panel d-flex">
                                    <div>Registrar</div>
                                    <div className="registrar-text">
                                        {transactionDoc.data.registrar ? (
                                            <Link to={`/addr-platform/${transactionDoc.data.registrar}`}>
                                                {transactionDoc.data.registrar}
                                            </Link>
                                        ) : (
                                            "None"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    }

    private getAssetIcon = (
        metadata: MetadataFormat,
        assetType: string,
        index: number,
        amount: number,
        type: string,
        onClick: () => void
    ) => {
        const targetId = `icon-${index}-${assetType}-${type}`;
        return (
            <div
                key={targetId}
                className="d-inline-block icon"
                id={targetId}
                onClick={onClick}
                onMouseLeave={this.onMouseLeave}
                onMouseEnter={_.partial(this.onMouseEnter, targetId, metadata.name || `0x${assetType}`, amount)}
            >
                <ImageLoader size={42} data={assetType} isAssetImage={true} />
            </div>
        );
    };

    private onClickItem = (type: string, index: number) => {
        this.props.dispatch({
            type: "MOVE_TO_SECTION",
            data: `${type}-${index}`
        });
    };

    private onMouseEnter = (target: string, name: string, amount: number) => {
        setTimeout(() => {
            this.setState({
                popoverTarget: target,
                popoverOpen: true,
                popoverAmount: amount,
                popoverName: name
            });
        }, 100);
    };

    private onMouseLeave = () => {
        this.setState({
            popoverTarget: undefined,
            popoverOpen: false
        });
    };
}
const TransactionSummary = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(TransactionSummaryInternal);

export default TransactionSummary;
