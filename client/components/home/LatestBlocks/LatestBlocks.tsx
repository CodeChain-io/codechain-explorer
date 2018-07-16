import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import { Block } from "codechain-sdk/lib/core/classes";

import './LatestBlocks.scss';
import HexString from "../../util/HexString/HexString";

interface Props {
    blocksByNumber: {
        [n: number]: Block;
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
                                <tr key={`home-block-num-${block.hash.value}`}>
                                    <td scope="row"><Link to={`/block/${block.number}`}>{block.number}</Link></td>
                                    <td>{block.parcels.length}</td>
                                    <td>Block Reward</td>
                                    <td><HexString link={`/addr-platform/0x${block.author.value}`} text={block.author.value} length={10} /></td>
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
