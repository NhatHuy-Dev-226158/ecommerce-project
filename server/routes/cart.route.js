import { Router } from "express";
import {
    addToCartItemController,
    deleteCartItemQtyController,
    getCartItemController,
    updateCartItemQtyController
} from "../controllers/cart.controller.js";
import auth from '../middleware/auth.js';

const cartRouter = Router();

// Định nghĩa các routes
cartRouter.post('/add', auth, addToCartItemController);
cartRouter.get('/get', auth, getCartItemController);
cartRouter.put('/update-qty', auth, updateCartItemQtyController);
cartRouter.delete('/delete-cart-item', auth, deleteCartItemQtyController);

export default cartRouter;