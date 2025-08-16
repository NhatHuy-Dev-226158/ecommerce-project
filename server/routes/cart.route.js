import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    getCartController,
    addToCartController,
    updateQuantityController,
    deleteFromCartController
} from "../controllers/cart.controller.js";

const cartRouter = Router();

// Lấy tất cả sản phẩm trong giỏ hàng (yêu cầu đăng nhập)
cartRouter.get('/', auth, getCartController);

// Thêm sản phẩm mới vào giỏ hàng (yêu cầu đăng nhập)
cartRouter.post('/add', auth, addToCartController);

// Cập nhật số lượng (yêu cầu đăng nhập)
cartRouter.post('/update-quantity', auth, updateQuantityController);

// Xóa sản phẩm khỏi giỏ hàng bằng _id của cart item (yêu cầu đăng nhập)
cartRouter.delete('/:id', auth, deleteFromCartController);

export default cartRouter;