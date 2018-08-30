import * as cors from "cors";
import * as express from "express";
import * as _ from "lodash";

import { AccountAction } from "./actions/AccountAction";
import { AddressAction } from "./actions/AddressAction";
import { AssetAction } from "./actions/AssetAction";
import { BlockAction } from "./actions/BlockAction";
import { LogAction } from "./actions/LogAction";
import { ParcelAction } from "./actions/ParcelAction";
import { StatusAction } from "./actions/StatusAction";
import { TransactionAction } from "./actions/TransactionAction";
import { ServerContext } from "./ServerContext";

const corsOptions = {
    origin: true,
    credentials: true,
    exposedHeaders: ["Location", "Link"]
};

export function createApiRouter(context: ServerContext, useCors = false) {
    const router = express.Router();

    if (useCors) {
        router.options("*", cors(corsOptions)).use(cors(corsOptions));
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
