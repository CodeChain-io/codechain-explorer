import * as React from "react";
import * as _ from "lodash";

import "./BlockList.scss";
import HexString from "../../util/HexString/HexString";
import { BlockDoc, Type, ChangeShardStateDoc } from "../../../db/DocType";

interface OwnProps {
    blocks: BlockDoc[]
}

const BlockList = (prop: OwnProps) => {
    return <div className="block-list-container mb-3">
        {
            _.map(prop.blocks, (block, index) => {
                return <table key={`block-list-${index}`} className="block-list-table">
                    <tbody>
                        <tr>
                            <td rowSpan={2}>
                                Block #{block.number}
                            </td>
                            <td>
                                <HexString text={block.hash} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table className="inner-table">
                                    <tbody>
                                        <tr>
                                            <td>Count of parcels</td>
                                            <td>{block.parcels.length}</td>
                                        </tr>
                                        <tr>
                                            <td>Count of transactions</td>
                                            <td>{_.sumBy(block.parcels, (parcel) => (Type.isChangeShardStateDoc(parcel.action) ? (parcel.action as ChangeShardStateDoc).transactions.length : 0))}</td>
                                        </tr>
                                        <tr>
                                            <td>Timestamp</td>
                                            <td>{block.timestamp}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            })
        }
    </div>
};

export default BlockList;
