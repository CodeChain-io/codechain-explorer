import { Router } from "express";
import { ServerContext } from "../ServerContext";
import { TransactionDoc, Type } from "../../db/DocType";
import { H256 } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";

function handle(context: ServerContext, router: Router) {
    router.get("/asset-txs/:assetType", async (req, res, next) => {
        const { assetType } = req.params;
        try {
            const txs: TransactionDoc[] = await context.db.getAssetTransferTransactions(new H256(assetType));
            const mintTx: TransactionDoc = await context.db.getAssetMintTransaction(new H256(assetType));
            res.send(_.compact(_.map(_.concat(txs, mintTx))));
        } catch (e) {
            next(e);
        }
    });

    router.get("/search/asset/:assetName", async (req, res, next) => {
        const { assetName } = req.params;
        try {
            const assetBundles = await context.db.getAssetBundlesByAssetName(assetName);
            res.send(assetBundles);
        } catch (e) {
            next(e);
        }
    });

    router.get("/asset/:assetType", async (req, res, next) => {
        const { assetType } = req.params;
        try {
            if (!Type.isH256String(assetType)) {
                res.send(JSON.stringify(null));
                return;
            }
            const assetScheme = await context.db.getAssetScheme(new H256(assetType));
            assetScheme ? res.send(assetScheme) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });
}

export const AssetAction = {
    handle
}
