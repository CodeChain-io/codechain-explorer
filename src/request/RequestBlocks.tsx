import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { BlockDoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";

export interface BlocksResponse {
    data: BlockDoc[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    firstEvaluatedKey: string;
    lastEvaluatedKey: string;
}

interface OwnProps {
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage: number;
    showProgressBar: boolean;
    onBlocks: (blocks: BlocksResponse) => void;
    onError: (e: ApiError) => void;
}

type Props = OwnProps & DispatchProp;

class RequestBlocks extends React.Component<Props> {
    public componentWillMount() {
        const {
            onError,
            onBlocks,
            dispatch,
            lastEvaluatedKey,
            firstEvaluatedKey,
            itemsPerPage,
            showProgressBar
        } = this.props;
        const path = `block?itemsPerPage=${itemsPerPage}${
            lastEvaluatedKey ? `&lastEvaluatedKey=${lastEvaluatedKey}` : ""
        }${firstEvaluatedKey ? `&firstEvaluatedKey=${firstEvaluatedKey}` : ""}`;
        apiRequest({
            path,
            dispatch,
            showProgressBar
        })
            .then((response: any) => {
                onBlocks(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestBlocks);
