export declare type balanceHistoryReasons = "fee" | "author" | "stake" | "tx" | "initial_distribution";

const x: { [T in balanceHistoryReasons]: null } = {
    fee: null,
    author: null,
    stake: null,
    tx: null,
    initial_distribution: null
};

export const historyReasonTypes = Object.keys(x);
