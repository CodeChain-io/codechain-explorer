export declare type balanceHistoryReasons =
    | "fee"
    | "author"
    | "stake"
    | "tx"
    | "initial_distribution"
    | "deposit"
    | "validator";

const x: { [T in balanceHistoryReasons]: null } = {
    fee: null,
    author: null,
    stake: null,
    tx: null,
    initial_distribution: null,
    deposit: null,
    validator: null
};

export const historyReasonTypes = Object.keys(x);
