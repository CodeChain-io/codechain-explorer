import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

import { NodeStatusData } from "../../../request/RequestNodeStatus";
import DataSet from "../../util/DataSet/DataSet";
import "./NodeStatus.scss";

interface Props {
    nodeStatus: NodeStatusData;
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
                        <div>Node status</div>
                        <div>
                            {nodeStatus.isCodeChainRunning ? (
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
                    <div className="one-line-data-set">
                        <div>Server status</div>
                        <div>
                            {nodeStatus.isServerRunning ? (
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
