import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import './LatestBlocks.scss';
import HexString from "../../util/HexString/HexString";
import { BlockDoc } from "../../../db/DocType";

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
                                    <td><HexString link={`/addr-platform/0x${block.author}`} text={block.author} length={10} /></td>
                                    <td>{moment.unix(block.timestamp).fromNow()}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
            <div className="mt-3">
                <div className="view-all-btn text-center mx-auto">
                    <span>View All</span>
                </div>
            </div>
        </div>
    </div>
};

export default LatestBlocks;
