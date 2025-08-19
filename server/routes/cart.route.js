import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    getCartController,
    addToCartController,
    updateQuantityController,
    deleteFromCartController
} from "../controllers/cart.controller.js";

const cartRouter = Router();
cartRouter.get('/', auth, getCartController);
cartRouter.post('/add', auth, addToCartController);
cartRouter.post('/update-quantity', auth, updateQuantityController);
cartRouter.delete('/:id', auth, deleteFromCartController);

export default cartRouter;