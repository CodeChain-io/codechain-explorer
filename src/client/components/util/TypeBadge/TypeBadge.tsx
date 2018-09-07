import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionDoc } from "codechain-es/lib/types";
import * as React from "react";

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
};
const getTypeString = (type: string) => {
    switch (type) {
        case "assetTransfer":
            return "Transfer";
        case "assetMint":
            return "Mint";
    }
    return "";
};

export const TypeBadge = (props: Props) => {
    const { className, transaction } = props;
    return (
        <span className={className}>
            <FontAwesomeIcon className={getBadgeBackgroundColorClassByType(transaction.type)} icon={faSquare} />{" "}
            {getTypeString(transaction.type)}
        </span>
    );
};
