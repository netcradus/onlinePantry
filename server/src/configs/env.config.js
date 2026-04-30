import dotenv from "dotenv";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

const envSchema = z.object({
    PORT: z.string().default("5000"),
    MONGODB_URI: z.string().url(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRY: z.string().default("1d"),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string().default("10d"),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_KEY_SECRET: z.string(),
    CORS_ORIGIN: z.string().default("*"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(), // Existing generic one, keep or deprecate? Let's keep for backward compat but add specific ones.
    TWILIO_WHATSAPP_NUMBER: z.string().optional(),
    TWILIO_SMS_NUMBER: z.string().optional(),
    PAYMENT_MODE: z.enum(["razorpay", "whatsapp"]).default("razorpay"),
    ADMIN_WHATSAPP_NUMBER: z.string().regex(/^91\d{10}$/, "Must be 91 followed by 10 digits").default("919876543210"),
});

const envConfig = envSchema.safeParse(process.env);

if (!envConfig.success) {
    console.error("❌ Invalid environment variables:", envConfig.error.format());
    process.exit(1);
}

export const env = envConfig.data;
