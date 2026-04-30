import { env } from "../configs/env.config.js";
import logger from "../utils/logger/winston.config.js";

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || [];

    // Log the error for debugging
    logger.error(`Error: ${message}`, {
        statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorMiddleware;
