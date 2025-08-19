import { Router } from "express";
import auth from "../middleware/auth.js";
import { deleteMultipleOrdersController, deleteOrderController, getAllOrdersController, getOrderDetailsController, updateOrderStatusController } from "../controllers/adminOrder.controller.js";

const adminOrderRouter = Router();

adminOrderRouter.use(auth);

adminOrderRouter.get('/', getAllOrdersController);
adminOrderRouter.get('/:orderId', getOrderDetailsController);
adminOrderRouter.put('/:orderId/status', updateOrderStatusController);
adminOrderRouter.delete('/:id', deleteOrderController);
adminOrderRouter.post('/delete-multiple', deleteMultipleOrdersController);
export default adminOrderRouter;