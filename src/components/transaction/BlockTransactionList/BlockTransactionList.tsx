import * as _ from "lodash";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { H160 } from "codechain-sdk/lib/core/classes";

import "./BlockTransactionList.scss";
import BlockTransactionListPage from "./BlockTransactionListPage";

interface OwnProps {
    blockId: number | string;
    owner?: string;
    assetType?: H160;
    totalCount: number;
}

interface State {
    pages: number;
}

type Props = OwnProps;

class BlockTransactionList extends React.Component<Props, State> {
    private itemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            pages: 1
        };
    }

    public render() {
        const { pages } = this.state;
        const { blockId, totalCount } = this.props;
        return (
            <div className="parcel-transaction-list">
                {this.renderTransactionListTitle()}
                {_.range(1, pages + 1).map(page => {
                    return (
                        <BlockTransactionListPage
                            key={page}
                            blockId={blockId}
                            page={page}
                            itemsPerPage={this.itemsPerPage}
                        />
                    );
                })}
                {pages * this.itemsPerPage < totalCount && (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Transactions
                                </button>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        );
    }

    private renderTransactionListTitle = () => {
        const { totalCount } = this.props;
        return (
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-end">
                        {totalCount === 1 ? <h2>Transaction</h2> : <h2>Transactions</h2>}
                        {totalCount !== 1 && <span>Total {totalCount} transactions</span>}
                    </div>
                    <hr className="heading-hr" />
                </Col>
            </Row>
        );
    };

    private loadMore = () => {
        this.setState({ pages: this.state.pages + 1 });
    };
}

export default BlockTransactionList;
