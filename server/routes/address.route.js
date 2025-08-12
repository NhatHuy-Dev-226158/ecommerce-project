import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, deleteAddressController, getAddressesController, updateAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();
addressRouter.post('/add', auth, addAddressController);
addressRouter.get('/all', auth, getAddressesController);
addressRouter.put('/:addressId', auth, updateAddressController);
addressRouter.delete('/:addressId', auth, deleteAddressController);

export default addressRouter;