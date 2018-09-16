import { Type } from "codechain-es/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Router } from "express";
import * as _ from "lodash";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    router.get("/blockNumber", async (req, res, next) => {
        context.db
            .getLastBlockNumber()
            .then(n => {
                res.send(n.toString());
            })
            .catch(next);
    });

    router.get("/block/:blockNumber/hash", async (req, res, next) => {
        const { blockNumber } = req.params;
        context.db
            .getBlock(Number.parseInt(blockNumber))
            .then(hash => {
                res.send(hash === null ? JSON.stringify(null) : JSON.stringify(hash));
            })
            .catch(next);
    });

    router.get("/block/:id", async (req, res, next) => {
        const { id } = req.params;
        try {
            if (isNaN(id) && !Type.isH256String(id)) {
                res.send(JSON.stringify(null));
                return;
            }
            const block = Type.isH256String(id)
                ? await context.db.getBlockByHash(new H256(id))
                : await context.db.getBlock(Number.parseInt(id));
            res.send(block === null ? JSON.stringify(null) : block);
        } catch (e) {
            next(e);
        }
    });

    router.get("/blocks", async (req, res, next) => {
        const { page, itemsPerPage, lastBlockNumber } = req.query;
        try {
            let calculatedLastBlockNumber;
            if (lastBlockNumber) {
                calculatedLastBlockNumber = lastBlockNumber;
            } else if (page === 1 || !page) {
                calculatedLastBlockNumber = Number.MAX_VALUE;
            } else {
                const beforePageBlockCount = (page - 1) * itemsPerPage;
                let currentBlock = 0;
                let lastBlockCursor = Number.MAX_VALUE;
                while (beforePageBlockCount - currentBlock > 10000) {
                    const cursorblocks = await context.db.getBlocks(lastBlockCursor, 10000);
                    const lastCursorBlock = _.last(cursorblocks);
                    if (lastCursorBlock) {
                        lastBlockCursor = lastCursorBlock.number;
                    }
                    currentBlock += 10000;
                }
                const skipCount = beforePageBlockCount - currentBlock;
                const skipBlocks = await context.db.getBlocks(lastBlockCursor, skipCount);
                const lastSkipBlock = _.last(skipBlocks);
                if (lastSkipBlock) {
                    lastBlockCursor = lastSkipBlock.number;
                }
                calculatedLastBlockNumber = lastBlockCursor;
            }
            const blocks = await context.db.getBlocks(calculatedLastBlockNumber, itemsPerPage);
            res.send(blocks);
        } catch (e) {
            next(e);
        }
    });

    router.get("/blocks/totalCount", async (req, res, next) => {
        try {
            const countOfBlocks = await context.db.getTotalBlockCount();
            res.send(JSON.stringify(countOfBlocks));
        } catch (e) {
            next(e);
        }
    });
}

export const BlockAction = {
    handle
};
