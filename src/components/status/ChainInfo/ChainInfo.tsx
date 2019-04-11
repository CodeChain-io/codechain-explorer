import * as React from "react";

import { CodeChainData } from "../../../request/RequestCodeChainStatus";
import DataSet from "../../util/DataSet/DataSet";
import "./ChainInfo.scss";

interface Props {
    chainInfo: CodeChainData;
}

class ChainInfo extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { chainInfo } = this.props;
        return (
            <div className="chain-info">
                <div>
                    <h2>CodeChain Information</h2>
                    <hr className="heading-hr" />
                </div>
                <DataSet isStatus={true}>
                    <div className="one-line-data-set">
                        <div>Network ID</div>
                        <div>{chainInfo.networkId}</div>
                    </div>
                    <hr />
                </DataSet>
            </div>
        );
    }
}

export default ChainInfo;
