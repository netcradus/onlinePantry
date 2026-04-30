import { Router } from "express";
import { 
    getSubscriptions, 
    createSubscription, 
    updateSubscription, 
    cancelSubscription, 
    getSubscriptionHistory 
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // All subscription routes require auth

router.route("/")
    .get(getSubscriptions)
    .post(createSubscription);

router.route("/:id")
    .put(updateSubscription)
    .delete(cancelSubscription);

router.route("/:id/history")
    .get(getSubscriptionHistory);

export default router;
