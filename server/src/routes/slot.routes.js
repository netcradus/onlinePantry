import { Router } from "express";
import { getSlots, createSlotsBulk, updateSlot, deleteSlot } from "../controllers/slot.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getSlots);

// Admin only routes
router.route("/").post(verifyJWT, isAdmin, createSlotsBulk);
router.route("/:id").put(verifyJWT, isAdmin, updateSlot);
router.route("/:id").delete(verifyJWT, isAdmin, deleteSlot);

export default router;
