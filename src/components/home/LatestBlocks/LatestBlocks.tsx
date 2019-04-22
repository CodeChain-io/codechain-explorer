import * as _ from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";

import { BlockDoc } from "codechain-indexer-types";
import { connect } from "react-redux";
import { RootState } from "src/redux/actions";
import RequestServerTime from "src/request/RequestServerTime";
import { getUnixTimeLocaleString } from "src/utils/Time";
import DataTable from "../../util/DataTable/DataTable";
import "./LatestBlocks.scss";

interface OwnProps {
    blocks: BlockDoc[];
}
interface StateProps {
    serverTimeOffset?: number;
}
type Props = OwnProps & StateProps;

const LatestBlocks = (props: Props) => {
    const { blocks } = props;
    const { serverTimeOffset } = props;

    if (serverTimeOffset === undefined) {
        return <RequestServerTime />;
    }

    return (
        <div className="latest-blocks">
            <h1>Latest Blocks</h1>
            <div className="latest-container">
                <DataTable>
                    <thead>
                        <tr>
                            <th style={{ width: "25%" }}>No.</th>
                            <th style={{ width: "25%" }}>Hash</th>
                            <th style={{ width: "15%" }} className="text-right">
                                Tx
                            </th>
                            <th style={{ width: "35%" }} className="text-right">
                                Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(blocks.slice(0, 10), (block: BlockDoc) => {
                            return (
                                <tr key={`home-block-num-${block.hash}`} className="animated fadeIn">
                                    <td scope="row">
                                        <Link to={`/block/${block.number}`}>{block.number.toLocaleString()}</Link>
                                    </td>
                                    <td>
                                        <Link to={`/block/${block.hash}`}>{`0x${block.hash}`}</Link>
                                    </td>
                                    <td className="text-right">{block.transactionsCount.toLocaleString()}</td>
                                    <td className="text-right">
                                        {block.timestamp
                                            ? getUnixTimeLocaleString(block.timestamp, serverTimeOffset)
                                            : "Genesis"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </DataTable>
                {
                    <div className="mt-small">
                        <Link to={"/blocks"}>
                            <button type="button" className="btn btn-primary w-100">
                                <span>View all blocks</span>
                            </button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default connect((state: RootState) => {
    return {
        serverTimeOffset: state.appReducer.serverTimeOffset
    };
})(LatestBlocks);
