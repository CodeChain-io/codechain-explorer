import * as _ from "lodash";
import * as React from "react";

import { TransactionDoc } from "codechain-indexer-types";
import { H160 } from "codechain-sdk/lib/core/classes";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionsResponse } from "src/request/RequestTransactions";
import RequestBlockTransactions from "../../../request/RequestBlockTransactions";
import TransactionListItems from "../TransactionListItems/TransactionListItems";

interface OwnProps {
    lastEvaluatedKey?: string;
    itemsPerPage: number;
    blockId: number | string;
    assetType?: H160;
    owner?: string;
    onLoad: (
        params: {
            requestedKey: string | undefined;
            requestedItemsPerPage: number;
            hasNextPage: boolean;
            lastEvaluatedKey: string;
        }
    ) => void;
}

interface State {
    transactions?: TransactionDoc[];
}

type Props = OwnProps;

class BlockTransactionListPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const { transactions } = this.state;
        if (transactions == null) {
            const { blockId, lastEvaluatedKey, itemsPerPage } = this.props;
            return (
                <div>
                    <div className="text-center mt-3">
                        <FontAwesomeIcon className="spin" icon={faSpinner} spin={true} size={"2x"} />
                    </div>
                    <RequestBlockTransactions
                        id={blockId}
                        lastEvaluatedKey={lastEvaluatedKey}
                        itemsPerPage={itemsPerPage}
                        onTransactions={this.onLoad}
                        onError={console.error}
                    />
                </div>
            );
        }
        const { assetType, owner } = this.props;
        return <TransactionListItems transactions={transactions} assetType={assetType} owner={owner} />;
    }

    private onLoad = (response: TransactionsResponse) => {
        const { data: transactions, hasNextPage, lastEvaluatedKey } = response;
        this.setState({ transactions });
        const { lastEvaluatedKey: requestedKey, itemsPerPage: requestedItemsPerPage } = this.props;
        this.props.onLoad({ requestedKey, requestedItemsPerPage, hasNextPage, lastEvaluatedKey });
    };
}

export default BlockTransactionListPage;
