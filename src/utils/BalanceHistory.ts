export declare type balanceHistoryReasons =
    | "fee"
    | "author"
    | "stake"
    | "tx"
    | "initial_distribution"
    | "deposit"
    | "validator"
    | "report";

const x: { [T in balanceHistoryReasons]: null } = {
    fee: null,
    author: null,
    stake: null,
    tx: null,
    initial_distribution: null,
    deposit: null,
    validator: null,
    report: null
};

export const historyReasonTypes = Object.keys(x);
