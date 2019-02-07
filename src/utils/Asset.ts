import { TransactionDoc } from "codechain-indexer-types";
import { U256 } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";

export function getTotalAssetCount(transaction: TransactionDoc) {
    if (transaction.type === "mintAsset") {
        return transaction.mintAsset.supply || "0";
    } else if (transaction.type === "transferAsset") {
        return _.reduce(
            transaction.transferAsset.inputs,
            (memo, input) => U256.plus(memo, new U256(input.prevOut.quantity)),
            new U256("0")
        ).toString(10);
    } else if (transaction.type === "composeAsset") {
        return transaction.composeAsset.supply || "0";
    } else if (transaction.type === "decomposeAsset") {
        return _.reduce(
            transaction.decomposeAsset.outputs,
            (memo, output) => U256.plus(memo, new U256(output.quantity)),
            new U256("0")
        ).toString(10);
    }
    return 0;
}
