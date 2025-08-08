import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoriesCount,
    getCategory,
    getSubCatehoriesCount,
    removeImageFromCloudinary,
    updateCategory,
    updatedImages
} from '../controllers/category.controller.js';

const categoryRouter = Router();
categoryRouter.post('/uploadImages', auth, upload.array('images'), updatedImages);
categoryRouter.post('/create-category', auth, createCategory);
categoryRouter.get('/', auth, getCategories);
categoryRouter.get('/get/count', auth, getCategoriesCount);
categoryRouter.get('/get/count/subCat', auth, getSubCatehoriesCount);
categoryRouter.get('/:id', auth, getCategory);
categoryRouter.delete('/removeImage', auth, removeImageFromCloudinary);
categoryRouter.delete('/:id', auth, deleteCategory);
categoryRouter.put('/:id', auth, updateCategory);



export default categoryRouter;
