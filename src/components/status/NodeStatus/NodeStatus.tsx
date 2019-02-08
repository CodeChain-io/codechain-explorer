import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

import DataSet from "../../util/DataSet/DataSet";
import "./NodeStatus.scss";

interface Props {
    nodeStatus: boolean;
}

class NodeStatus extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { nodeStatus } = this.props;
        return (
            <div className="node-status">
                <div>
                    <h2>Node Status</h2>
                    <hr className="heading-hr" />
                </div>
                <DataSet isStatus={true}>
                    <div className="one-line-data-set">
                        <div>Status</div>
                        <div>
                            {nodeStatus ? (
                                <span className="running">
                                    <FontAwesomeIcon icon={faCircle} /> Running
                                </span>
                            ) : (
                                <span className="text-danger">
                                    <FontAwesomeIcon icon={faCircle} /> Stopped
                                </span>
                            )}
                        </div>
                    </div>
                    <hr />
                </DataSet>
            </div>
        );
    }
}

export default NodeStatus;
