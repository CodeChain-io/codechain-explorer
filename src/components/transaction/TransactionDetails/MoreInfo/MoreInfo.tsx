import { TransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import AssetOutput from "./AssetOutput/AssetOutput";
import AssetTransferInputs from "./AssetTransferInputs/AssetTransferInputs";
import AssetTransferOrders from "./AssetTransferOrders/AssetTransferOrders";
import AssetTransferOutputs from "./AssetTransferOutputs/AssetTransferOutputs";

interface Props {
    tx: TransactionDoc;
}

interface State {
    pageForInput: number;
    pageForOutput: number;
    pageForBurn: number;
}

export default class MoreInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            pageForInput: 1,
            pageForOutput: 1,
            pageForBurn: 1
        };
    }

    public render() {
        const { tx: transaction } = this.props;
        if (transaction.type === "transferAsset") {
            return [
                <AssetTransferInputs inputs={transaction.transferAsset.inputs} key="inputs" isBurn={false} />,
                <AssetTransferInputs inputs={transaction.transferAsset.burns} isBurn={true} key="burns" />,
                <AssetTransferOutputs outputs={transaction.transferAsset.outputs} key="output" />,
                <AssetTransferOrders orders={transaction.transferAsset.orders} key="orders" />
            ];
        } else if (transaction.type === "mintAsset") {
            return [<AssetOutput asset={transaction.mintAsset} key="asset" />];
        } else if (transaction.type === "composeAsset") {
            return [
                <AssetTransferInputs inputs={transaction.composeAsset.inputs} key="inputs" isBurn={false} />,
                <AssetOutput asset={transaction.composeAsset} key="asset" />
            ];
        } else if (transaction.type === "decomposeAsset") {
            return [
                <AssetTransferInputs inputs={[transaction.decomposeAsset.input]} key="input" isBurn={false} />,
                <AssetTransferOutputs outputs={transaction.decomposeAsset.outputs} key="outputs" />
            ];
        } else if (transaction.type === "unwrapCCC") {
            return [<AssetTransferInputs inputs={[transaction.unwrapCCC.burn]} key="burn" isBurn={true} />];
        }
        return null;
    }
}
