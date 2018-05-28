import * as cors from 'cors';
import * as express from 'express';

import { H256, H160, SignedParcel, Parcel, U256 } from "codechain-sdk/lib/primitives";
import { getTransactionFromJSON } from "codechain-sdk/lib/primitives/transaction";

import { ServerContext } from './context';

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
        const { codechainSdk } = context;
        codechainSdk.ping().then(text => {
            res.send(text);
        }).catch(next);
    });

    router.get("/blockNumber", async (req, res, next) => {
        context.codechainSdk.getBlockNumber().then(n => {
            res.send(n.toString());
        }).catch(next);
    });

    router.get("/block/:blockNumber/hash", async (req, res, next) => {
        const { blockNumber } = req.params;
        context.codechainSdk.getBlockHash(Number.parseInt(blockNumber)).then(hash => {
            res.send(hash.value);
        }).catch(next);
    });

    router.get("/block/:id", async (req, res, next) => {
        const { id } = req.params;
        try {
            const hash = id.length === 66
                ? new H256(id)
                : await context.codechainSdk.getBlockHash(Number.parseInt(id));
            const block = await context.codechainSdk.getBlock(hash);
            res.send(block.toJSON());
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcel/pending", async (req, res, next) => {
        context.codechainSdk.getPendingParcels().then(parcels => {
            res.send(parcels.map(p => p.toJSON()));
        }).catch(next);
    });

    router.get("/parcel/:hash", async (req, res, next) => {
        const { hash } = req.params;
        context.codechainSdk.getParcel(new H256(hash)).then(parcel => {
            res.send(parcel.toJSON());
        }).catch(next);
    });

    router.post("/parcel/signed", async (req, res, next) => {
        const parcel = SignedParcel.fromJSON(req.body);
        context.codechainSdk.sendSignedParcel(parcel).then(hash => {
            res.send(hash);
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
        context.codechainSdk.getTransactionInvoice(new H256(hash)).then(invoice => {
            if (invoice === null) {
                res.send(JSON.stringify(null));
            } else {
                res.send(invoice.toJSON());
            }
        }).catch(next);
    });

    router.get("/account/:address", async (req, res, next) => {
        const { address } = req.params;
        Promise.all([
            context.codechainSdk.getNonce(new H160(address)),
            context.codechainSdk.getBalance(new H160(address)),
        ]).then(([nonce, balance]) => {
            res.send(({
                nonce: nonce.value.toString(),
                balance: balance.value.toString()
            }));
        });
    });

    router.get("/account/:address/nonce", async (req, res, next) => {
        const { address } = req.params;
        context.codechainSdk.getNonce(new H160(address)).then(nonce => {
            res.send(nonce.value.toString());
        }).catch(next);
    });

    router.get("/account/:address/balance", async (req, res, next) => {
        const { address } = req.params;
        context.codechainSdk.getBalance(new H160(address)).then(balance => {
            res.send(balance.value.toString());
        }).catch(next);
    });

    // FIXME: Change to use asset type instead of txhash. It requires codechain and
    // sdk to be changed also
    router.get("/asset/:txhash", async (req, res, next) => {
        const { txhash } = req.params;
        context.codechainSdk.getAssetScheme(new H256(txhash)).then(assetScheme => {
            res.send(assetScheme.toJSON());
        }).catch(next);
    });

    return router;
}
