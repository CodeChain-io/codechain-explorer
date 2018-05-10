import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { getPingDispatcher, RootState } from "./redux/actions";

interface ServerStatusProps {
    isNodeAlive: boolean | null;
}

// FIXME:
interface DispatcherProps {
    ping: () => Promise<void>
}

class ServerStatusInternal extends React.Component<ServerStatusProps & DispatcherProps> {
    public componentDidMount() {
        setInterval(() => {
            this.props.ping();
        }, 3000);
    }

    public render() {
        const { isNodeAlive } = this.props;
        if (isNodeAlive === null) {
            return <div>Checking whether node is alive</div>
        } else if (isNodeAlive) {
            return <div>Node is available</div>
        } else {
            return <div>Node is not available</div>
        }
    }
}

const mapStateToProps = (state: RootState) => ({ isNodeAlive: state.isNodeAlive });
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ping: getPingDispatcher(dispatch)
    } as DispatcherProps;
};

const ServerStatus = connect(mapStateToProps, mapDispatchToProps)(ServerStatusInternal);

export default ServerStatus;
