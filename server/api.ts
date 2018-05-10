import * as cors from 'cors';
import * as express from 'express';
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

    router.get("/block/:blockNumber", async (req, res, next) => {
        const { blockNumber } = req.params;
        context.codechainSdk.getBlockHash(Number.parseInt(blockNumber)).then(hash => {
            return context.codechainSdk.getBlock(hash);
        }).then(block => {
            res.send(JSON.stringify(block));
        }).catch(next);
    });

    router.get("/tx/:txhash/invoice", async (req, res, next) => {
        const { txhash } = req.params;
        context.codechainSdk.getTransactionInvoice(txhash, 0).then(invoice => {
            res.send(JSON.stringify(invoice));
        }).catch(next);
    });

    return router;
}
