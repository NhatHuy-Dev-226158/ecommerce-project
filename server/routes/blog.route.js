// File: routes/blog.route.js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
    createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog
} from '../controllers/blog.controller.js';

const router = Router();

// --- CÁC ROUTE CHUNG ---

// GET /api/blogs - Lấy tất cả bài viết. 
// Admin có thể gọi /api/blogs
// User có thể gọi /api/blogs?publishedOnly=true
router.get('/', getAllBlogs);

// GET /api/blogs/:identifier - Lấy 1 bài viết theo ID (cho admin) hoặc SLUG (cho user)
router.get('/:identifier', getBlog);

// --- CÁC ROUTE CẦN XÁC THỰC (cho admin/staff) ---

// POST /api/blogs - Tạo bài viết mới
router.post('/', auth, upload.single('featuredImage'), createBlog);

// PUT /api/blogs/:id - Cập nhật bài viết
router.put('/:id', auth, upload.single('featuredImage'), updateBlog);

// DELETE /api/blogs/:id - Xóa bài viết
router.delete('/:id', auth, deleteBlog);

export default router;