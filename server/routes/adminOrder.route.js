// File: routes/adminOrder.route.js
import { Router } from "express";
import auth from "../middleware/auth.js";
// import isAdmin from "../middleware/isAdmin.js";
import { getAllOrdersController, getOrderDetailsController, updateOrderStatusController } from "../controllers/adminOrder.controller.js";
import isAdmin from "../middleware/isAdmin.js";

const adminOrderRouter = Router();

// Áp dụng middleware cho tất cả route trong file này
adminOrderRouter.use(auth, isAdmin);

adminOrderRouter.get('/', getAllOrdersController);
adminOrderRouter.get('/:orderId', getOrderDetailsController);
adminOrderRouter.put('/:orderId/status', updateOrderStatusController);

export default adminOrderRouter;