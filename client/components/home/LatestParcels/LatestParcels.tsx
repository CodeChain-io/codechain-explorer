import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import { Block } from "codechain-sdk";

import './LatestParcels.scss';

interface Props {
    blocksByNumber: {
        [n: number]: Block;
    }
}

const LatestParcels = (props: Props) => {
    const { blocksByNumber } = props;
    return <div>
        <h3>Latest Parcels</h3>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Hash</th>
                        <th>Signer</th>
                        <th>Block Number</th>
                        <th>Action</th>
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
                                        <th scope="row"><Link to="#">{parcel.hash().value}</Link></th>
                                        <td>{parcel.getSender().value}</td>
                                        <td>{parcel.blockNumber}</td>
                                        <td>{parcel.unsigned.action.toJSON().action}</td>
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
