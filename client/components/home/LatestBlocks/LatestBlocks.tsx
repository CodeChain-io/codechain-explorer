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
        <h3>Latest Blocks</h3>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Height</th>
                        <th>Parcels</th>
                        <th>Txs</th>
                        <th>Author</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(_.reverse(_.values(blocksByNumber)), block => {
                            return (
                                <tr key={`home-block-num-${block.hash.value}`}>
                                    <th scope="row"><Link to={`/block/${block.number}`}>{block.number}</Link></th>
                                    <td>{block.parcels.length}</td>
                                    <td>{_.reduce(block.parcels, (memo, parcel) => {
                                        const action: any = parcel.unsigned.action.toJSON();
                                        const txCount = action.transactions ? action.transactions.length : 0;
                                        return memo + txCount;
                                    }, 0)}</td>
                                    <td><HexString link={`/addr-platform/0x${block.author.value}`} text={block.author.value} length={10} /></td>
                                    <td>{moment.unix(block.timestamp).fromNow()}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
    </div>
};

export default LatestBlocks;
