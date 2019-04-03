import * as moment from "moment";

export const getCurrentTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000);
};

export const getUnixTimeLocaleString = (timeStamp: number) => {
    const time = moment.unix(timeStamp);
    moment.relativeTimeThreshold("ss", -1);
    moment.relativeTimeThreshold("m", 60);

    if (time.isAfter(moment().subtract(1, "hour"))) {
        return time.fromNow();
    } else if (
        moment()
            .startOf("day")
            .isBefore(time)
    ) {
        return `${time.format("HH:mm:ss").toLocaleString()} Today`;
    } else if (
        moment()
            .startOf("year")
            .isBefore(time)
    ) {
        return time.format("MMM DD, HH:mm:ss").toLocaleString();
    } else {
        return time.format("MMM DD YYYY, HH:mm:ss").toLocaleString();
    }
};
