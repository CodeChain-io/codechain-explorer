import * as React from "react";
import { Link } from "react-router-dom";

interface Props {
    text: string;
    link: string;
    length?: number;
}

const LinkWithHex = (props: Props) => {
    const { link, length, text } = props;
    return <span><Link to={link}>{'0x' + text.slice(0, length)}</Link></span>
};

export default LinkWithHex;
