import * as cors from 'cors';
import * as express from 'express';
import * as _ from 'lodash';

import { H256, H160, SignedParcel, Transaction } from "codechain-sdk/lib/core/classes";

import { ServerContext } from './ServerContext';

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
            const block = (id.length === 64 || id.length === 66)
                ? await context.db.getBlockByHash(new H256(id))
                : await context.db.getBlock(Number.parseInt(id));
            res.send(block === null ? JSON.stringify(null) : block.toJSON());
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcel/pending", async (req, res, next) => {
        context.codechainSdk.rpc.chain.getPendingParcels().then(parcels => {
            res.send(parcels.map(p => p.toJSON()));
        }).catch(next);
    });

    router.get("/parcel/:hash", async (req, res, next) => {
        const { hash } = req.params;
        context.db.getParcel(new H256(hash)).then(parcel => {
            res.send(parcel === null ? JSON.stringify(null) : parcel.toJSON());
        }).catch(next);
    });

    router.get("/tx/:hash", async (req, res, next) => {
        const { hash } = req.params;
        context.db.getTransaction(new H256(hash)).then(transaction => {
            res.send(transaction === null ? JSON.stringify(null) : transaction.toJSON());
        }).catch(next);
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
        // TODO: Add limit to query.
        try {
            const txs: Transaction[] = await context.db.getAssetTransferTransactions(new H256(assetType));
            const mintTx: Transaction = await context.db.getAssetMintTransaction(new H256(assetType));
            res.send(_.map(_.concat(txs, mintTx), tx => tx.toJSON()));
        } catch (e) {
            next(e);
        }
    });

    router.get("/account/:address", async (req, res, next) => {
        const { address } = req.params;
        Promise.all([
            context.db.getNonce(new H160(address)),
            context.db.getBalance(new H160(address)),
        ]).then(([nonce, balance]) => {
            res.send(({
                nonce: nonce.value.toString(),
                balance: balance.value.toString()
            }));
        });
    });

    router.get("/account/:address/nonce", async (req, res, next) => {
        const { address } = req.params;
        context.db.getNonce(new H160(address)).then(nonce => {
            res.send(nonce.value.toString());
        }).catch(next);
    });

    router.get("/addr-platform-account/:address", async (req, res, next) => {
        const { address } = req.params;
        try {
            const balance = await context.codechainSdk.rpc.chain.getBalance(new H160(address));
            const nonce = await context.codechainSdk.rpc.chain.getNonce(new H160(address));
            const account = {
                balance: balance.value,
                nonce: nonce.value
            }
            res.send(account);
        } catch (e) {
            next(e);
        }
        context.db.getBalance(new H160(address)).then(balance => {
            res.send(balance.value.toString());
        }).catch(next);
    });

    router.get("/addr-asset-utxo/:address", async (req, res, next) => {
        const { address } = req.params;
        try {
            const assets = await context.db.getAssetByAddress(new H256(address));
            const utxoPromise = _.map(assets, asset => {
                const assetJson = asset.toJSON();
                return context.codechainSdk.rpc.chain.getAsset(new H256(assetJson.transactionHash), assetJson.transactionOutputIndex)
            });
            const utxoResult = await Promise.all(utxoPromise);
            const utxoList = _.compact(utxoResult);
            const utxoResponsePromise = _.map(utxoList, async (utxo) => {
                return {
                    asset: utxo,
                    assetScheme: await context.db.getAssetScheme(utxo.assetType)
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
        try {
            const transactions: Transaction[] = await context.db.getTransactionsByAddress(new H256(address));
            const JSONTransactions = _.map(transactions, tx => tx.toJSON());
            res.send(JSONTransactions);
        } catch (e) {
            next(e);
        }
    });

    router.get("/asset/:assetType", async (req, res, next) => {
        const { assetType } = req.params;
        context.db.getAssetScheme(new H256(assetType)).then(assetScheme => {
            res.send(assetScheme === null ? JSON.stringify(null) : assetScheme.toJSON());
        }).catch(next);
    });

    return router;
}
