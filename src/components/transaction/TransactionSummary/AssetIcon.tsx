import { AssetSchemeDoc } from "codechain-indexer-types";
import * as React from "react";

import { ImageLoader } from "src/components/util/ImageLoader/ImageLoader";
import { RequestAssetScheme } from "src/request";
import * as Metadata from "../../../utils/Metadata";

interface OwnProps {
    assetType: string;
    index: number;
    amount: string;
    type: "input" | "output" | "burn";
    onClick: () => void;
    onMouseEnter: (target: string, name: string, amount: string) => void;
    onMouseLeave: () => void;
}

interface State {
    name?: string;
    err?: string;
}

class AssetIcon extends React.Component<OwnProps, State> {
    constructor(props: OwnProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { name, err } = this.state;
        const { index, assetType, type } = this.props;
        if (name == null && err == null) {
            return (
                <RequestAssetScheme
                    assetType={assetType}
                    onAssetScheme={this.onAssetScheme}
                    onAssetSchemeNotExist={this.onAssetSchemeNotExist}
                    onError={this.onError}
                />
            );
        }
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

    private onMouseEnter = () => {
        const { index, assetType, type, amount } = this.props;
        const { name } = this.state;
        if (name) {
            const targetId = `icon-${index}-${assetType}-${type}`;
            this.props.onMouseEnter(targetId, name, amount);
        }
    };

    private onAssetScheme = (assetScheme: AssetSchemeDoc) => {
        const { name = `0x${this.props.assetType}` } = Metadata.parseMetadata(assetScheme.metadata);
        this.setState({
            name
        });
    };

    private onAssetSchemeNotExist = () => {
        this.setState({
            name: "Invalid AssetType"
        });
    };

    private onError = () => {
        this.setState({
            err: ""
        });
    };
}

export default AssetIcon;
