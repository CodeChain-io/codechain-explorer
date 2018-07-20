import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';

import './LatestParcels.scss';
import HexString from "../../util/HexString/HexString";
import { BlockDoc } from "../../../db/DocType";

interface Props {
    blocksByNumber: {
        [n: number]: BlockDoc;
    }
}

const LatestParcels = (props: Props) => {
    const { blocksByNumber } = props;
    return <div className="latest-parcels">
        <h1>Latest Parcels</h1>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Hash</th>
                        <th>Signer</th>
                        <th>Fee</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(_.reverse(_.values(blocksByNumber)), block => {
                            return _.map(block.parcels, (parcel) => {
                                const actionString = parcel.action.action;
                                return (
                                    <tr key={`home-parcel-${parcel.hash}`}>
                                        <td><div className={`parcel-type text-center ${actionString === "changeShardState" ? "change-shard-state-type" : (actionString === "payment" ? "payment-type" : "set-regular-key-type")}`}>{actionString}</div></td>
                                        <td scope="row"><HexString link={`/parcel/0x${parcel.hash}`} text={parcel.hash} length={10} /></td>
                                        <td><HexString link={`/addr-platform/0x${parcel.sender}`} text={parcel.sender} length={10} /></td>
                                        <td>{parcel.fee}</td>
                                        <td>{moment.unix(block.timestamp).fromNow()}</td>
                                    </tr>
                                );
                            })
                        })
                    }
                </tbody>
            </Table>
            {
                /*
                    <div className="mt-3">
                        <div className="view-all-btn text-center mx-auto">
                            <span>View All</span>
                        </div>
                    </div>
                */
            }
        </div>
    </div>
};

export default LatestParcels;
