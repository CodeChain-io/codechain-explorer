import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";

import { BlockDoc } from "codechain-indexer-types";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import DataTable from "../../util/DataTable/DataTable";
import "./LatestBlocks.scss";

interface Props {
    blocks: BlockDoc[];
}

const LatestBlocks = (props: Props) => {
    const { blocks } = props;
    return (
        <div className="latest-blocks">
            <h1>Latest Blocks</h1>
            <div className="latest-container">
                <DataTable>
                    <thead>
                        <tr>
                            <th style={{ width: "15%" }}>No.</th>
                            <th style={{ width: "15%" }}>Transactions</th>
                            <th style={{ width: "35%" }}>Author</th>
                            <th style={{ width: "15%" }} className="text-right">
                                Reward
                            </th>
                            <th style={{ width: "20%" }} className="text-right">
                                Last seen
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
                                    <td>{block.transactionsCount.toLocaleString()}</td>
                                    <td>
                                        <Link to={`/addr-platform/${block.author}`}>{block.author}</Link>
                                    </td>
                                    <td className="text-right">
                                        <CommaNumberString text={block.miningReward} />
                                        CCC
                                    </td>
                                    <td className="text-right">
                                        {block.timestamp ? moment.unix(block.timestamp).fromNow() : "Genesis"}
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

export default LatestBlocks;
