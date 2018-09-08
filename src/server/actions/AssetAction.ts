import { Buffer } from "buffer";
import { TransactionDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Router } from "express";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    router.get("/asset-txs/:assetType", async (req, res, next) => {
        const { assetType } = req.params;
        const { page, itemsPerPage } = req.query;
        try {
            const txs: TransactionDoc[] = await context.db.getTransactionsByAssetType(
                new H256(assetType),
                page,
                itemsPerPage
            );
            res.send(txs);
        } catch (e) {
            next(e);
        }
    });

    router.get("/asset-txs/:assetType/totalCount", async (req, res, next) => {
        const { assetType } = req.params;
        try {
            const count = await context.db.getTotalTransactionCountByAssetType(new H256(assetType));
            res.send(JSON.stringify(count));
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

    router.get("/asset/pending/:assetType", async (req, res, next) => {
        const { assetType } = req.params;
        try {
            if (!Type.isH256String(assetType)) {
                res.send(JSON.stringify(null));
                return;
            }
            const assetScheme = await context.db.getPendingAssetScheme(new H256(assetType));
            assetScheme ? res.send(assetScheme) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });

    router.get("/asset/image/:assetType", async (req, res, next) => {
        const { assetType } = req.params;
        try {
            if (!Type.isH256String(assetType)) {
                res.status(404).send("Not found");
                return;
            }
            const assetImage = await context.db.getAssetImageBlob(new H256(assetType));
            if (!assetImage) {
                res.status(404).send("Not found");
                return;
            }
            const img = Buffer.from(assetImage, "base64");
            res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": img.length
            });
            res.end(img);
        } catch (e) {
            res.status(404).send("Not found");
        }
    });
}

export const AssetAction = {
    handle
};
