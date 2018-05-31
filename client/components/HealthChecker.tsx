import * as React from "react";

import { RequestPing } from "./api_request";

interface States {
    isNodeAlive?: boolean;
}

class HealthChecker extends React.Component<{}, States> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        const { isNodeAlive } = this.state;
        if (isNodeAlive === undefined) {
            return <div>Checking whether node is alive <RequestPing onPong={this.onPong} onError={this.onError} /></div>
        } else if (isNodeAlive) {
            return <div>Node is available</div>
        } else {
            return <div>Node is not available</div>
        }
    }

    private onPong = () => {
        this.setState({ isNodeAlive: true });
    }

    private onError = () => {
        this.setState({ isNodeAlive: false });
    }
}

export default HealthChecker;
