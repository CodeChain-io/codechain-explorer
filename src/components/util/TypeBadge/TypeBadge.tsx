import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import "./TypeBadge.scss";

interface Props {
    transaction: TransactionDoc;
    className?: string;
}

function capitalizeFirstLetter(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

export const TypeBadge = (props: Props) => {
    const { className, transaction } = props;
    return (
        <span className={className}>
            <FontAwesomeIcon icon={faSquare} className="type-badge" /> {capitalizeFirstLetter(transaction.type)}
        </span>
    );
};
