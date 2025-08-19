import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
    createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog
} from '../controllers/blog.controller.js';
import isStaffOrAdmin from '../middleware/isStaffOrAdmin.js';


const blogRouter = Router();

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:identifier', getBlog);
blogRouter.post('/', auth, isStaffOrAdmin, upload.single('featuredImage'), createBlog);
blogRouter.put('/:id', auth, isStaffOrAdmin, upload.single('featuredImage'), updateBlog);
blogRouter.delete('/:id', auth, isStaffOrAdmin, deleteBlog);

export default blogRouter;