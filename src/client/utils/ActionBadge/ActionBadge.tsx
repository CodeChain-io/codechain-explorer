import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { ParcelDoc } from "../../../db/DocType";

interface Props {
    parcel: ParcelDoc;
    className?: string;
}
const getBadgeClassNameByAction = (action: string) => {
    switch (action) {
        case "changeShardState":
            return "change-shard-state-action-text-color";
        case "payment":
            return "payment-action-text-color";
        case "setRegularKey":
            return "set-regular-key-action-text-color";
    }
    return "";
}

const getActionString = (action: string) => {
    switch (action) {
        case "changeShardState":
            return "ChangeShardState";
        case "payment":
            return "Payment";
        case "setRegularKey":
            return "SetRegularKey";
    }
    return "";
}

export const ActionBadge = (props: Props) => {
    const { className, parcel } = props;
    return <span className={className}><FontAwesome className={getBadgeClassNameByAction(parcel.action.action)} name="square" /> {getActionString(parcel.action.action)}</span>
}
