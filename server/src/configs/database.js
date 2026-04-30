import mongoose from "mongoose";
import { env } from "./env.config.js";
import logger from "../utils/logger/winston.config.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(env.MONGODB_URI);
        logger.info(
            `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        logger.error("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
