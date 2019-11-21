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
    pages: [undefined, ...string[]];
    hasNextPage?: boolean;
    lastEvaluatedKey?: string;
}

type Props = OwnProps;

class BlockTransactionList extends React.Component<Props, State> {
    private itemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            pages: [undefined]
        };
    }

    public render() {
        const { pages, hasNextPage } = this.state;
        const { blockId } = this.props;
        return (
            <div className="parcel-transaction-list">
                {this.renderTransactionListTitle()}
                {pages.map(page => (
                    <BlockTransactionListPage
                        lastEvaluatedKey={page}
                        blockId={blockId}
                        itemsPerPage={this.itemsPerPage}
                        onLoad={this.handlePageLoad}
                    />
                ))}
                {hasNextPage && (
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
        const { pages, lastEvaluatedKey } = this.state;
        this.setState({ pages: [...pages, lastEvaluatedKey] as [undefined, ...string[]] });
    };

    private handlePageLoad = (params: {
        requestedKey: string | undefined;
        requestedItemsPerPage: number;
        hasNextPage: boolean;
        lastEvaluatedKey: string;
    }) => {
        const { requestedKey, hasNextPage, lastEvaluatedKey } = params;
        if (_.last(this.state.pages) === requestedKey) {
            this.setState({
                hasNextPage,
                lastEvaluatedKey
            });
        }
    };
}

export default BlockTransactionList;
