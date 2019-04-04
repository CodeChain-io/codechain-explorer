import * as React from "react";

import { ImageLoader } from "src/components/util/ImageLoader/ImageLoader";
import * as Metadata from "src/utils/Metadata";

interface OwnProps {
    metadata: Metadata.Metadata;
    assetType: string;
    index: number;
    amount: string;
    type: "input" | "output" | "burn";
    onClick: () => void;
    onMouseEnter: (target: string, name: string, amount: string) => void;
    onMouseLeave: () => void;
}

class AssetIcon extends React.Component<OwnProps> {
    constructor(props: OwnProps) {
        super(props);
    }

    public render() {
        const { index, assetType, type } = this.props;
        const { onClick, onMouseLeave } = this.props;
        const targetId = `icon-${index}-${assetType}-${type}`;
        return (
            <div
                key={targetId}
                className="d-inline-block icon"
                id={targetId}
                onClick={onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <ImageLoader size={42} data={assetType} isAssetImage={true} />
            </div>
        );
    }

    private onMouseEnter() {
        const { index, assetType, type, metadata, amount } = this.props;
        const targetId = `icon-${index}-${assetType}-${type}`;
        this.props.onMouseEnter(targetId, metadata.name || `0x${assetType}`, amount);
    }
}

export default AssetIcon;
