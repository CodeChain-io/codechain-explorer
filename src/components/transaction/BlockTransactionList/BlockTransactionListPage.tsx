import * as _ from "lodash";
import * as React from "react";

import { TransactionDoc } from "codechain-indexer-types";
import { H160 } from "codechain-sdk/lib/core/classes";

import RequestBlockTransactions from "src/request/RequestBlockTransactions";
import TransactionListItems from "../TransactionListItems/TransactionListItems";

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
        const { assetType, owner } = this.props;
        return <TransactionListItems transactions={transactions} assetType={assetType} owner={owner} />;
    }

    private onLoad = (transactions: TransactionDoc[]) => {
        this.setState({ transactions });
    };
}

export default TransactionLoadableListPage;
