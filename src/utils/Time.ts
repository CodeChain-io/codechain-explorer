import * as moment from "moment";

export const getCurrentTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000);
};

export const getUnixTimeLocaleString = (timeStamp: number, serverTimeOffset?: number) => {
    const time = moment.unix(timeStamp);
    const serverTime = moment().add(serverTimeOffset, "seconds");
    moment.relativeTimeThreshold("ss", -1);
    moment.relativeTimeThreshold("m", 60);

    if (time.isAfter(serverTime.subtract(1, "hours"))) {
        return time.fromNow();
    } else if (serverTime.startOf("day").isBefore(time)) {
        return `${time.format("HH:mm:ss").toLocaleString()} Today`;
    } else if (serverTime.startOf("year").isBefore(time)) {
        return time.format("MMM DD, HH:mm:ss").toLocaleString();
    } else {
        return time.format("MMM DD YYYY, HH:mm:ss").toLocaleString();
    }
};
