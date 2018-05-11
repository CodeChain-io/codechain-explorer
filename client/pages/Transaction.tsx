import * as React from "react";
import { RequestTransaction, RequestTransactionInvoice } from "../components/requests";
import { connect } from "react-redux";
import { RootState } from "../redux/actions";

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
                    ? <div>{JSON.stringify(transaction)}</div>
                    : <div>loading tx ... <RequestTransaction hash={hash} /></div>}
                {invoice
                    ? <div>{JSON.stringify(invoice)}</div>
                    : <div>loading invoice ... <RequestTransactionInvoice hash={hash} /></div>}
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
