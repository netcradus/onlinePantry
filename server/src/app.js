import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { env } from "./configs/env.config.js";
import errorMiddleware from "./middleware/error.middleware.js";
// import { initSubscriptionCron } from "./jobs/subscription.cron.js";

// Initialize Cron Jobs
// initSubscriptionCron();

const app = express();

// Global Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

// Security Middleware
app.use(helmet());
app.use(compression()); // Gzip compression
app.use(limiter); // Apply global rate limiting
app.use(
    cors({
        origin: [env.CORS_ORIGIN, "https://online-pantry.vercel.app", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    })
);

// Body Parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({ 
        status: "success", 
        message: "Welcome to Online Pantry API",
        version: "1.0.0",
        environment: env.NODE_ENV
    });
});

// Health Check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Import Routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.routes.js";
import productRouter from "./routes/product.routes.js";
import blogRouter from "./routes/blog.routes.js";
import orderRouter from "./routes/order.routes.js";
import categoryRouter from "./routes/category.routes.js";
import webhookRouter from "./routes/webhook.routes.js";
import reviewRouter from "./routes/review.routes.js";
import slotRouter from "./routes/slot.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import searchRouter from "./routes/search.routes.js";

// Register Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/webhooks", webhookRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/slots", slotRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/search", searchRouter);

// Error Handling Middleware
app.use(errorMiddleware);

export { app };
