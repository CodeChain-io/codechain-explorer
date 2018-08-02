import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { TransactionDoc } from "../../../../db/DocType";

interface Props {
    transaction: TransactionDoc;
    className?: string;
}
const getBadgeBackgroundColorClassByType = (type: string) => {
    switch (type) {
        case "assetTransfer":
            return "asset-transfer-transaction-text-color";
        case "assetMint":
            return "asset-mint-transaction-text-color";
    }
    return "";
}
const getTypeString = (type: string) => {
    switch (type) {
        case "assetTransfer":
            return "Transfer";
        case "assetMint":
            return "Mint";
    }
    return "";
}

export const TypeBadge = (props: Props) => {
    const { className, transaction } = props;
    return <span className={className}><FontAwesome className={getBadgeBackgroundColorClassByType(transaction.type)} name="square" /> {getTypeString(transaction.type)}</span>
}
