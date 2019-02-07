import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { H256 } from "codechain-sdk/lib/core/classes";

import { BlockDoc } from "codechain-indexer-types";
import { RootState } from "../redux/actions";
import { getCurrentTimestamp } from "../utils/Time";
import { apiRequest } from "./ApiRequest";

interface OwnProps {
    id: number | string;
    onBlock: (b: BlockDoc) => void;
    onError: (e: any) => void;
    onBlockNotExist: () => void;
    progressBarTarget?: string;
}

interface StateProps {
    cached?: { data: BlockDoc; updatedAt: number };
}

interface DispatchProps {
    dispatch: Dispatch;
}
type Props = OwnProps & StateProps & DispatchProps;
class RequestBlock extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, onError, onBlock, id, progressBarTarget, onBlockNotExist } = this.props;

        if (cached && getCurrentTimestamp() - cached.updatedAt < 10) {
            setTimeout(() => onBlock(cached.data));
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

                if (block.transactions) {
                    block.transactions.map(transaction => {
                        dispatch({
                            type: "CACHE_TRANSACTION",
                            data: transaction
                        });
                        if (transaction.type === "mintAsset") {
                            dispatch({
                                type: "CACHE_ASSET_SCHEME",
                                data: {
                                    assetType: transaction.mintAsset.assetType,
                                    assetScheme: transaction.mintAsset
                                }
                            });
                        }
                    });
                }
                onBlock(block);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect((state: RootState, props: OwnProps) => {
    const { blocksByHash, blocksByNumber } = state.appReducer;
    const { id } = props;
    if (H256.check(id)) {
        const strId = String(id);
        return {
            cached: blocksByHash[new H256(strId).value] && {
                data: blocksByHash[new H256(strId).value].data,
                updatedAt: blocksByHash[new H256(strId).value].updatedAt
            }
        };
    } else {
        return {
            cached: blocksByNumber[id] && {
                data: blocksByNumber[id].data,
                updatedAt: blocksByNumber[id].updatedAt
            }
        };
    }
    return {};
})(RequestBlock);
