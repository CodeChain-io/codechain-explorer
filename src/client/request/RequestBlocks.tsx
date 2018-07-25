import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { BlockDoc } from "../../db/DocType";

interface OwnProps {
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestBlocks extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onError, onBlocks } = this.props;
        apiRequest({ path: `blocks` }).then((response: any) => {
            onBlocks(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestBlocks;
