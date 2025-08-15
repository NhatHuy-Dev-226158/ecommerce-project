import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

import {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    getProductCount,
    getFeaturedProducts,
    uploadProductImages
} from '../controllers/product.controller.js';

const productRouter = Router();

// === CÁC ROUTE CHÍNH ===
productRouter.get('/', getAllProduct);
productRouter.get('/:id', getProductById);
productRouter.post('/', auth, createProduct);
productRouter.put('/:id', auth, updateProduct);
productRouter.delete('/:id', auth, deleteProduct);


// === CÁC ROUTE PHỤ===
productRouter.get('/get/count', getProductCount);
productRouter.get('/get/featured/:count?', getFeaturedProducts);
productRouter.post('/uploadImages', auth, upload.array('images'), uploadProductImages);
productRouter.post('/delete-multiple', auth, deleteMultipleProducts);


export default productRouter;