import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionDoc } from "codechain-indexer-types/lib/types";
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
        case "assetCompose":
            return "asset-compose-transaction-text-color";
        case "assetDecompose":
            return "asset-decompose-transaction-text-color";
    }
    return "";
};
const getTypeString = (type: string) => {
    switch (type) {
        case "assetTransfer":
            return "Transfer";
        case "assetMint":
            return "Mint";
        case "assetCompose":
            return "Compose";
        case "assetDecompose":
            return "Decompose";
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
