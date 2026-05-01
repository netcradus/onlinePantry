import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import { env } from "../configs/env.config.js";
import { emitToUser } from "../socket/socket.js";

// Initialize SendGrid
if (env.SENDGRID_API_KEY) {
    sgMail.setApiKey(env.SENDGRID_API_KEY);
}

// Initialize Twilio (Safe check)
let twilioClient;
if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_ACCOUNT_SID.startsWith("AC")) {
    try {
        twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    } catch (e) {
        console.warn("Twilio init failed:", e.message);
    }
}

/**
 * Send Email Notification via SendGrid
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body text (fallback)
 * @param {string} html - Email HTML body
 */
export const sendEmail = async (to, subject, text, html = null) => {
    if (!env.SENDGRID_API_KEY) {
        console.warn("SendGrid API Key missing. Skipping email.");
        return false;
    }

    const msg = {
        to,
        from: env.EMAIL_FROM || env.SMTP_USER || "test@example.com", // SendGrid requires a verified sender identity
        subject,
        text,
        html: html || text,
    };

    try {
        await sgMail.send(msg);
        console.log("Email sent via SendGrid to:", to);
        return true;
    } catch (error) {
        console.error("Error sending email via SendGrid:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        return false;
    }
};

/**
 * Send SMS Notification
 * @param {string} to - Recipient phone number 
 * @param {string} body - SMS body
 */
export const sendSMS = async (to, body) => {
    if (!twilioClient) {
        console.warn("Twilio not configured. Skipping SMS.");
        return false;
    }
    try {
        const message = await twilioClient.messages.create({
            body,
            from: env.TWILIO_PHONE_NUMBER,
            to,
        });
        console.log("SMS sent: %s", message.sid);
        return true;
    } catch (error) {
        console.error("Error sending SMS:", error);
        return false;
    }
};

/**
 * Send WhatsApp Notification
 * @param {string} to - Recipient phone number 
 * @param {string} body - Message body
 */
export const sendWhatsApp = async (to, body) => {
    console.log(`[Twilio] Attempting to send WhatsApp to: ${to}`);
    if (!twilioClient) {
        console.error("[Twilio] Client is not initialized.");
        return false;
    }
    if (!env.TWILIO_WHATSAPP_NUMBER) {
        console.error("[Twilio] TWILIO_WHATSAPP_NUMBER is missing.");
        return false;
    }

    try {
        const message = await twilioClient.messages.create({
            body,
            from: env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
        });
        console.log("[Twilio] WhatsApp sent successfully. SID:", message.sid);
        return true;
    } catch (error) {
        console.error("[Twilio] Error sending WhatsApp:", error);
        return false;
    }
};

export const NotificationService = {
    sendOrderPlaced: async (user, order) => {
        const subject = `Order Confirmation #${order._id}`;
        const message = `Hello ${user.firstName},\n\nThank you for your order! Your order #${order._id} has been placed successfully. Total Amount: £${order.totalAmount}.\n\nWe will notify you once it ships.\n\nOnlinePantry`;

        await sendEmail(user.email, subject, message);
        if (user.phone) await sendSMS(user.phone, `Order #${order._id} confirmed! Amount: £${order.totalAmount}. Thank you for choosing OnlinePantry.`);
    },

    sendPaymentSuccess: async (user, orderId, amount) => {
        const subject = `Payment Received for Order #${orderId}`;
        const message = `Hello ${user.firstName},\n\nWe have received your payment of £${amount} for Order #${orderId}. Your order is now being processed.`;

        await sendEmail(user.email, subject, message);
    },

    sendPaymentFailed: async (user, orderId) => {
        const subject = `Payment Failed for Order #${orderId}`;
        const message = `Hello ${user.firstName},\n\nPayment for Order #${orderId} failed. Please try again or contact support.`;

        await sendEmail(user.email, subject, message);
    },

    sendOrderStatusUpdate: async (user, order, status) => {
        if (!user || !user.email) return;

        const subject = `Order #${order._id} Update: ${status.toUpperCase()}`;
        const message = `Hello ${user.firstName},\n\nYour order #${order._id} is now ${status}. \n\nTrack your order on our website.\n\nOnlinePantry`;

        try {
            await sendEmail(user.email, subject, message);
        } catch (error) {
            console.error("Failed to send email notification", error);
        }

        // Check if status is allowed for SMS
        const allowedSmsStatuses = ['confirmed', 'out_for_delivery', 'delivered', 'cancelled'];

        if (user.phone && allowedSmsStatuses.includes(status)) {
            try {
                const readableStatus = status.replace(/_/g, ' ').toUpperCase();
                await sendSMS(user.phone, `Order #${order._id} update: ${readableStatus}. Track at onlinepantry.com`);
            } catch (error) {
                console.error("Failed to send SMS notification", error);
            }
        }

        // Socket.io Real-time Event
        emitToUser(user._id, "order_update", {
            message: `Order #${order._id} is now ${status}`,
            orderId: order._id,
            status: status
        });
    },

    sendOrderConfirmation: async (user, order, options = {}) => {
        const { messageTemplate, dispatchDate, sendWhatsapp, sendSms } = options;

        // Strict Phone Formatting
        let phone = user.phone;
        if (!phone.startsWith("+")) {
            phone = `+91${phone}`;
        }

        const results = { whatsapp: false, sms: false };

        if (sendWhatsapp && messageTemplate) {
            results.whatsapp = await sendWhatsApp(phone, messageTemplate);
        }

        if (sendSms) {
            const formattedDate = dispatchDate ? new Date(dispatchDate).toLocaleDateString('en-GB') : 'soon';
            const smsBody = `OnlinePantry: Your order #${order._id.toString().slice(-6).toUpperCase()} is confirmed. Total: £${order.totalAmount}. Dispatch by: ${formattedDate}. We will notify you once shipped.`;
            results.sms = await sendSMS(phone, smsBody);
        }

        // Socket.io Real-time Event
        emitToUser(user._id, "order_update", {
            message: `Order #${order._id} is now CONFIRMED`,
            orderId: order._id,
            status: "confirmed"
        });

        return results;
    }
};
