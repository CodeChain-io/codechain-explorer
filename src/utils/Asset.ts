import { AssetMintTransactionDoc, TransactionDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { U256 } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";

export function getTotalAssetCount(transaction: TransactionDoc) {
    let totalInputCount = "0";
    if (Type.isAssetMintTransactionDoc(transaction)) {
        totalInputCount = (transaction as AssetMintTransactionDoc).data.output.amount || "0";
    } else if (Type.isAssetTransferTransactionDoc(transaction)) {
        totalInputCount = _.reduce(
            transaction.data.inputs,
            (memo, input) => U256.plus(memo, new U256(input.prevOut.amount)),
            new U256("0")
        ).toString(10);
    }
    const totalBurnCount = Type.isAssetTransferTransactionDoc(transaction)
        ? _.reduce(
              transaction.data.burns,
              (memo, burn) => U256.plus(memo, new U256(burn.prevOut.amount)),
              new U256("0")
          ).toString(10)
        : "0";
    return U256.plus(new U256(totalInputCount), new U256(totalBurnCount)).toString(10);
}
