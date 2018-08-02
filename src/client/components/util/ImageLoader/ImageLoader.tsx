import * as React from "react";
const Identicon = require("identicon.js");
const MurmurHash3 = require('imurmurhash');

interface Props {
    data?: string;
    className?: string;
    url?: string;
    size: number;
}
export const ImageLoader = (props: Props) => {
    const { className, data, url, size } = props;
    const hashData = MurmurHash3(data).result();
    const identiconData = new Identicon(`${hashData}${hashData}${hashData}`, size).toString();
    if (data) {
        return <img className={className} width={size} height={size} src={`data:image/png;base64,${identiconData}`} />
    }

    return (
        <object className={className} style={{ width: size, height: size }} data={`data:image/png;base64,${identiconData}`} type="image/png">
            <img style={{ width: size, height: size }} className={className} src={url} />
        </object>
    )
}
