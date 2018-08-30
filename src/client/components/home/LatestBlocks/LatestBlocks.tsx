import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";

import { BlockDoc } from "../../../../db/DocType";
import { changeQuarkStringToCCC } from "../../../utils/Formatter";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
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
                <Table striped={true} className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: "15%" }}>No.</th>
                            <th style={{ width: "15%" }}>Parcels</th>
                            <th style={{ width: "35%" }}>Author</th>
                            <th style={{ width: "15%" }}>Reward</th>
                            <th style={{ width: "20%" }}>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(blocks.slice(0, 10), block => {
                            return (
                                <tr key={`home-block-num-${block.hash}`}>
                                    <td scope="row">
                                        <Link to={`/block/${block.number}`}>
                                            {block.number.toLocaleString()}
                                        </Link>
                                    </td>
                                    <td>
                                        {block.parcels.length.toLocaleString()}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/addr-platform/${
                                                block.author
                                            }`}
                                        >
                                            {block.author}
                                        </Link>
                                    </td>
                                    <td>
                                        <CommaNumberString
                                            text={changeQuarkStringToCCC(
                                                block.miningReward
                                            )}
                                        />
                                        CCC
                                    </td>
                                    <td>
                                        {moment.unix(block.timestamp).fromNow()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {
                    <div className="mt-small">
                        <Link to={"/blocks"}>
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                            >
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
