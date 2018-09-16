import { Type } from "codechain-es/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Router } from "express";
import * as _ from "lodash";
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
        const { page, itemsPerPage, lastBlockNumber, lastParcelIndex, lastTransactionIndex } = req.query;
        try {
            let calculatedLastBlockNumber;
            let calculatedLastParcelIndex;
            let calculatedLastTransactionIndex;
            if (lastBlockNumber && lastParcelIndex && lastTransactionIndex) {
                calculatedLastBlockNumber = lastBlockNumber;
                calculatedLastParcelIndex = lastParcelIndex;
                calculatedLastTransactionIndex = lastTransactionIndex;
            } else if (page === 1 || !page) {
                calculatedLastBlockNumber = Number.MAX_VALUE;
                calculatedLastParcelIndex = Number.MAX_VALUE;
                calculatedLastTransactionIndex = Number.MAX_VALUE;
            } else {
                const beforePageTxCount = (page - 1) * itemsPerPage;
                let currentTxCount = 0;
                let lastBlockNumberCursor = Number.MAX_VALUE;
                let lastParcelIndexCursor = Number.MAX_VALUE;
                let lastTransactionIndexCursor = Number.MAX_VALUE;
                while (beforePageTxCount - currentTxCount > 10000) {
                    const cursorTx = await context.db.getTransactions(
                        lastBlockNumberCursor,
                        lastParcelIndexCursor,
                        lastTransactionIndexCursor,
                        10000
                    );
                    const lastCursorTx = _.last(cursorTx);
                    if (lastCursorTx) {
                        lastBlockNumberCursor = lastCursorTx.data.blockNumber as number;
                        lastParcelIndexCursor = lastCursorTx.data.parcelIndex as number;
                        lastTransactionIndexCursor = lastCursorTx.data.transactionIndex as number;
                    }
                    currentTxCount += 10000;
                }
                const skipCount = beforePageTxCount - currentTxCount;
                const skipTxs = await context.db.getTransactions(
                    lastBlockNumberCursor,
                    lastParcelIndexCursor,
                    lastTransactionIndexCursor,
                    skipCount
                );
                const lastSkipTxs = _.last(skipTxs);
                if (lastSkipTxs) {
                    lastBlockNumberCursor = lastSkipTxs.data.blockNumber as number;
                    lastParcelIndexCursor = lastSkipTxs.data.parcelIndex as number;
                    lastTransactionIndexCursor = lastSkipTxs.data.transactionIndex as number;
                }
                calculatedLastBlockNumber = lastBlockNumberCursor;
                calculatedLastParcelIndex = lastParcelIndexCursor;
                calculatedLastTransactionIndex = lastTransactionIndexCursor;
            }
            const transactions = await context.db.getTransactions(
                calculatedLastBlockNumber,
                calculatedLastParcelIndex,
                calculatedLastTransactionIndex,
                itemsPerPage
            );
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
