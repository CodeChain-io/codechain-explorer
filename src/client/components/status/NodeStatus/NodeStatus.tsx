import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/free-solid-svg-icons'

import "./NodeStatus.scss";

class NodeStatus extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="node-status">
                <div>
                    <h2>Node Status</h2>
                    <hr className="heading-hr" />
                </div>
                <div className="data-set-for-status">
                    <div className="one-line-data-set">
                        <div>
                            CodeChain node status
                        </div>
                        <div>
                            <span className="running"><FontAwesomeIcon icon={faCircle} /> Running</span>
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Explorer server status
                        </div>
                        <div>
                            <span className="running"><FontAwesomeIcon icon={faCircle} /> Running</span>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        )
    }
};

export default NodeStatus;
