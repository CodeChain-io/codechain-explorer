import * as React from "react";
import { connect } from "react-redux";

import { RootState } from "./redux/actions";

interface ServerStatusProps {
    isNodeAlive?: boolean;
}

class ServerStatusInternal extends React.Component<ServerStatusProps> {
    public render() {
        const { isNodeAlive } = this.props;
        if (isNodeAlive === undefined) {
            return <div>Checking whether node is alive</div>
        } else if (isNodeAlive) {
            return <div>Node is available</div>
        } else {
            return <div>Node is not available</div>
        }
    }
}

const mapStateToProps = (state: RootState) => ({ isNodeAlive: state.isNodeAlive });
const ServerStatus = connect(mapStateToProps, null)(ServerStatusInternal);

export default ServerStatus;
