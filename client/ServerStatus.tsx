import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { getPingDispatcher, IRootState } from "./redux/actions";

interface IServerStatusProps {
    isNodeAlive: boolean | null;
}

// FIXME:
interface IDispatcherProps {
    ping: () => Promise<void>
}

class ServerStatusInternal extends React.Component<IServerStatusProps & IDispatcherProps> {
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

const mapStateToProps = (state: IRootState) => ({ isNodeAlive: state.isNodeAlive });
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ping: getPingDispatcher(dispatch)
    } as IDispatcherProps;
};

const ServerStatus = connect(mapStateToProps, mapDispatchToProps)(ServerStatusInternal);

export default ServerStatus;
