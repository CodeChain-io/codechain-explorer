import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import AssetMintDetails from "./AssetMintDetails/AssetMintDetails";
import AssetTransferDetails from "./AssetTransferDetails/AssetTransferDetails";
import ComposeAssetDetails from "./ComposeAssetDetails/ComposeAssetDetails";
import CreateShardDetails from "./CreateShardDetails/CreateShardDetails";
import CustomDetails from "./CustomDetails/CustomDetails";
import DecomposeAssetDetails from "./DecomposeAssetDetails/DecomposeAssetDetails";
import PayDetails from "./PayDetails/PayDetails";
import RemoveDetails from "./RemoveDetails/RemoveDetails";
import SetRegularKeyDetails from "./SetRegularKeyDetails/SetRegularKeyDetails";
import SetShardOwnersDetails from "./SetShardOwnersDetails/SetShardOwnersDetails";
import StoreDetails from "./StoreDetails/StoreDetails";
import UnwrapCCCDetails from "./UnwrapCCCDetails/UnwrapCCCDetails";
import WrapCCCDetails from "./WrapCCCDetails/WrapCCCDetails";

export interface Props {
    tx: TransactionDoc;
}

export default class DetailsByType extends React.Component<Props, any> {
    public render() {
        const { tx: transaction } = this.props;
        if (transaction.type === "transferAsset") {
            return <AssetTransferDetails tx={transaction} />;
        } else if (transaction.type === "mintAsset") {
            return <AssetMintDetails tx={transaction} />;
        } else if (transaction.type === "composeAsset") {
            return <ComposeAssetDetails tx={transaction} />;
        } else if (transaction.type === "decomposeAsset") {
            return <DecomposeAssetDetails tx={transaction} />;
        } else if (transaction.type === "pay") {
            return <PayDetails tx={transaction} />;
        } else if (transaction.type === "setRegularKey") {
            return <SetRegularKeyDetails tx={transaction} />;
        } else if (transaction.type === "store") {
            return <StoreDetails tx={transaction} />;
        } else if (transaction.type === "createShard") {
            return <CreateShardDetails tx={transaction} />;
        } else if (transaction.type === "setShardOwners") {
            return <SetShardOwnersDetails tx={transaction} />;
        } else if (transaction.type === "remove") {
            return <RemoveDetails tx={transaction} />;
        } else if (transaction.type === "unwrapCCC") {
            return <UnwrapCCCDetails tx={transaction} />;
        } else if (transaction.type === "wrapCCC") {
            return <WrapCCCDetails tx={transaction} />;
        } else if (transaction.type === "custom") {
            return <CustomDetails tx={transaction} />;
        }
        return null;
    }
}
