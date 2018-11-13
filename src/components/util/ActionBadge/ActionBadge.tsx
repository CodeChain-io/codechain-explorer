import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ParcelDoc } from "codechain-indexer-types/lib/types";
import * as React from "react";

interface Props {
    parcel: ParcelDoc;
    className?: string;
    simple?: boolean;
}
const getBadgeClassNameByAction = (action: string) => {
    switch (action) {
        case "assetTransaction":
            return "asset-transaction-group-action-text-color";
        case "payment":
            return "payment-action-text-color";
        case "setRegularKey":
            return "set-regular-key-action-text-color";
        case "setShardOwner":
            return "set-shard-owner-action-text-color";
        case "setShardUser":
            return "set-shard-user-action-text-color";
        case "createShard":
            return "create-shard-action-text-color";
    }
    return "";
};

const getActionString = (action: string) => {
    switch (action) {
        case "assetTransaction":
            return "AssetTransaction";
        case "payment":
            return "Payment";
        case "setRegularKey":
            return "SetRegularKey";
        case "setShardUser":
            return "SetShardUser";
        case "setShardOwner":
            return "SetShardOwner";
        case "createShard":
            return "CreateShard";
    }
    return "";
};

export const ActionBadge = (props: Props) => {
    const { className, parcel, simple } = props;
    return (
        <span className={className}>
            <FontAwesomeIcon className={getBadgeClassNameByAction(parcel.action.action)} icon={faSquare} />{" "}
            {simple ? "" : getActionString(parcel.action.action)}
        </span>
    );
};
