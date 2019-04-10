import { OrderOnTransferDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import DataSet from "../../../../util/DataSet/DataSet";

interface Props {
    orders: OrderOnTransferDoc[];
}

interface State {
    page: number;
}

export default class AssetTransferOrders extends React.Component<Props, State> {
    private itemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }
    public render() {
        const { orders } = this.props;
        const { page } = this.state;
        return (
            <div key="order">
                {_.map(orders.slice(0, this.itemsPerPage * page), (order, index) => {
                    return this.renderOrder(order, index);
                })}
                {this.itemsPerPage * page < orders.length ? (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMoreOrder}>
                                    Load Order
                                </button>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </div>
        );
    }

    public renderOrder = (order: OrderOnTransferDoc, index: number) => {
        return [
            <div key={`transaction-header-table-order-title-${index}`} className="mt-large">
                <h3>Order #{index}</h3>
                <hr className="heading-hr" />
            </div>,
            <Row key={`transaction-header-table-order-details-${index}`}>
                <Col lg="12">
                    <DataSet>
                        <Row>
                            <Col md="3">Input Indices</Col>
                            <Col md="9">
                                <div className="text-area">{order.inputIndices.join(", ")}</div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Output Indices</Col>
                            <Col md="9">
                                <div className="text-area">{order.outputIndices.join(", ")}</div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Spend Quantity</Col>
                            <Col md="9">{order.spentQuantity}</Col>
                        </Row>
                        <hr />
                        {order.order && [
                            <Row key="1">
                                <Col md="3">assetTypeFrom</Col>
                                <Col md="9">{order.order.assetTypeFrom}</Col>
                            </Row>,
                            <hr key="1-hr" />,
                            <Row key="2">
                                <Col md="3">assetTypeTo</Col>
                                <Col md="9">{order.order.assetTypeTo}</Col>
                            </Row>,
                            <hr key="2-hr" />,
                            <Row key="3">
                                <Col md="3">expiration</Col>
                                <Col md="9">{order.order.expiration}</Col>
                            </Row>,
                            <hr key="3-hr" />,
                            <Row key="4">
                                <Col md="3">lockScriptHashFee</Col>
                                <Col md="9">{order.order.lockScriptHashFee}</Col>
                            </Row>,
                            <hr key="4-hr" />,
                            <Row key="4">
                                <Col md="3">lockScriptHashFrom</Col>
                                <Col md="9">{order.order.lockScriptHashFrom}</Col>
                            </Row>,
                            <hr key="4-hr" />,
                            <Row key="5">
                                <Col md="3">orderHash</Col>
                                <Col md="9">{order.order.orderHash}</Col>
                            </Row>,
                            <hr key="5-hr" />,
                            <Row key="6">
                                <Col md="3">originOutputs</Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {order.order.originOutputs.length !== 0
                                            ? order.order.originOutputs.map(output => output.tracker).join("\n")
                                            : "None"}
                                    </div>
                                </Col>
                            </Row>,
                            <hr key="6-hr" />,
                            <Row key="7">
                                <Col md="3">parametersFee</Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {order.order.parametersFee.length !== 0
                                            ? order.order.parametersFee.join("\n")
                                            : "None"}
                                    </div>
                                </Col>
                            </Row>,
                            <hr key="7-hr" />,
                            <Row key="8">
                                <Col md="3">parametersFrom</Col>
                                <Col md="9">{order.order.parametersFrom ? order.order.parametersFrom : "None"}</Col>
                            </Row>,
                            <hr key="8-hr" />,
                            <Row key="9">
                                <Col md="3">shardIdFee</Col>
                                <Col md="9">{order.order.shardIdFee.toString()}</Col>
                            </Row>,
                            <hr key="9-hr" />,
                            <Row key="10">
                                <Col md="3">shardIdFrom</Col>
                                <Col md="9">{order.order.shardIdFrom.toString()}</Col>
                            </Row>,
                            <hr key="10-hr" />,
                            <Row key="11">
                                <Col md="3">shardIdTo</Col>
                                <Col md="9">{order.order.shardIdTo.toString()}</Col>
                            </Row>,
                            <hr key="11-hr" />
                        ]}
                    </DataSet>
                </Col>
            </Row>
        ];
    };

    private loadMoreOrder = () => {
        this.setState({ page: this.state.page + 1 });
    };
}
