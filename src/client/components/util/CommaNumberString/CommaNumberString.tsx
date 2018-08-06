import * as React from "react";

interface Props {
    text: string;
    className?: string;
}

const numberWithCommas = (x: string) => {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const CommaNumberString = (props: Props) => {
    const { className, text } = props;
    return <span className={className}>{numberWithCommas(text)}</span>
}
