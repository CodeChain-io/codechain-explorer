import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import "./StatusBadge.scss";

interface Props {
    status: string;
    bestBlockNumber?: number | null;
    currentBlockNumber?: number | null;
    className?: string;
    timestamp?: number;
}
const getBadgeBackgroundColorClassByStatus = (
    status: string,
    bestBlockNumber?: number | null,
    currentBlockNumber?: number | null
) => {
    switch (status) {
        case "confirmed":
            if (!currentBlockNumber || !bestBlockNumber) {
                return "text-success";
            }
            if (bestBlockNumber - currentBlockNumber >= 5) {
                return "text-success";
            } else {
                return "text-warning";
            }
        case "pending":
            return "text-warning";
        case "dead":
            return "text-danger";
    }
    return "";
};
const getStatusString = (status: string, bestBlockNumber?: number | null, currentBlockNumber?: number | null) => {
    switch (status) {
        case "confirmed":
            if (!currentBlockNumber || !bestBlockNumber) {
                return "Confirmed";
            }
            if (bestBlockNumber - currentBlockNumber >= 5) {
                return "5+ Confirmed";
            } else {
                return `Confirming (${bestBlockNumber - currentBlockNumber + 1})`;
            }
        case "pending":
            return "Pending";
        case "dead":
            return "Dead";
    }
    return "";
};

export const StatusBadge = (props: Props) => {
    const { className, status, timestamp, bestBlockNumber, currentBlockNumber } = props;
    return (
        <span className={`status-badge ${className}`}>
            <FontAwesomeIcon
                className={getBadgeBackgroundColorClassByStatus(status, bestBlockNumber, currentBlockNumber)}
                icon={faCircle}
            />{" "}
            {getStatusString(status, bestBlockNumber, currentBlockNumber)}{" "}
            {timestamp && status === "pending" ? (
                <span>
                    (<FontAwesomeIcon className="spin" icon={faSpinner} />
                    {moment.unix(timestamp).fromNow()})
                </span>
            ) : null}
        </span>
    );
};
