import * as http from "http";

import * as bodyParser from "body-parser";
import * as express from "express";

import { ServerConfig } from "./";
import { createApiRouter } from "./api";
import { ServerContext } from "./ServerContext";

export async function run(options: ServerConfig) {
    const context = await ServerContext.newInstance(options);
    const app = express();

    // Enable reverse proxy support in Express. This causes the
    // the "X-Forwarded-Proto" header field to be trusted so its
    // value can be used to determine the protocol. See
    // http://expressjs.com/api#app-settings for more details.
    app.enable("trust proxy");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
        bodyParser.json({
            type: () => true // Treat all other content types as application/json
        })
    );
    app.use("/api", createApiRouter(context, true));

    const httpServer = http.createServer(app);
    httpServer.listen(options.httpPort, () => {
        console.log(`listening on port ${options.httpPort}`);
    });
}
