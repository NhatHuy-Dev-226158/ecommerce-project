import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
    uploadBannerImages,
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    getPublicBanners
} from '../controllers/banner.controller.js';
import isStaffOrAdmin from '../middleware/isStaffOrAdmin.js';

const bannerRouter = Router();
bannerRouter.post('/upload', auth, upload.array('images'), uploadBannerImages);
bannerRouter.post('/', auth, createBanner);
bannerRouter.get('/', getAllBanners);
bannerRouter.get('/:id', getBannerById);
bannerRouter.put('/:id', auth, isStaffOrAdmin, updateBanner);
bannerRouter.delete('/:id', auth, isStaffOrAdmin, deleteBanner);
bannerRouter.get('/public', getPublicBanners);
export default bannerRouter;