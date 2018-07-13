import * as React from "react";
import * as _ from "lodash";
import { Block, ChangeShardState } from "codechain-sdk/lib/core/classes";

import "./BlockList.scss";
import HexString from "../../util/HexString/HexString";

interface OwnProps {
    blocks: Block[]
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
                                <HexString text={block.hash.value} />
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
                                            <td>{_.sumBy(block.parcels, (parcel) => (parcel.unsigned.action instanceof ChangeShardState ? parcel.unsigned.action.transactions.length : 0))}</td>
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
