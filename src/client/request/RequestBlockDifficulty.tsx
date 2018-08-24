import * as React from "react";
import * as _ from "lodash";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { BlockDoc } from "../../db/DocType";

interface OwnProps {
    onBlockDifficulty: (difficulty: Array<{ Score: number }>) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestBlockDifficultyInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError } = this.props;
        try {
            this.requestNodeStat();
        } catch (e) {
            onError(e);
        }
    }

    public render() {
        return (null);
    }

    private requestNodeStat = async () => {
        const { onBlockDifficulty, dispatch } = this.props;
        const blocks: any = await apiRequest({ path: `/blocks?page=1&itmesPerBlock=10`, dispatch, showProgressBar: true });

        onBlockDifficulty(_.map(_.reverse(blocks), (block: BlockDoc) => {
            return {
                Score: parseInt(block.score, 10)
            };
        }))
    }
}

const RequestBlockDifficulty = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestBlockDifficultyInternal);

export default RequestBlockDifficulty;
