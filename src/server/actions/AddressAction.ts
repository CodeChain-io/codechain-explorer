import { H256 } from "codechain-sdk/lib/core/classes";
import { AssetTransferAddress, PlatformAddress } from "codechain-sdk/lib/key/classes";
import { Router } from "express";
import * as _ from "lodash";
import { AssetDoc, TransactionDoc } from "../../db/DocType";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    const STANDARD_SCRIPT_LIST = [
        "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3",
        "41a872156efc1dbd45a85b49896e9349a4e8f3fb1b8f3ed38d5e13ef675bcd5a"
    ];
    router.get("/addr-platform-account/:address", async (req, res, next) => {
        const { address } = req.params;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify(null));
            return;
        }
        try {
            const balance = await context.codechainSdk.rpc.chain.getBalance(address);
            const nonce = await context.codechainSdk.rpc.chain.getNonce(address);
            const account = {
                balance: balance.value,
                nonce: nonce.value
            };
            res.send(account);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-blocks/:address", async (req, res, next) => {
        const { address } = req.params;
        const { page, itemsPerPage } = req.query;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify([]));
            return;
        }
        try {
            const blocks = await context.db.getBlocksByPlatformAddress(address, page, itemsPerPage);
            res.send(blocks);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-blocks/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify(0));
            return;
        }
        try {
            const count = await context.db.getTotalBlockCountByPlatformAddress(address);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-parcels/:address", async (req, res, next) => {
        const { address } = req.params;
        const { page, itemsPerPage } = req.query;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify([]));
            return;
        }
        try {
            const parcels = await context.db.getParcelsByPlatformAddress(address, page, itemsPerPage);
            res.send(parcels);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-parcels/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify(0));
            return;
        }
        try {
            const count = await context.db.getTotalParcelCountByPlatformAddress(address);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-assets/:address", async (req, res, next) => {
        const { address } = req.params;
        const { page, itemsPerPage } = req.query;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify([]));
            return;
        }
        try {
            const assetBundles = await context.db.getAssetBundlesByPlatformAddress(address, page, itemsPerPage);
            res.send(assetBundles);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-platform-assets/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        try {
            PlatformAddress.fromString(address).getAccountId();
        } catch (e) {
            res.send(JSON.stringify(0));
            return;
        }
        try {
            const count = await context.db.getTotalAssetBundleCountByPlatformAddress(address);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-asset-utxo/:address", async (req, res, next) => {
        const { address } = req.params;
        const { lastTransactionHash, itemsPerPage } = req.query;
        try {
            AssetTransferAddress.fromString(address).getLockScriptHashAndParameters();
        } catch (e) {
            res.send([]);
            return;
        }
        try {
            let utxoList = [];
            let lastSelectedTransactionHash = lastTransactionHash;
            while (utxoList.length < itemsPerPage) {
                let assets: AssetDoc[];
                if (lastSelectedTransactionHash) {
                    const transaction = await context.db.getTransaction(new H256(lastSelectedTransactionHash));
                    assets = await context.db.getAssetsByAssetTransferAddress(
                        address,
                        transaction.data.blockNumber,
                        transaction.data.parcelIndex,
                        transaction.data.transactionIndex,
                        itemsPerPage
                    );
                } else {
                    assets = await context.db.getAssetsByAssetTransferAddress(
                        address,
                        Number.MAX_VALUE,
                        Number.MAX_VALUE,
                        Number.MAX_VALUE,
                        itemsPerPage
                    );
                }
                if (assets.length === 0) {
                    break;
                }
                lastSelectedTransactionHash = _.last(assets).transactionHash;
                const utxoPromise = _.map(assets, async asset => {
                    const getAssetResult = await context.codechainSdk.rpc.chain.getAsset(
                        new H256(asset.transactionHash),
                        asset.transactionOutputIndex
                    );
                    if (!getAssetResult) {
                        return null;
                    }
                    return asset;
                });
                const utxoResult = await Promise.all(utxoPromise);
                const validUTXOSet = _.compact(utxoResult);
                utxoList = utxoList.concat(validUTXOSet);
            }
            const utxoResponsePromise = _.map(utxoList.slice(0, itemsPerPage), async utxo => {
                return {
                    asset: utxo,
                    assetScheme: await context.db.getAssetScheme(new H256(utxo.assetType))
                };
            });
            const utxoPresponse = await Promise.all(utxoResponsePromise);
            res.send(utxoPresponse);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-asset-txs/:address", async (req, res, next) => {
        const { address } = req.params;
        const { page, itemsPerPage } = req.query;
        try {
            AssetTransferAddress.fromString(address).getLockScriptHashAndParameters();
        } catch (e) {
            res.send([]);
            return;
        }
        try {
            const transactions: TransactionDoc[] = await context.db.getTransactionsByAssetTransferAddress(
                address,
                page,
                itemsPerPage
            );
            res.send(transactions);
        } catch (e) {
            next(e);
        }
    });

    router.get("/addr-asset-txs/:address/totalCount", async (req, res, next) => {
        const { address } = req.params;
        try {
            AssetTransferAddress.fromString(address).getLockScriptHashAndParameters();
        } catch (e) {
            res.send([]);
            return;
        }
        try {
            const count = await context.db.getTotalTxCountByAssetTransferAddress(address);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
}

export const AddressAction = {
    handle
};
