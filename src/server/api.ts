import * as cors from "cors";
import * as express from "express";
import * as _ from "lodash";

import { ServerContext } from "./ServerContext";
import { BlockAction } from "./actions/BlockAction";
import { ParcelAction } from "./actions/ParcelAction";
import { AddressAction } from "./actions/AddressAction";
import { TransactionAction } from "./actions/TransactionAction";
import { AssetAction } from "./actions/AssetAction";
import { LogAction } from "./actions/LogAction";
import { AccountAction } from "./actions/AccountAction";
import { StatusAction } from "./actions/StatusAction";

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
    LogAction.handle(context, router);
    AccountAction.handle(context, router);
    StatusAction.handle(context, router);

    return router;
}
