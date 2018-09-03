import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import "./StatusBadge.scss";

interface Props {
    status: string;
    className?: string;
    timestamp?: number;
}
const getBadgeBackgroundColorClassByStatus = (status: string) => {
    switch (status) {
        case "confirmed":
            return "text-success";
        case "pending":
            return "text-warning";
        case "dead":
            return "text-danger";
    }
    return "";
};
const getStatusString = (status: string) => {
    switch (status) {
        case "confirmed":
            return "Confirmed";
        case "pending":
            return "Pending";
        case "dead":
            return "Dead";
    }
    return "";
};

export const StatusBadge = (props: Props) => {
    const { className, status, timestamp } = props;
    return (
        <span className={`status-badge ${className}`}>
            <FontAwesomeIcon className={getBadgeBackgroundColorClassByStatus(status)} icon={faCircle} />{" "}
            {getStatusString(status)}{" "}
            {timestamp && status === "pending" ? (
                <span>
                    (<FontAwesomeIcon className="spin" icon={faSpinner} />
                    {moment.unix(timestamp).fromNow()})
                </span>
            ) : null}
        </span>
    );
};
