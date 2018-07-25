import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import './LatestBlocks.scss';
import { BlockDoc } from "../../../../db/DocType";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";

interface Props {
    blocksByNumber: {
        [n: number]: BlockDoc;
    }
}

const LatestBlocks = (props: Props) => {
    const { blocksByNumber } = props;
    return <div className="latest-blocks">
        <h1>Latest Blocks</h1>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Parcels</th>
                        <th>Reward</th>
                        <th>Author</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(_.reverse(_.values(blocksByNumber)), block => {
                            return (
                                <tr key={`home-block-num-${block.hash}`}>
                                    <td scope="row"><Link to={`/block/${block.number}`}>{block.number}</Link></td>
                                    <td>{block.parcels.length}</td>
                                    <td>{10000}</td>
                                    <td><Link to={`/addr-platform/${PlatformAddress.fromAccountId(block.author).value}`}>{PlatformAddress.fromAccountId(block.author).value.slice(0, 20)}...</Link></td>
                                    <td>{moment.unix(block.timestamp).fromNow()}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
            {
                <div className="mt-3">
                    <Link to={"/blocks"}>
                        <div className="view-all-btn text-center mx-auto">
                            <span>View All</span>
                        </div>
                    </Link>
                </div>
            }
        </div>
    </div>
};

export default LatestBlocks;
