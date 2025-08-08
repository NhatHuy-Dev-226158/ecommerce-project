import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
    createProduct,
    deleteProduct,
    getAllFeaturedProducts,
    getAllProduct,
    getAllProductByCatId,
    getAllProductByCatName,
    getAllProductByPrice,
    getAllProductByRating,
    getAllProductBySubCatId,
    getAllProductBySubCatName,
    getAllProductByThirdLavelCatId,
    getAllProductByThirdLavelCatName,
    getProduct,
    getProductCount,
    removeImageFromCloudinary,
    updatedImages,
    updateProduct
} from '../controllers/product.controller.js';


const productRouter = Router();
productRouter.post('/uploadImages', auth, upload.array('images'), updatedImages);
productRouter.post('/createProduct', auth, createProduct);
productRouter.get('/get-all-product', getAllProduct);
productRouter.get('/get-AllProduct-ByCatId/:id', getAllProductByCatId);
productRouter.get('/get-AllProduct-ByCatName', getAllProductByCatName);
productRouter.get('/get-AllProduct-BySubCatId/:id', getAllProductBySubCatId);
productRouter.get('/get-AllProduct-BySubCatName', getAllProductBySubCatName);
productRouter.get('/get-AllProduct-ByThirdLavelCatId/:id', getAllProductByThirdLavelCatId);
productRouter.get('/get-AllProduct-BySubThirdLavelCatName', getAllProductByThirdLavelCatName);
productRouter.get('/get-AllProduct-ByPrice', getAllProductByPrice);
productRouter.get('/get-AllProduct-ByRating', getAllProductByRating);
productRouter.get('/getProductCount', getProductCount);
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts);
productRouter.delete('/:id', deleteProduct);
productRouter.get('/:id', getProduct);
productRouter.delete('/deteleImage', auth, removeImageFromCloudinary);
productRouter.put('/updateProduct/:id', auth, updateProduct);


export default productRouter;