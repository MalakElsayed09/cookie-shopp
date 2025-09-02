import { Router } from 'express';
import { createOrder, myOrders, allOrders } from '../controllers/order.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const r = Router();
r.post('/', requireAuth, createOrder);
r.get('/mine', requireAuth, myOrders);
r.get('/', requireAuth, requireAdmin, allOrders);
export default r;