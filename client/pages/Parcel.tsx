import * as React from "react";
import { RequestParcel, RequestTransactionInvoice } from "../components/requests";
import { connect } from "react-redux";
import { RootState } from "../redux/actions";
import ParcelDetails from "../components/ParcelDetails";

interface Props {
    match: any;
}

interface StateProps {
    parcelByHash: any;
    parcelInvoiceByHash: any;
}

class ParcelInternal extends React.Component<Props & StateProps> {
    public render() {
        const { parcelByHash, parcelInvoiceByHash, match } = this.props;
        const { hash } = match.params;
        const parcel = parcelByHash[hash];
        // FIXME: broken invoice
        const invoice = parcelInvoiceByHash[hash];

        return (
            <div>
                {parcel
                    ? <ParcelDetails parcel={parcel} />
                    : <div>loading tx ... <RequestParcel hash={hash} /></div>}
                <hr />
                <h4>Invoice</h4>
                {invoice
                    ? <div><pre>{JSON.stringify(invoice, null, 4)}</pre></div>
                    : <div>loading ... <RequestTransactionInvoice hash={hash} /></div>}
            </div>
        )
    }
}

const Parcel = connect((state: RootState) => {
    return {
        parcelByHash: state.parcelByHash,
        parcelInvoiceByHash: state.transactionInvoicesByHash,
    } as StateProps;
})(ParcelInternal);

export default Parcel;
