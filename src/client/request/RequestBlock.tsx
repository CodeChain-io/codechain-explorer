import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { H256 } from "codechain-sdk/lib/core/classes";

import { AssetMintTransactionDoc, AssetTransactionGroupDoc, BlockDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { RootState } from "../redux/actions";
import { apiRequest } from "./ApiRequest";

interface OwnProps {
    id: number | string;
    onBlock: (b: BlockDoc) => void;
    onError: (e: any) => void;
    onBlockNotExist: () => void;
    progressBarTarget?: string;
}

interface StateProps {
    cached?: BlockDoc;
}

interface DispatchProps {
    dispatch: Dispatch;
}

class RequestBlockInternal extends React.Component<OwnProps & StateProps & DispatchProps> {
    public componentWillMount() {
        const { cached, dispatch, onError, onBlock, id, progressBarTarget, onBlockNotExist } = this.props;
        if (cached) {
            setTimeout(() => onBlock(cached));
            return;
        }
        apiRequest({
            path: `block/${id}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: BlockDoc) => {
                if (response === null) {
                    return onBlockNotExist();
                }
                const block = response;
                dispatch({
                    type: "CACHE_BLOCK",
                    data: block
                });
                _.each(block.parcels, parcel => {
                    dispatch({
                        type: "CACHE_PARCEL",
                        data: parcel
                    });
                    if (Type.isAssetTransactionGroupDoc(parcel.action)) {
                        _.each((parcel.action as AssetTransactionGroupDoc).transactions, transaction => {
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
                        });
                    }
                });

                onBlock(block);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

function isString(x: number | string): x is string {
    return typeof x === "string";
}

const RequestBlock = connect((state: RootState, props: OwnProps) => {
    const { blocksByHash, blocksByNumber } = state.appReducer;
    const { id } = props;
    if (isString(id)) {
        if (Type.isH256String(id)) {
            return {
                cached: blocksByHash[new H256(id).value]
            };
        } else {
            return {
                cached: blocksByNumber[id] || blocksByHash[id]
            };
        }
    } else {
        return {
            cached: blocksByNumber[id] || blocksByHash[id]
        };
    }
})(RequestBlockInternal);

export default RequestBlock;
