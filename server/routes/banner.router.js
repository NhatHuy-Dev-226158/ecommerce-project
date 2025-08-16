import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js'; // Middleware để xử lý file upload
import {
    uploadBannerImages,
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    getPublicBanners
} from '../controllers/banner.controller.js';

const bannerRouter = Router();

bannerRouter.post('/upload', auth, upload.array('images'), uploadBannerImages);
bannerRouter.post('/', auth, createBanner);
bannerRouter.get('/', getAllBanners);
bannerRouter.get('/:id', getBannerById);
bannerRouter.put('/:id', auth, updateBanner);
bannerRouter.delete('/:id', auth, deleteBanner);
bannerRouter.get('/public', getPublicBanners);
export default bannerRouter;