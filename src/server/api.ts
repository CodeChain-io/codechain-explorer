import * as cors from "cors";
import * as express from "express";
import * as _ from "lodash";

import { H256, SignedParcel } from "codechain-sdk/lib/core/classes";

import { ServerContext } from "./ServerContext";
import { BlockAction } from "./actions/BlockAction";
import { ParcelAction } from "./actions/ParcelAction";
import { AddressAction } from "./actions/AddressAction";
import { TransactionAction } from "./actions/TransactionAction";
import { AssetAction } from "./actions/AssetAction";

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

    BlockAction.handle(context, router);
    ParcelAction.handle(context, router);
    AddressAction.handle(context, router);
    TransactionAction.handle(context, router);
    AssetAction.handle(context, router);

    router.get("/ping", async (req, res, next) => {
        try {
            await context.db.ping();
            const codechainResponse = await context.codechainSdk.rpc.node.ping();
            res.send(JSON.stringify(codechainResponse));
        } catch (e) {
            next(e);
        }
    });

    return router;
}
