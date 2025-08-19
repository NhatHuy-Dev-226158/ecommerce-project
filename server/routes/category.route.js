import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
    createCategory,
    deleteCategory,
    deleteMultipleCategories,
    getCategories,
    getCategoriesCount,
    getCategory,
    getSubCatehoriesCount,
    removeImageFromCloudinary,
    updateCategory,
    updatedImages
} from '../controllers/category.controller.js';
import isStaffOrAdmin from '../middleware/isStaffOrAdmin.js';

const categoryRouter = Router();
categoryRouter.post('/uploadImages', auth, upload.array('images'), updatedImages);
categoryRouter.post('/create-category', auth, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/get/count', auth, getCategoriesCount);
categoryRouter.get('/get/count/subCat', auth, getSubCatehoriesCount);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/removeImage', auth, removeImageFromCloudinary);
categoryRouter.delete('/:id', auth, isStaffOrAdmin, deleteCategory);
categoryRouter.post('/delete-multiple', auth, isStaffOrAdmin, deleteMultipleCategories);
categoryRouter.put('/:id', auth, isStaffOrAdmin, updateCategory);



export default categoryRouter;
