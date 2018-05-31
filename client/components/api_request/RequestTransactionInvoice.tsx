import * as React from "react";

import { Invoice } from "codechain-sdk/lib/primitives";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    txhash: string;
    onInvoice: (invoice: Invoice) => void;
    onNotFound: () => void;
    onError: (e: ApiError) => void;
}

class RequestTransactionInvoice extends React.Component<OwnProps> {
    public componentWillMount() {
        const { txhash, onInvoice, onNotFound, onError } = this.props;
        apiRequest({ path: `tx/${txhash}/invoice` }).then((response: any) => {
            if (!response) {
                return onNotFound();
            }
            const invoice = Invoice.fromJSON(response);
            onInvoice(invoice);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestTransactionInvoice;
