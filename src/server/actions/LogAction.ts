import { LogType } from "codechain-es/lib/actions/QueryLog";
import { Router } from "express";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    router.get("/log/blockCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.BLOCK_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/parcelCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.PARCEL_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/txCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.TX_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/bestMiners", async (req, res, next) => {
        const { date } = req.query;
        try {
            const logTypes = await context.db.getBestMiners(date);
            res.send(logTypes);
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/paymentCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.PARCEL_PAYMENT_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/assetTransactionGroupCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.PARCEL_ASSET_TRANSACTION_GROUP_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/setRegularKeyCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.PARCEL_SET_REGULAR_KEY_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/mintTxCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.TX_ASSET_MINT_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
    router.get("/log/transferTxCount", async (req, res, next) => {
        const { date } = req.query;
        try {
            const count = await context.db.getLogCount(date, LogType.TX_ASSET_TRANSFER_COUNT);
            res.send(JSON.stringify(count));
        } catch (e) {
            next(e);
        }
    });
}

export const LogAction = {
    handle
};
