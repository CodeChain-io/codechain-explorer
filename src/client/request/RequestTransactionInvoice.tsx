import * as React from "react";

import { Invoice } from "codechain-sdk/lib/core/classes";

import { ApiError } from "./ApiRequest";

interface OwnProps {
    txhash: string;
    onInvoice: (invoice: Invoice) => void;
    onNotFound: () => void;
    onError: (e: ApiError) => void;
}

class RequestTransactionInvoice extends React.Component<OwnProps> {
    public componentWillMount() {
        // TODO
    }

    public render() {
        return null;
    }
}

export default RequestTransactionInvoice;
