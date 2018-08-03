import * as React from "react";
const Identicon = require("identicon.js");
const sha256 = require('js-sha256');

interface Props {
    data?: string;
    className?: string;
    url?: string;
    size: number;
}
export const ImageLoader = (props: Props) => {
    const { className, data, url, size } = props;
    const hash = sha256.create();
    if (data) {
        hash.update(data);
        const identiconData = new Identicon(hash.hex(), size).toString();
        return <img className={className} style={{ verticalAlign: "middle", width: size, height: size }} src={`data:image/png;base64,${identiconData}`} />
    } else {
        hash.update(url);
        const identiconData = new Identicon(hash.hex(), size).toString();
        return (
            <object className={className} style={{ verticalAlign: "middle", width: size, height: size }} data={url} type="image/png">
                <img src={`data:image/png;base64,${identiconData}`} />
            </object>
        )
    }
}
