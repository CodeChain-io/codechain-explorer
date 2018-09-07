import { Router } from "express";
import { ServerContext } from "../ServerContext";

function handle(context: ServerContext, router: Router) {
    router.get("/ping", async (req, res, next) => {
        try {
            await context.db.ping();
            const codechainResponse = await context.codechainSdk.rpc.node.ping();
            res.send(JSON.stringify(codechainResponse));
        } catch (e) {
            next(e);
        }
    });
    router.get("/status/ping/server", async (req, res, next) => {
        try {
            await context.db.ping();
            res.send(JSON.stringify("pong"));
        } catch (e) {
            next(e);
        }
    });
    router.get("/status/ping/codechain", async (req, res, next) => {
        try {
            const codechainResponse = await context.codechainSdk.rpc.node.ping();
            res.send(JSON.stringify(codechainResponse));
        } catch (e) {
            next(e);
        }
    });
    router.get("/status/sync", async (req, res, next) => {
        try {
            const codechainBestBlockNumber = await context.codechainSdk.rpc.chain.getBestBlockNumber();
            const codechainBestBlockHash = await context.codechainSdk.rpc.chain.getBlockHash(codechainBestBlockNumber);
            const explorerLastBlockNumber = await context.db.getLastBlockNumber();
            const explorerLastBlock = await context.db.getBlock(explorerLastBlockNumber);

            res.send({
                codechainBestBlockNumber,
                codechainBestBlockHash: codechainBestBlockHash ? codechainBestBlockHash.value : "",
                explorerLastBlockNumber,
                explorerLastBlockHash: explorerLastBlock ? explorerLastBlock.hash : ""
            });
        } catch (e) {
            next(e);
        }
    });
    router.get("/status/codechain", async (req, res, next) => {
        try {
            const nodeVersion = await context.codechainSdk.rpc.node.getNodeVersion();
            const commitHash = await context.codechainSdk.rpc.node.getCommitHash();
            const networkId = await context.codechainSdk.rpc.chain.getNetworkId();
            const peerCount = await context.codechainSdk.rpc.network.getPeerCount();
            const peers = await context.codechainSdk.rpc.network.getPeers();
            const whiteList = await context.codechainSdk.rpc.network.getWhitelist();
            const blackList = await context.codechainSdk.rpc.network.getBlacklist();
            res.send({
                nodeVersion,
                commitHash,
                networkId,
                peerCount,
                peers,
                whiteList,
                blackList
            });
        } catch (e) {
            next(e);
        }
    });
}

export const StatusAction = {
    handle
};
