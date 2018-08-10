import { Router } from "express";
import { ServerContext } from "../ServerContext";
import * as _ from "lodash";
import { H256 } from "codechain-sdk/lib/core/classes";
import { PlatformAddress, AssetTransferAddress } from "codechain-sdk/lib/key/classes";
import { TransactionDoc, AssetDoc } from "../../db/DocType";

function handle(context: ServerContext, router: Router) {
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
        const { page, itemsPerPage } = req.query;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const blocks = await context.db.getBlocksByAccountId(accountId, page, itemsPerPage);
            res.send(blocks);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-blocks/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const count = await context.db.getTotalBlockCountByAccountId(accountId);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-parcels/:address", async (req, res, next) => {
        const { address } = req.params;
        const { page, itemsPerPage } = req.query;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const parcels = await context.db.getParcelsByAccountId(accountId, page, itemsPerPage);
            res.send(parcels);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-parcels/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const count = await context.db.getTotalParcelCountByAccountId(accountId);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-assets/:address", async (req, res, next) => {
        const { address } = req.params;
        const { page, itemsPerPage } = req.query;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const assetBundles = await context.db.getAssetBundlesByAccountId(accountId, page, itemsPerPage);
            res.send(assetBundles);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-assets/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        const accountId = PlatformAddress.fromString(address).getAccountId();
        try {
            const count = await context.db.getTotalAssetBundleCountByAccountId(accountId);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-asset-utxo/:address", async (req, res, next) => {
        const { address } = req.params;
        const { lastTransactionHash, itemsPerPage } = req.query;
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
            let utxoList = [];
            let lastSelectedTransactionHash = lastTransactionHash;
            while (utxoList.length < itemsPerPage) {
                let assets: AssetDoc[];
                if (lastSelectedTransactionHash) {
                    const transaction = await context.db.getTransaction(new H256(lastSelectedTransactionHash));
                    assets = await context.db.getAssetsByPubKey(new H256(pubKey), transaction.data.blockNumber, transaction.data.parcelIndex, transaction.data.transactionIndex, itemsPerPage);
                } else {
                    assets = await context.db.getAssetsByPubKey(new H256(pubKey), Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, itemsPerPage);
                }
                if (assets.length === 0) {
                    break;
                }
                lastSelectedTransactionHash = _.last(assets).transactionHash;
                const utxoPromise = _.map(assets, async (asset) => {
                    const getAssetResult = await context.codechainSdk.rpc.chain.getAsset(new H256(asset.transactionHash), asset.transactionOutputIndex);
                    if (!getAssetResult) {
                        return null;
                    }
                    return asset;
                });
                const utxoResult = await Promise.all(utxoPromise);
                const validUTXOSet = _.compact(utxoResult);
                utxoList = utxoList.concat(validUTXOSet);
            }
            const utxoResponsePromise = _.map(utxoList.slice(0, itemsPerPage), async (utxo) => {
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
        const { page, itemsPerPage } = req.query;
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
            const transactions: TransactionDoc[] = await context.db.getTransactionsByPubKey(new H256(pubKey), page, itemsPerPage);
            res.send(transactions);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-asset-txs/:address/totalCount", async (req, res, next) => {
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
            const count = await context.db.getTotalTransactionCountByPubKey(new H256(pubKey));
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
}

export const AddressAction = {
    handle
}
