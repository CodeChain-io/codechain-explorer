import * as cors from 'cors';
import * as express from 'express';

import { H256, H160 } from "codechain-sdk";

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
            res.send(JSON.stringify(text));
        }).catch(next);
    });

    router.get("/blockNumber", async (req, res, next) => {
        context.codechainSdk.getBlockNumber().then(text => {
            res.send(JSON.stringify(text));
        }).catch(next);
    });

    router.get("/block/:blockNumber/hash", async (req, res, next) => {
        const { blockNumber } = req.params;
        context.codechainSdk.getBlockHash(Number.parseInt(blockNumber)).then(hash => {
            res.send(JSON.stringify(hash));
        }).catch(next);
    });

    router.get("/block/:id", async (req, res, next) => {
        const { id } = req.params;
        try {
            const hash = id.length === 66
                ? new H256(id)
                : await context.codechainSdk.getBlockHash(Number.parseInt(id));
            const block = await context.codechainSdk.getBlock(hash);
            res.send(JSON.stringify(block));
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcel/:hash", async (req, res, next) => {
        const { hash } = req.params;
        // FIXME: implement when sdk support getTransaction
        try {
            const blockHash = await context.codechainSdk.getBlockHash(1);
            const block = await context.codechainSdk.getBlock(blockHash);
            res.send(JSON.stringify(block.parcels[0]));
        } catch (e) { next(e); }
    });

    router.get("/tx/:hash/invoice", async (req, res, next) => {
        const { hash } = req.params;
        context.codechainSdk.getParcelInvoice(new H256(hash), 0).then(invoice => {
            res.send(JSON.stringify(invoice));
        }).catch(next);
    });

    router.get("/account/:address", async (req, res, next) => {
        const { address } = req.params;
        Promise.all([
            context.codechainSdk.getNonce(new H160(address))
        ]).then(([nonce]) => {
            // FIXME: getBalance is not implemented yet
            res.send(JSON.stringify({ nonce, balance: nonce }));
        });
    });

    router.get("/account/:address/nonce", async (req, res, next) => {
        const { address } = req.params;
        context.codechainSdk.getNonce(new H160(address)).then(nonce => {
            res.send(JSON.stringify(nonce));
        }).catch(next);
    });

    router.get("/account/:address/balance", async (req, res, next) => {
        const { address } = req.params;
        // FIXME: not implemented
        res.sendStatus(501);
    });

    return router;
}
