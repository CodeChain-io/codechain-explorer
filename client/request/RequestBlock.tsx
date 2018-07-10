import * as React from "react";
import * as _ from "lodash"
import { connect, Dispatch } from "react-redux";

import { Block, ChangeShardState, H256 } from "codechain-sdk/lib/core/classes";

import { apiRequest } from "./ApiRequest";
import { RootState } from "../redux/actions";

interface OwnProps {
    id: number | string;
    onBlock: (b: Block) => void;
    onError: (e: any) => void;
}

interface StateProps {
    cached?: Block;
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
        apiRequest({ path: `block/${id}` }).then(response => {
            const block = Block.fromJSON(response);
            dispatch({
                type: "CACHE_BLOCK",
                data: block
            });
            _.each(block.parcels, (parcel) => {
                dispatch({
                    type: "CACHE_PARCEL",
                    data: parcel
                })
                if (parcel.unsigned.action instanceof ChangeShardState) {
                    _.each(parcel.unsigned.action.transactions, (transaction) => {
                        dispatch({
                            type: "CACHE_TRANSACTION",
                            data: transaction
                        })
                    })
                }
            })

            onBlock(block);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

function isString(x: number | string): x is string {
    return typeof x === "string";
}

const RequestBlock = connect((state: RootState, props: OwnProps) => {
    const { blocksByHash, blocksByNumber } = state;
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
