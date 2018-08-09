import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/free-solid-svg-icons'

import { RequestPing } from "../../../request";

import "./HealthChecker.scss";

interface State {
    isNodeAlive?: boolean;
}

interface Props {
    isSimple?: boolean;
}

class HealthChecker extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        const { isSimple } = this.props;
        const { isNodeAlive } = this.state;
        if (isNodeAlive === undefined) {
            return <div className="status">{isSimple ? "" : "Status"} <FontAwesomeIcon icon={faCircle} /><RequestPing onPong={this.onPong} onError={this.onError} /></div>
        }
        return (
            <div className="status">
                {
                    isNodeAlive ? <div>{isSimple ? "" : "Status"} <span className="text-success"><FontAwesomeIcon icon={faCircle} /></span></div>
                        : <div>{isSimple ? "" : "Status"} <span className="text-danger"><FontAwesomeIcon icon={faCircle} /></span></div>
                }
                <RequestPing repeat={5000} onPong={this.onPong} onError={this.onError} />
            </div>
        )
    }

    private onPong = () => {
        this.setState({ isNodeAlive: true });
    }

    private onError = () => {
        this.setState({ isNodeAlive: false });
    }
}

export default HealthChecker;
