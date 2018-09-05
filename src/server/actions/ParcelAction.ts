import { H256 } from "codechain-sdk/lib/core/classes";
import { Router } from "express";
import { Type } from "../../db/DocType";
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
            : ["payment", "changeShardState", "setRegularKey"];
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
            : ["payment", "changeShardState", "setRegularKey"];
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
        const { page, itemsPerPage } = req.query;
        try {
            const parcels = await context.db.getParcels(page, itemsPerPage);
            res.send(parcels);
        } catch (e) {
            next(e);
        }
    });
}

export const ParcelAction = {
    handle
};
