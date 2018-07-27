import * as React from "react";
import * as FontAwesome from "react-fontawesome";

import { RequestPing } from "../../../request";

interface State {
    isNodeAlive?: boolean;
}

class HealthChecker extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        const { isNodeAlive } = this.state;
        if (isNodeAlive === undefined) {
            return <div>Status <FontAwesome name="circle" /><RequestPing onPong={this.onPong} onError={this.onError} /></div>
        }
        return (
            <div>
                {
                    isNodeAlive ? <div className="text-success">Status <FontAwesome name="circle" /></div>
                        : <div className="text-danger">Status <FontAwesome name="circle" /></div>
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
