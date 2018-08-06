import * as React from "react";
import * as FontAwesome from "react-fontawesome";

interface Props {
    status: string;
    className?: string;
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
}
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
}

export const StatusBadge = (props: Props) => {
    const { className, status } = props;
    return <span className={className}><FontAwesome className={getBadgeBackgroundColorClassByStatus(status)} name="circle" /> {getStatusString(status)}</span>
}
