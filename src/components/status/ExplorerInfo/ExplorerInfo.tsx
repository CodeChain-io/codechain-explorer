import * as React from "react";

import DataSet from "../../util/DataSet/DataSet";

import RequestIndexerVersion from "src/request/RequestIndexerVersion";
import "./ExplorerInfo.scss";

const { version } = require("../../../../package.json");

interface State {
    indexerVersion?: string;
    indexerVersionRequestError?: any;
}

class ExplorerInfo extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div className="explorer-info">
                <div>
                    <h2>Explorer Information</h2>
                    <hr className="heading-hr" />
                </div>
                <DataSet isStatus={true}>
                    <div className="one-line-data-set">
                        <div>Explorer version</div>
                        <div>{version}</div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Indexer version</div>
                        <div>{this.renderIndexerVersion()}</div>
                    </div>
                    <hr />
                </DataSet>
            </div>
        );
    }

    private renderIndexerVersion() {
        const { indexerVersion, indexerVersionRequestError } = this.state;
        if (indexerVersion) {
            return <>{indexerVersion}</>;
        } else if (indexerVersionRequestError === true) {
            return <>unavailable</>;
        } else {
            // FIXME: Progressbar
            return (
                <>
                    loading...
                    <RequestIndexerVersion onVersion={this.onIndexerVersion} onError={this.onError} />
                </>
            );
        }
    }

    private onIndexerVersion = (indexerVersion: string) => {
        this.setState({ indexerVersion });
    };

    private onError = () => {
        this.setState({ indexerVersionRequestError: true });
    };
}

export default ExplorerInfo;
