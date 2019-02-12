import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionDoc } from "codechain-indexer-types";
import * as moment from "moment";
import * as React from "react";
import "./StatusBadge.scss";

interface Props {
    tx: TransactionDoc;
    className?: string;
}

const getBadgeBackgroundColorClassByStatus = (tx: TransactionDoc) => {
    if (tx.isPending) {
        return "text-warning";
    } else {
        return "text-success";
    }
};

const getStatusString = (tx: TransactionDoc) => {
    if (tx.isPending) {
        return (
            <span>
                Pending(
                <FontAwesomeIcon className="spin" icon={faSpinner} />
                {moment.unix(tx.pendingTimestamp!).fromNow()})
            </span>
        );
    } else {
        return "Confirmed";
    }
};

export const StatusBadge = (props: Props) => {
    const { className, tx } = props;
    return (
        <span className={`status-badge ${className}`}>
            <FontAwesomeIcon className={getBadgeBackgroundColorClassByStatus(tx)} icon={faCircle} />{" "}
            {getStatusString(tx)}
        </span>
    );
};
