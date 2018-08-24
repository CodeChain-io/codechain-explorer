import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { BigNumber } from "bignumber.js";

import "./LatestBlocks.scss";
import { BlockDoc } from "../../../../db/DocType";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";

interface Props {
    blocks: BlockDoc[]
}

const LatestBlocks = (props: Props) => {
    const { blocks } = props;
    const miningReward = process.env.REACT_APP_DEFAULT_MINING_REWARD ? Number(process.env.REACT_APP_DEFAULT_MINING_REWARD) : 50;
    return <div className="latest-blocks">
        <h1>Latest Blocks</h1>
        <div className="latest-container">
            <Table striped={true} className="data-table">
                <thead>
                    <tr>
                        <th style={{ width: '15%' }}>No.</th>
                        <th style={{ width: '15%' }}>Parcels</th>
                        <th style={{ width: '35%' }}>Author</th>
                        <th style={{ width: '15%' }}>Reward</th>
                        <th style={{ width: '20%' }}>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(blocks.slice(0, 10), block => {
                            return (
                                <tr key={`home-block-num-${block.hash}`}>
                                    <td scope="row"><Link to={`/block/${block.number}`}>{block.number.toLocaleString()}</Link></td>
                                    <td>{block.parcels.length.toLocaleString()}</td>
                                    <td><Link to={`/addr-platform/${block.author}`}>{block.author}</Link></td>
                                    <td><CommaNumberString text={_.reduce(block.parcels, (memo, parcel) => new BigNumber(parcel.fee).plus(memo), new BigNumber(0)).div(Math.pow(10, 9)).plus(miningReward).toString(10)} />CCC</td>
                                    <td>{moment.unix(block.timestamp).fromNow()}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
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
};

export default LatestBlocks;
