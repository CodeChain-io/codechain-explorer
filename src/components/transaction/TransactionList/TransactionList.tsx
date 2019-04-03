import * as _ from "lodash";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { TransactionDoc } from "codechain-indexer-types";
import { H160 } from "codechain-sdk/lib/core/classes";

import TransactionListItems from "../TransactionListItems/TransactionListItems";

import "./TransactionList.scss";

interface OwnProps {
    owner?: string;
    assetType?: H160;
    transactions: TransactionDoc[];
    loadMoreAction?: () => void;
    totalCount: number;
    hideMoreButton?: boolean;
}

interface State {
    page: number;
}

type Props = OwnProps;

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
        const { transactions, loadMoreAction, hideMoreButton, owner, assetType } = this.props;
        let loadedTransactions;
        if (loadMoreAction) {
            loadedTransactions = transactions;
        } else {
            loadedTransactions = transactions.slice(0, this.itemPerPage * page);
        }
        return (
            <div className="parcel-transaction-list">
                {this.renderTransactionListTitle()}
                <TransactionListItems transactions={loadedTransactions} assetType={assetType} owner={owner} />
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
