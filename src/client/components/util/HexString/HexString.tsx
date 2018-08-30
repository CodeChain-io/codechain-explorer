import * as React from "react";
import { Link } from "react-router-dom";

interface Props {
    text: string;
    link?: string;
    length?: number;
}

const HexString = (props: Props) => {
    const { link, length, text } = props;
    let sliceLength = text.length;
    if (length) {
        sliceLength = length;
    }
    if (link) {
        return (
            <span>
                <Link to={link}>{`0x${length ? text.slice(0, sliceLength) + "..." : text}`}</Link>
            </span>
        );
    } else {
        return <span>{`0x${length ? text.slice(0, sliceLength) + "..." : text}`}</span>;
    }
};

export default HexString;
