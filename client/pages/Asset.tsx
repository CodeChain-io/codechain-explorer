import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/actions";

import { RequestAssetScheme } from "../components/requests";

interface Props {
    match: any;
}

interface StateProps {
    assetSchemeByTxhash: any;
}

interface AssetSchemeProps {
    assetScheme: any;
}
const AssetScheme = (props: AssetSchemeProps) => {
    const { metadata, amount, registrar } = props.assetScheme;
    return <div>
        <div>metadata: {JSON.stringify(metadata)}</div>
        <div>amount: {amount}</div>
        <div>registrar: {registrar ? registrar : "None"}</div>
    </div>
};

class AssetInternal extends React.Component<Props & StateProps> {
    public render() {
        const { assetSchemeByTxhash, match } = this.props;
        const { type } = match.params;
        const assetScheme = assetSchemeByTxhash[type];
        if (assetScheme === null) {
            return <div>Asset not exist for txhash: {type}</div>
        }
        return (
            <div>
                {assetScheme
                    ? <div><AssetScheme assetScheme={assetScheme} /></div>
                    : <div><RequestAssetScheme txhash={type} /></div>}
                <hr />
                <div>{/* FIXME: RequestAssetTransactions */}</div>
            </div>
        )
    }
}

const Asset = connect((state: RootState) => ({
    assetSchemeByTxhash: state.assetSchemeByTxhash
} as StateProps))(AssetInternal);

export default Asset;
