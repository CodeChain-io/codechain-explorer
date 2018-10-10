import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ParcelDoc } from "codechain-es/lib/types";
import * as React from "react";

interface Props {
    parcel: ParcelDoc;
    className?: string;
    simple?: boolean;
}
const getBadgeClassNameByAction = (action: string) => {
    switch (action) {
        case "assetTransactionGroup":
            return "asset-transaction-group-action-text-color";
        case "payment":
            return "payment-action-text-color";
        case "setRegularKey":
            return "set-regular-key-action-text-color";
    }
    return "";
};

const getActionString = (action: string) => {
    switch (action) {
        case "assetTransactionGroup":
            return "AssetTransactionGroup";
        case "payment":
            return "Payment";
        case "setRegularKey":
            return "SetRegularKey";
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
