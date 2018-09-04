import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { toast } from "react-toastify";

import { RequestPing } from "../../../request";

import "./HealthChecker.scss";

interface State {
    isNodeAlive?: boolean;
    isDead: boolean;
}

interface Props {
    isSimple?: boolean;
}

class HealthChecker extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isDead: false
        };
    }
    public render() {
        const { isSimple } = this.props;
        const { isNodeAlive, isDead } = this.state;
        if (isNodeAlive === undefined) {
            return (
                <div className="health-checker">
                    {isSimple ? "" : "Status"}{" "}
                    <span className="text-warning">
                        <FontAwesomeIcon icon={faCircle} />
                    </span>
                    <RequestPing onPong={this.onPong} onError={this.onError} onDead={this.serverDeadNotify} />
                </div>
            );
        }
        return (
            <div className="health-checker">
                {isNodeAlive ? (
                    <div>
                        {isSimple ? "" : "Status"}{" "}
                        <span className="text-success">
                            <FontAwesomeIcon icon={faCircle} />
                        </span>
                    </div>
                ) : (
                    <div>
                        {isSimple ? "" : "Status"}{" "}
                        <span className="text-danger">
                            <FontAwesomeIcon icon={faCircle} />
                        </span>
                    </div>
                )}
                {!isDead ? (
                    <RequestPing
                        repeat={5000}
                        onPong={this.onPong}
                        onError={this.onError}
                        onDead={this.serverDeadNotify}
                    />
                ) : null}
            </div>
        );
    }

    private onPong = () => {
        this.setState({ isNodeAlive: true });
    };

    private onError = () => {
        this.setState({ isNodeAlive: false });
    };

    private serverDeadNotify = () => {
        this.setState({ isDead: true });
        toast.error("500. There was an error. Please try again later.", {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    };
}

export default HealthChecker;
