import * as cors from "cors";
import * as express from "express";
import * as _ from "lodash";

import { H256, SignedParcel } from "codechain-sdk/lib/core/classes";

import { ServerContext } from "./ServerContext";
import { TransactionDoc, Type } from "../db/DocType";
import { PlatformAddress, AssetTransferAddress } from "codechain-sdk/lib/key/classes";

const corsOptions = {
    origin: true,
    credentials: true,
    exposedHeaders: ["Location", "Link"]
}

export function createApiRouter(context: ServerContext, useCors = false) {
    const router = express.Router();

    if (useCors) {
        router
            .options("*", cors(corsOptions))
            .use(cors(corsOptions));
    }

    router.get("/ping", async (req, res, next) => {
        try {
            await context.db.ping();
            const codechainResponse = await context.codechainSdk.rpc.node.ping();
            res.send(JSON.stringify(codechainResponse));
        } catch (e) {
            next(e);
        }
    });

    router.get("/blockNumber", async (req, res, next) => {
        context.db.getLastBlockNumber().then(n => {
            res.send(n.toString());
        }).catch(next);
    });

    router.get("/block/:blockNumber/hash", async (req, res, next) => {
        const { blockNumber } = req.params;
        context.db.getBlock(Number.parseInt(blockNumber)).then(hash => {
            res.send(hash === null ? JSON.stringify(null) : JSON.stringify(hash));
        }).catch(next);
    });

    router.get("/block/:id", async (req, res, next) => {
        const { id } = req.params;
        try {
            if (isNaN(id) && !Type.isH256String(id)) {
                res.send(JSON.stringify(null));
                return;
            }
            const block = Type.isH256String(id)
                ? await context.db.getBlockByHash(new H256(id))
                : await context.db.getBlock(Number.parseInt(id));
            res.send(block === null ? JSON.stringify(null) : block);
        } catch (e) {
            next(e);
        }
    });

    router.get("/blocks", async (req, res, next) => {
        try {
            const blocks = await context.db.getBlocks();
            res.send(blocks);
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcels/pending", async (req, res, next) => {
        try {
            const pendingParcels = await context.db.getCurrentPendingParcels();
            res.send(pendingParcels);
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcel/pending/:hash", async (req, res, next) => {
        try {
            const { hash } = req.params;
            if (!Type.isH256String(hash)) {
                res.send(JSON.stringify(null));
                return;
            }
            const pendingParcel = await context.db.getPendingParcel(new H256(hash));
            pendingParcel ? res.send(pendingParcel) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcel/:hash", async (req, res, next) => {
        const { hash } = req.params;
        try {
            if (!Type.isH256String(hash)) {
                res.send(JSON.stringify(null));
                return;
            }
            const parcel = await context.db.getParcel(new H256(hash));
            parcel ? res.send(parcel) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcels", async (req, res, next) => {
        try {
            const parcels = await context.db.getParcels();
            res.send(parcels);
        } catch (e) {
            next(e);
        }
    });

    router.get("/tx/:hash", async (req, res, next) => {
        const { hash } = req.params;
        try {
            if (!Type.isH256String(hash)) {
                res.send(JSON.stringify(null));
                return;
            }
            const transaction = await context.db.getTransaction(new H256(hash));
            transaction ? res.send(transaction) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });

    router.get("/txs", async (req, res, next) => {
        try {
            const transactions = await context.db.getTransactions();
            res.send(transactions);
        } catch (e) {
            next(e);
        }
    });

    router.get("/tx/pending/:hash", async (req, res, next) => {
        const { hash } = req.params;
        try {
            if (!Type.isH256String(hash)) {
                res.send(JSON.stringify(null));
                return;
            }
            const pendingTransaction = await context.db.getPendingTransaction(new H256(hash));
            pendingTransaction ? res.send(pendingTransaction) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    })

    router.post("/parcel/signed", async (req, res, next) => {
        const parcel = SignedParcel.fromJSON(req.body);
        context.codechainSdk.rpc.chain.sendSignedParcel(parcel).then(hash => {
            res.send(JSON.stringify(hash.value));
        }).catch(e => {
            const { code, message } = e;
            if (code === -32010) {
                // NOTE: ParcelError
                res.status(400).send(message);
            } else {
                next(e);
            }
        });
    });

    router.get("/tx/:hash/invoice", async (req, res, next) => {
        const { hash } = req.params;
        context.codechainSdk.rpc.chain.getTransactionInvoice(new H256(hash)).then(invoice => {
            res.send(invoice === null ? JSON.stringify(null) : invoice.toJSON());
        }).catch(next);
    });

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

    router.get("/addr-platform-account/:address", async (req, res, next) => {
        const { address } = req.params;
        let accountId;
        try {
            accountId = PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify(null));
            return;
        }
        try {
            const balance = await context.codechainSdk.rpc.chain.getBalance(accountId);
            const nonce = await context.codechainSdk.rpc.chain.getNonce(accountId);
            const account = {
                balance: balance.value,
                nonce: nonce.value
            }
            res.send(account);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-blocks/:address", async (req, res, next) => {
        const { address } = req.params;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const blocks = await context.db.getBlocksByAccountId(accountId);
            res.send(blocks);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-parcels/:address", async (req, res, next) => {
        const { address } = req.params;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const parcels = await context.db.getParcelsByAccountId(accountId);
            res.send(parcels);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-assets/:address", async (req, res, next) => {
        const { address } = req.params;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const assetBundles = await context.db.getAssetBundlesByAccountId(accountId);
            res.send(assetBundles);
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

    router.get("/addr-asset-utxo/:address", async (req, res, next) => {
        const { address } = req.params;
        let lockscriptHashAndParams;
        try {
            lockscriptHashAndParams = AssetTransferAddress.fromString(address).getLockScriptHashAndParameters();
        } catch (e) {
            res.send([]);
            return;
        }
        try {
            if (lockscriptHashAndParams.lockScriptHash.value !== "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3") {
                // FIXME : Currently only standard scripts are available
                res.send([]);
                return;
            }
            const pubKey = lockscriptHashAndParams.parameters[0].toString("hex");
            const assets = await context.db.getAssetsByPubKey(new H256(pubKey));
            const utxoPromise = _.map(assets, async (asset) => {
                const getAssetResult = await context.codechainSdk.rpc.chain.getAsset(new H256(asset.transactionHash), asset.transactionOutputIndex);
                if (!getAssetResult) {
                    return null;
                }
                return asset;
            });
            const utxoResult = await Promise.all(utxoPromise);
            const utxoList = _.compact(utxoResult);
            const utxoResponsePromise = _.map(utxoList, async (utxo) => {
                return {
                    asset: utxo,
                    assetScheme: await context.db.getAssetScheme(new H256(utxo.assetType))
                }
            })
            const utxoPresponse = await Promise.all(utxoResponsePromise);
            res.send(utxoPresponse);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-asset-txs/:address", async (req, res, next) => {
        const { address } = req.params;
        let lockscriptHashAndParams;
        try {
            lockscriptHashAndParams = AssetTransferAddress.fromString(address).getLockScriptHashAndParameters();
        } catch (e) {
            res.send([]);
            return;
        }
        try {
            if (lockscriptHashAndParams.lockScriptHash.value !== "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3") {
                // FIXME : Currently only standard scripts are available
                res.send([]);
                return;
            }
            const pubKey = lockscriptHashAndParams.parameters[0].toString("hex");
            const transactions: TransactionDoc[] = await context.db.getTransactionsByPubKey(new H256(pubKey));
            res.send(transactions);
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

    return router;
}
