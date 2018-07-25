import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';

import './LatestParcels.scss';
import HexString from "../../util/HexString/HexString";
import { BlockDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";

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
                        _.flatMap(_.reverse(_.values(blocksByNumber)), block => {
                            return _.map(block.parcels, (parcel) => {
                                const actionString = parcel.action.action;
                                return (
                                    <tr key={`home-parcel-${parcel.hash}`}>
                                        <td><div className={`parcel-type text-center ${actionString === "changeShardState" ? "change-shard-state-type" : (actionString === "payment" ? "payment-type" : "set-regular-key-type")}`}>{actionString}</div></td>
                                        <td scope="row"><HexString link={`/parcel/0x${parcel.hash}`} text={parcel.hash} /></td>
                                        <td><Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value}</Link></td>
                                        <td>{parcel.fee}</td>
                                        <td>{moment.unix(block.timestamp).fromNow()}</td>
                                    </tr>
                                );
                            })
                        }).slice(0, 10)
                    }
                </tbody>
            </Table>
            {
                <div className="mt-3">
                    <Link to={"/parcels"}>
                        <div className="view-all-btn text-center mx-auto">
                            <span>View All</span>
                        </div>
                    </Link>
                </div>
            }
        </div>
    </div>
};

export default LatestParcels;
