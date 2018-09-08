import { H256 } from "codechain-sdk/lib/core/classes";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetMintTransactionDoc, TransactionDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    hash: string;
    onTransaction: (transaction: TransactionDoc) => void;
    onTransactionNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
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
        const { cached, dispatch, hash, onTransaction, onTransactionNotExist, onError, progressBarTarget } = this.props;
        if (cached) {
            setTimeout(() => onTransaction(cached));
            return;
        }
        apiRequest({
            path: `tx/${hash}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: TransactionDoc) => {
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
                    });
                }
                onTransaction(transaction);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestTransaction = connect(
    (state: RootState, props: OwnProps) => {
        if (Type.isH256String(props.hash)) {
            return {
                cached: state.appReducer.transactionByHash[new H256(props.hash).value]
            };
        }
        return { cached: state.appReducer.transactionByHash[props.hash] };
    },
    (dispatch: Dispatch) => ({ dispatch })
)(RequestTransactionInternal);

export default RequestTransaction;
