import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { H256 } from "codechain-sdk/lib/core/classes";

import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";
import { TransactionDoc, Type, AssetMintTransactionDoc } from "../../db/DocType";

interface OwnProps {
    hash: string;
    onTransaction: (transaction: TransactionDoc) => void;
    onTransactionNotExist: () => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached?: TransactionDoc;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestTransactionInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, hash, onTransaction, onTransactionNotExist, onError } = this.props;
        if (cached) {
            setTimeout(() => onTransaction(cached));
            return;
        }
        apiRequest({ path: `tx/${hash}` }).then((response: TransactionDoc) => {
            if (response === null) {
                return onTransactionNotExist();
            }
            // FIXME: Modify to using static sdk function without sdk object.
            const transaction = response;
            dispatch({
                type: "CACHE_TRANSACTION",
                data: transaction
            });

            if (Type.isAssetMintTransactionDoc(transaction)) {
                dispatch({
                    type: "CACHE_ASSET_SCHEME",
                    data: {
                        assetType: (transaction as AssetMintTransactionDoc).data.output.assetType,
                        assetScheme: Type.getAssetSchemeDoc(transaction as AssetMintTransactionDoc)
                    }
                })
            }
            onTransaction(transaction);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestTransaction = connect((state: RootState, props: OwnProps) => {
    if (props.hash.length === 66 || props.hash.length === 64) {
        return { cached: state.transactionByHash[new H256(props.hash).value] };
    }
    return { cached: state.transactionByHash[props.hash] };
}, (dispatch: Dispatch) => ({ dispatch }))(RequestTransactionInternal);

export default RequestTransaction;
