import * as React from "react";

import DataSet from "../../util/DataSet/DataSet";

import "./ExplorerInfo.scss";

class ExplorerInfo extends React.Component {
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
                        <div>1.0.0-beta</div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Indexer version</div>
                        <div>1.0.0-beta</div>
                    </div>
                    <hr />
                </DataSet>
            </div>
        );
    }
}

export default ExplorerInfo;
