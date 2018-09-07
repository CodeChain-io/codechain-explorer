import { Type } from "codechain-es-temporary/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Router } from "express";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    router.get("/tx/:hash", async (req, res, next) => {
        const { hash } = req.params;
        try {
            if (!Type.isH256String(hash)) {
                res.send(JSON.stringify(null));
                return;
            }
            const transaction = await context.db.getTransaction(new H256(hash));
            transaction ? res.send(transaction) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });

    router.get("/txs", async (req, res, next) => {
        const { page, itemsPerPage } = req.query;
        try {
            const transactions = await context.db.getTransactions(page, itemsPerPage);
            res.send(transactions);
        } catch (e) {
            next(e);
        }
    });

    router.get("/txs/totalCount", async (req, res, next) => {
        try {
            const countOfBlocks = await context.db.getTotalTransactionCount();
            res.send(JSON.stringify(countOfBlocks));
        } catch (e) {
            next(e);
        }
    });

    router.get("/tx/pending/:hash", async (req, res, next) => {
        const { hash } = req.params;
        try {
            if (!Type.isH256String(hash)) {
                res.send(JSON.stringify(null));
                return;
            }
            const pendingTransaction = await context.db.getPendingTransaction(new H256(hash));
            pendingTransaction ? res.send(pendingTransaction) : res.send(JSON.stringify(null));
        } catch (e) {
            next(e);
        }
    });
}

export const TransactionAction = {
    handle
};
