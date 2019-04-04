import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { faChevronCircleDown, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Col, Popover, PopoverBody, Row } from "reactstrap";

import {
    ComposeAssetTransactionDoc,
    DecomposeAssetTransactionDoc,
    MintAssetTransactionDoc,
    TransactionDoc,
    TransferAssetTransactionDoc
} from "codechain-indexer-types";
import { Link } from "react-router-dom";
import * as Metadata from "../../../utils/Metadata";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import AssetIcon from "./AssetIcon";
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
    popoverAmount?: string;
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
        if (transaction.type === "transferAsset") {
            return this.renderTransferAssetSummary(transaction);
        } else if (transaction.type === "mintAsset") {
            return this.renderMintAssetSummary(transaction);
        } else if (transaction.type === "composeAsset") {
            return this.renderComposeAssetSummary(transaction);
        } else if (transaction.type === "decomposeAsset") {
            return this.renderDecomposeAssetSummary(transaction);
        }
        return null;
    }

    private renderMintAssetSummary = (transaction: MintAssetTransactionDoc) => {
        const metadata = Metadata.parseMetadata(transaction.mintAsset.metadata);
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
                                        data={transaction.mintAsset.assetType}
                                        isAssetImage={true}
                                    />
                                    <div className="content-title d-inline-block text-left">
                                        <Link to={`/asset/0x${transaction.mintAsset.assetType}`}>
                                            {metadata.name || transaction.mintAsset.assetType}
                                        </Link>
                                        <div>
                                            <span>x{transaction.mintAsset.supply}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="content-description">{metadata.description}</div>
                            </div>
                            <div className="registrar-panel d-flex">
                                <div>Approver</div>
                                <div className="registrar-text">
                                    {transaction.mintAsset.approver ? (
                                        <Link to={`/addr-platform/${transaction.mintAsset.approver}`}>
                                            {transaction.mintAsset.approver}
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
    };

    private renderTransferAssetSummary = (transaction: TransferAssetTransactionDoc) => {
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
                    {transaction.transferAsset.inputs.length > 0
                        ? [
                              <Col key="col-1" lg="3">
                                  <div className="summary-item">
                                      <div className="title-panel">
                                          <h3>Inputs</h3>
                                      </div>
                                      <div className="item-panel">
                                          {_.map(
                                              transaction.transferAsset.inputs.slice(0, this.itemLimit),
                                              (input, i) =>
                                                  input.assetScheme == null ? (
                                                      <>x</>
                                                  ) : (
                                                      <AssetIcon
                                                          metadata={Metadata.parseMetadata(input.assetScheme.metadata)}
                                                          assetType={input.prevOut.assetType}
                                                          index={i}
                                                          amount={input.prevOut.quantity}
                                                          type={"input"}
                                                          onClick={_.partial(this.onClickItem, "input", i)}
                                                          onMouseEnter={this.onMouseEnter}
                                                          onMouseLeave={this.onMouseLeave}
                                                      />
                                                  )
                                          )}
                                          {transaction.transferAsset.inputs.length > this.itemLimit ? (
                                              <p className="mb-0">
                                                  {transaction.transferAsset.inputs.length - this.itemLimit} more inputs
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
                                              transaction.transferAsset.outputs.slice(0, this.itemLimit),
                                              (output, i) =>
                                                  output.assetScheme == null ? (
                                                      <>x</>
                                                  ) : (
                                                      <AssetIcon
                                                          metadata={Metadata.parseMetadata(output.assetScheme.metadata)}
                                                          assetType={output.assetType}
                                                          index={i}
                                                          amount={output.quantity}
                                                          type={"output"}
                                                          onClick={_.partial(this.onClickItem, "output", i)}
                                                          onMouseEnter={this.onMouseEnter}
                                                          onMouseLeave={this.onMouseLeave}
                                                      />
                                                  )
                                          )}
                                          {transaction.transferAsset.outputs.length > this.itemLimit ? (
                                              <p className="mb-0">
                                                  {transaction.transferAsset.outputs.length - this.itemLimit} more
                                                  outputs
                                              </p>
                                          ) : null}
                                      </div>
                                  </div>
                              </Col>
                          ]
                        : null}
                    {transaction.transferAsset.burns.length > 0 ? (
                        <Col lg="3" className="mt-3 mt-lg-0">
                            <div className="summary-item">
                                <div className="title-panel">
                                    <h3 className="burn-title">Burns</h3>
                                </div>
                                <div className="item-panel">
                                    {_.map(
                                        transaction.transferAsset.burns,
                                        (burn, i) =>
                                            burn.assetScheme == null ? (
                                                <>x</>
                                            ) : (
                                                <AssetIcon
                                                    metadata={Metadata.parseMetadata(burn.assetScheme.metadata)}
                                                    assetType={burn.prevOut.assetType}
                                                    index={i}
                                                    amount={burn.prevOut.quantity}
                                                    type={"burn"}
                                                    onClick={_.partial(this.onClickItem, "burn", i)}
                                                    onMouseEnter={this.onMouseEnter}
                                                    onMouseLeave={this.onMouseLeave}
                                                />
                                            )
                                    )}
                                </div>
                            </div>
                        </Col>
                    ) : null}
                </Row>
            </div>
        );
    };

    private renderComposeAssetSummary = (transaction: ComposeAssetTransactionDoc) => {
        const metadata = Metadata.parseMetadata(transaction.composeAsset.metadata);
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
                    {transaction.composeAsset.inputs.length > 0 && [
                        <Col key="col-1" lg="3">
                            <div className="summary-item">
                                <div className="title-panel">
                                    <h3>Inputs</h3>
                                </div>
                                <div className="item-panel">
                                    {_.map(
                                        transaction.composeAsset.inputs.slice(0, this.itemLimit),
                                        (input, i) =>
                                            input.assetScheme == null ? (
                                                <>x</>
                                            ) : (
                                                <AssetIcon
                                                    metadata={Metadata.parseMetadata(input.assetScheme.metadata)}
                                                    assetType={input.prevOut.assetType}
                                                    index={i}
                                                    amount={input.prevOut.quantity}
                                                    type={"input"}
                                                    onClick={_.partial(this.onClickItem, "input", i)}
                                                    onMouseEnter={this.onMouseEnter}
                                                    onMouseLeave={this.onMouseLeave}
                                                />
                                            )
                                    )}
                                    {transaction.composeAsset.inputs.length > this.itemLimit ? (
                                        <p className="mb-0">
                                            {transaction.composeAsset.inputs.length - this.itemLimit} more inputs
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
                                    <h3>Output</h3>
                                </div>
                                <div className="content-panel text-center">
                                    <div className="content-item d-flex justify-content-center">
                                        <ImageLoader
                                            className="mr-3"
                                            size={42}
                                            data={transaction.composeAsset.assetType}
                                            isAssetImage={true}
                                        />
                                        <div className="content-title d-inline-block text-left">
                                            <Link to={`/asset/0x${transaction.composeAsset.assetType}`}>
                                                {metadata.name || transaction.composeAsset.assetType}
                                            </Link>
                                            <div>
                                                <span>x{transaction.composeAsset.supply}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-description">{metadata.description}</div>
                                </div>
                                <div className="registrar-panel d-flex">
                                    <div>Approver</div>
                                    <div className="registrar-text">
                                        {transaction.composeAsset.approver ? (
                                            <Link to={`/addr-platform/${transaction.composeAsset.approver}`}>
                                                {transaction.composeAsset.approver}
                                            </Link>
                                        ) : (
                                            "None"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ]}
                </Row>
            </div>
        );
    };

    private renderDecomposeAssetSummary = (transaction: DecomposeAssetTransactionDoc) => {
        const metadata =
            transaction.decomposeAsset.input.assetScheme == null
                ? { name: "", description: "" }
                : Metadata.parseMetadata(transaction.decomposeAsset.input.assetScheme.metadata);
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
                    <Col key="col-1" lg="3">
                        <div className="summary-item">
                            <div className="title-panel">
                                <h3>Input</h3>
                            </div>
                            <div className="content-panel text-center">
                                <div className="content-item d-flex justify-content-center">
                                    <ImageLoader
                                        className="mr-3"
                                        size={42}
                                        data={transaction.decomposeAsset.input.prevOut.assetType}
                                        isAssetImage={true}
                                    />
                                    <div className="content-title d-inline-block text-left">
                                        <Link to={`/asset/0x${transaction.decomposeAsset.input.prevOut.assetType}`}>
                                            {metadata.name || transaction.decomposeAsset.input.prevOut.assetType}
                                        </Link>
                                        <div>
                                            <span>x{transaction.decomposeAsset.input.prevOut.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="content-description">{metadata.description}</div>
                            </div>
                            {transaction.decomposeAsset.input.assetScheme && (
                                <div className="registrar-panel d-flex">
                                    <div>Approver</div>
                                    <div className="registrar-text">
                                        {transaction.decomposeAsset.input.assetScheme.approver ? (
                                            <Link
                                                to={`/addr-platform/${
                                                    transaction.decomposeAsset.input.assetScheme.approver
                                                }`}
                                            >
                                                {transaction.decomposeAsset.input.assetScheme.approver}
                                            </Link>
                                        ) : (
                                            "None"
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                    ,
                    <Col key="col-2" lg="3" className="d-flex align-items-center justify-content-center">
                        <div className="text-center d-none d-lg-block arrow-icon">
                            <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
                        </div>
                        <div className="d-lg-none text-center pt-2 pb-2 arrow-icon">
                            <FontAwesomeIcon icon={faChevronCircleDown} size="2x" />
                        </div>
                    </Col>
                    ,
                    <Col key="col-3" lg="3">
                        <div className="summary-item">
                            <div className="title-panel">
                                <h3>Outputs</h3>
                            </div>
                            <div className="item-panel">
                                {_.map(
                                    transaction.decomposeAsset.outputs.slice(0, this.itemLimit),
                                    (output, i) =>
                                        output.assetScheme == null ? (
                                            <>x</>
                                        ) : (
                                            <AssetIcon
                                                metadata={Metadata.parseMetadata(output.assetScheme.metadata)}
                                                assetType={output.assetType}
                                                index={i}
                                                amount={output.quantity}
                                                type="output"
                                                onClick={_.partial(this.onClickItem, "output", i)}
                                                onMouseEnter={this.onMouseEnter}
                                                onMouseLeave={this.onMouseLeave}
                                            />
                                        )
                                )}
                                {transaction.decomposeAsset.outputs.length > this.itemLimit ? (
                                    <p className="mb-0">
                                        {transaction.decomposeAsset.outputs.length - this.itemLimit} more outputs
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    private onClickItem = (type: string, index: number) => {
        this.props.dispatch({
            type: "MOVE_TO_SECTION",
            data: `${type}-${index}`
        });
    };

    private onMouseEnter = (target: string, name: string, amount: string) => {
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
