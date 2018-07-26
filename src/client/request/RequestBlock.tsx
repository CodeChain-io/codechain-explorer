import * as React from "react";
import * as _ from "lodash"
import { connect, Dispatch } from "react-redux";

import { H256 } from "codechain-sdk/lib/core/classes";

import { apiRequest } from "./ApiRequest";
import { RootState } from "../redux/actions";
import { BlockDoc, Type, ChangeShardStateDoc, AssetMintTransactionDoc } from "../../db/DocType";

interface OwnProps {
    id: number | string;
    onBlock: (b: BlockDoc) => void;
    onError: (e: any) => void;
}

interface StateProps {
    cached?: BlockDoc;
}

interface DispatchProps {
    dispatch: Dispatch;
}

class RequestBlockInternal extends React.Component<OwnProps & StateProps & DispatchProps> {
    public componentWillMount() {
        const { cached, dispatch, onError, onBlock, id } = this.props;
        if (cached) {
            setTimeout(() => onBlock(cached));
            return;
        }
        apiRequest({ path: `block/${id}`, dispatch }).then((response: BlockDoc) => {
            const block = response;
            dispatch({
                type: "CACHE_BLOCK",
                data: block
            });
            _.each(block.parcels, (parcel) => {
                dispatch({
                    type: "CACHE_PARCEL",
                    data: parcel
                })
                if (Type.isChangeShardStateDoc(parcel.action)) {
                    _.each((parcel.action as ChangeShardStateDoc).transactions, (transaction) => {
                        dispatch({
                            type: "CACHE_TRANSACTION",
                            data: transaction
                        })

                        if (Type.isAssetMintTransactionDoc(transaction)) {
                            dispatch({
                                type: "CACHE_ASSET_SCHEME",
                                data: {
                                    assetType: (transaction as AssetMintTransactionDoc).data.output.assetType,
                                    assetScheme: Type.getAssetSchemeDoc(transaction as AssetMintTransactionDoc)
                                }
                            })
                        }
                    })
                }
            })

            onBlock(block);
        }).catch(onError)
    }

    public render() {
        return (null);
    }
}

function isString(x: number | string): x is string {
    return typeof x === "string";
}

const RequestBlock = connect((state: RootState, props: OwnProps) => {
    const { blocksByHash, blocksByNumber } = state.appReducer;
    const { id } = props;
    if (isString(id)) {
        if (id.length === 66 || id.length === 64) {
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
