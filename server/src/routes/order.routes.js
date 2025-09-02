// server/src/routes/order.routes.js
import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";      // default
import requireAdmin from "../middleware/requireAdmin.js";    // default
import { createOrder, listOrders } from "../controllers/order.controller.js"; // named

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, requireAdmin, listOrders);

export default router;
