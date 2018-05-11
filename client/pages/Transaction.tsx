import * as React from "react";
import { RequestTransaction, RequestTransactionInvoice } from "../components/requests";
import { connect } from "react-redux";
import { RootState } from "../redux/actions";
import TransactionDetails from "../components/TransactionDetails";

interface Props {
    match: any;
}

interface StateProps {
    transactionsByHash: any;
    transactionInvoicesByHash: any;
}

class TransactionInternal extends React.Component<Props & StateProps> {
    public render() {
        const { transactionsByHash, transactionInvoicesByHash, match } = this.props;
        const { hash } = match.params;
        const transaction = transactionsByHash[hash];
        const invoice = transactionInvoicesByHash[hash];

        return (
            <div>
                {transaction
                    ? <TransactionDetails transaction={transaction} />
                    : <div>loading tx ... <RequestTransaction hash={hash} /></div>}
                <hr />
                <h4>Invoice</h4>
                {invoice
                    ? <div><pre>{JSON.stringify(invoice, null, 4)}</pre></div>
                    : <div>loading ... <RequestTransactionInvoice hash={hash} /></div>}
            </div>
        )
    }
}

const Transaction = connect((state: RootState) => {
    return {
        transactionsByHash: state.transactionsByHash,
        transactionInvoicesByHash: state.transactionInvoicesByHash,
    } as StateProps;
})(TransactionInternal);

export default Transaction;
