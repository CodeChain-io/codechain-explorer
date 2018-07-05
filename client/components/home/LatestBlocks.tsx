import * as React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";

import { Block } from "codechain-sdk";

interface Props {
    blocksByNumber: {
        [n: number]: Block;
    }
}

const LatestBlocks = (props: Props) => {
    const { blocksByNumber } = props;
    return <div>{
        _.map(_.reverse(_.values(blocksByNumber)), block => {
            return (
                <div key={`home-block-num-${block.hash.value}`}>
                    <hr />
                    <h4><Link to={`/block/${block.number}`}>Block {block.number}</Link></h4>
                    <div>
                        <div>Hash: {block.hash.value}</div>
                        <div>Author: {block.author.value}</div>
                        <div>Total {block.parcels.length} Parcels</div>
                    </div>
                </div>
            );
        })
    }</div>
};

export default LatestBlocks;
