import { Type } from "codechain-es/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Router } from "express";
import * as _ from "lodash";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    router.get("/parcels/totalCount", async (req, res, next) => {
        try {
            const countOfBlocks = await context.db.getTotalParcelCount();
            res.send(JSON.stringify(countOfBlocks));
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcels/pending", async (req, res, next) => {
        const { page, itemsPerPage, actionFilters, signerFiter, sorting, orderBy } = req.query;
        const parsedActionFilters = actionFilters
            ? actionFilters.split(",")
            : ["payment", "assetTransactionGroup", "setRegularKey"];
        try {
            const pendingParcels = await context.db.getCurrentPendingParcels(
                page,
                itemsPerPage,
                parsedActionFilters,
                signerFiter,
                sorting,
                orderBy
            );
            res.send(pendingParcels);
        } catch (e) {
            next(e);
        }
    });

    router.get("/parcels/pending/totalCount", async (req, res, next) => {
        const { actionFilters, signerFiter } = req.query;
        const parsedActionFilters = actionFilters
            ? actionFilters.split(",")
            : ["payment", "assetTransactionGroup", "setRegularKey"];
        try {
            const count = await context.db.getTotalPendingParcelCount(parsedActionFilters, signerFiter);
            res.send(JSON.stringify(count));
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
        const { page, itemsPerPage, lastBlockNumber, lastParcelIndex } = req.query;
        try {
            let calculatedLastBlockNumber;
            let calculatedLastParcelIndex;
            if (lastBlockNumber && lastParcelIndex) {
                calculatedLastBlockNumber = lastBlockNumber;
                calculatedLastParcelIndex = lastParcelIndex;
            } else if (page === 1 || !page) {
                calculatedLastBlockNumber = Number.MAX_VALUE;
                calculatedLastParcelIndex = Number.MAX_VALUE;
            } else {
                const beforePageParcelCount = (page - 1) * itemsPerPage;
                let currentParcel = 0;
                let lastBlockNumberCursor = Number.MAX_VALUE;
                let lastParcelIndexCursor = Number.MAX_VALUE;
                while (beforePageParcelCount - currentParcel > 10000) {
                    const cursorParcel = await context.db.getParcels(
                        lastBlockNumberCursor,
                        lastParcelIndexCursor,
                        10000
                    );
                    const lastCursorParcel = _.last(cursorParcel);
                    if (lastCursorParcel) {
                        lastBlockNumberCursor = lastCursorParcel.blockNumber as number;
                        lastParcelIndexCursor = lastCursorParcel.parcelIndex as number;
                    }
                    currentParcel += 10000;
                }
                const skipCount = beforePageParcelCount - currentParcel;
                const skipParcels = await context.db.getParcels(
                    lastBlockNumberCursor,
                    lastParcelIndexCursor,
                    skipCount
                );
                const lastSkipParcels = _.last(skipParcels);
                if (lastSkipParcels) {
                    lastBlockNumberCursor = lastSkipParcels.blockNumber as number;
                    lastParcelIndexCursor = lastSkipParcels.parcelIndex as number;
                }
                calculatedLastBlockNumber = lastBlockNumberCursor;
                calculatedLastParcelIndex = lastParcelIndexCursor;
            }
            const parcels = await context.db.getParcels(
                calculatedLastBlockNumber,
                calculatedLastParcelIndex,
                itemsPerPage
            );
            res.send(parcels);
        } catch (e) {
            next(e);
        }
    });
}

export const ParcelAction = {
    handle
};
