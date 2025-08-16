// File: routes/order.route.js

import { Router } from "express";
import auth from "../middleware/auth.js";
import { createOrderController, getMyOrdersController, getOrderByIdController } from "../controllers/order.controller.js";

const orderRouter = Router();

// Endpoint để tạo một đơn hàng mới (yêu cầu đăng nhập)
orderRouter.post('/', auth, createOrderController);
orderRouter.get('/', auth, getMyOrdersController);
orderRouter.get('/:orderId', auth, getOrderByIdController);


export default orderRouter;