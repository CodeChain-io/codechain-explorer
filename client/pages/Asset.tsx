import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/actions";

import { H160 } from "codechain-sdk";

interface Props {
    match: any;
}

interface StateProps {
    assetByType: any;
}

interface AssetSchemeProps {
    metadata: string;
    registrar?: H160;
}
const AssetScheme = (props: AssetSchemeProps) => (
    <div>
        AssetScheme: {JSON.stringify(props.metadata)}
    </div>
);

class AssetInternal extends React.Component<Props & StateProps> {
    public render() {
        const { assetByType, match } = this.props;
        const { type } = match.params;
        const asset = assetByType[type];
        return (
            <div>
                {asset
                    ? <div><AssetScheme metadata={""} /></div>
                    : <div>{/* FIXME: RequestAssetScheme */}</div>}
                <hr />
                <div>{/* FIXME: RequestAssetTransactions */}</div>
            </div>
        )
    }
}

const Asset = connect((state: RootState) => ({
    assetByType: {}
} as StateProps))(AssetInternal);

export default Asset;
