import * as _ from "lodash";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionDoc } from "codechain-indexer-types";
import { H160 } from "codechain-sdk/lib/core/classes";

import TransactionListItems from "../TransactionListItems/TransactionListItems";

import "./TransactionList.scss";

interface OwnProps {
    owner?: string;
    assetType?: H160;
    transactions: TransactionDoc[];
    loadMoreAction?: () => void;
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
                {transactions.length === 0 ? (
                    <div className="text-center mt-3">
                        <FontAwesomeIcon className="spin" icon={faSpinner} spin={true} size={"2x"} />
                    </div>
                ) : null}
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
        const { transactions } = this.props;
        return (
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-end">
                        {transactions.length === 1 ? <h2>Transaction</h2> : <h2>Transactions</h2>}
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
