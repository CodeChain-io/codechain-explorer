import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import { Block } from "codechain-sdk/lib/core/classes";

import './LatestParcels.scss';
import HexString from "../../util/HexString/HexString";

interface Props {
    blocksByNumber: {
        [n: number]: Block;
    }
}

const LatestParcels = (props: Props) => {
    const { blocksByNumber } = props;
    return <div className="latest-parcels">
        <h3>Latest Parcels</h3>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Hash</th>
                        <th>Block Number</th>
                        <th>Action</th>
                        <th>Signer</th>
                        <th>Fee</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(_.reverse(_.values(blocksByNumber)), block => {
                            return _.map(block.parcels, (parcel) => {
                                return (
                                    <tr key={`home-parcel-${parcel.hash().value}`}>
                                        <th scope="row"><HexString link={`/parcel/0x${parcel.hash().value}`} text={parcel.hash().value} length={10} /></th>
                                        <td><Link to={`/block/${parcel.blockNumber}`}>{parcel.blockNumber}</Link></td>
                                        <td>{parcel.unsigned.action.toJSON().action}</td>
                                        <td><HexString link={`/addr-platform/0x${parcel.getSender().value}`} text={parcel.getSender().value} length={10} /></td>
                                        <td>{parcel.unsigned.fee.value.toString(10)}</td>
                                        <td>{moment.unix(block.timestamp).fromNow()}</td>
                                    </tr>
                                );
                            })
                        })
                    }
                </tbody>
            </Table>
        </div>
    </div>
};

export default LatestParcels;
