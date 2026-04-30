import { app } from "./app.js";
import connectDB from "./configs/database.js";
import { env } from "./configs/env.config.js";
import logger from "./utils/logger/winston.config.js";
import http from "http";
import { initializeSocket } from "./socket/socket.js";

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        server.listen(env.PORT || 5000, () => {
            logger.info(`⚙️  Server is running at port : ${env.PORT}`);
        });
    })
    .catch((err) => {
        logger.error("MONGO db connection failed !!! ", err);
    });

