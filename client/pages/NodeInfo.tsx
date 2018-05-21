import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/actions";

interface StateProps {
    nodeInfo: any;
}

class NodeInfoInternal extends React.Component<StateProps> {
    public render() {
        const version = this.props.nodeInfo && this.props.nodeInfo.version;
        // FIXME: Resolve unplemented
        return (
            <div>
                <h4>Node Info</h4>
                <div>CodeChain Version: {version}</div>
                <div>Server Timestamp: unimplemented</div>

                <h4>Network Info</h4>
                <div>Network ID: unimplemented</div>
                <div>Peer Count: unimplemented</div>
                <div>Extensions: unimplemented</div>

                <h4>Blockchain Info</h4>
                <div>Block Height: unplemented</div>
                <div>Total Difficulty: unplemented</div>
            </div>
        );
    }
}

// FIXME: not implemented
const NodeInfo = connect((state: RootState) => ({
    nodeInfo: { version: "unimplemented" }
}))(NodeInfoInternal);

export default NodeInfo;
