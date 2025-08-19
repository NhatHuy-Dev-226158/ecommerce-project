import BlogModel from '../models/blog.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import mongoose from 'mongoose';

// =================================================================================
// BLOG CONTROLLERS
// Purpose: Quản lý các bài viết trên blog, bao gồm CRUD và upload ảnh.
// =================================================================================

/**
 * @route   POST /api/blogs
 * @desc    Tạo một bài viết mới.
 * @access  Private (Admin)
 */
export const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, isPublished } = req.body;
        const authorId = req.userId; // Lấy từ middleware xác thực người dùng.

        if (!req.file) {
            return res.status(400).json({ message: "Ảnh đại diện là bắt buộc." });
        }

        // Tải ảnh đại diện lên Cloudinary và xóa file tạm.
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);

        const newBlog = new BlogModel({
            title,
            content,
            excerpt,
            category,
            // Chuyển đổi chuỗi tags (cách nhau bởi dấu phẩy) thành một mảng.
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isPublished: isPublished === 'true',
            author: authorId,
            featuredImage: uploadResult.secure_url,
        });

        await newBlog.save();
        return res.status(201).json({
            success: true,
            message: "Tạo bài viết thành công!",
            data: newBlog
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   GET /api/blogs
 * @desc    Lấy tất cả bài viết, có thể lọc theo trạng thái đã xuất bản.
 * @access  Public / Private (linh hoạt)
 */
export const getAllBlogs = async (req, res) => {
    try {
        // Lọc bài viết nếu có query `publishedOnly=true`, hữu ích cho trang người dùng.
        const filter = req.query.publishedOnly === 'true' ? { isPublished: true } : {};

        const blogs = await BlogModel.find(filter)
            .populate('author', 'name') // Lấy tên tác giả.
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: blogs
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   GET /api/blogs/:identifier
 * @desc    Lấy một bài viết theo ID (cho admin) hoặc SLUG (cho trang public).
 * @access  Public / Private (linh hoạt)
 */
export const getBlog = async (req, res) => {
    try {
        const { identifier } = req.params;
        let blog;

        // Logic thông minh: Kiểm tra xem `identifier` có phải là một ObjectId hợp lệ hay không.
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // Nếu là ObjectId, tìm theo ID (thường dùng cho trang quản trị).
            blog = await BlogModel.findById(identifier).populate('author', 'name');
        } else {
            // Nếu không, coi nó là một `slug` và chỉ tìm các bài đã xuất bản (cho trang công khai).
            blog = await BlogModel.findOne({ slug: identifier, isPublished: true })
                .populate('author', 'name avatar');
        }

        if (!blog) {
            return res.status(404).json({ message: "Không tìm thấy bài viết." });
        }

        return res.status(200).json({
            success: true,
            data: blog
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   PUT /api/blogs/:id
 * @desc    Cập nhật một bài viết.
 * @access  Private (Admin)
 */
export const updateBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, isPublished } = req.body;

        // Chuẩn bị các trường dữ liệu cần cập nhật.
        const updates = {
            title,
            content,
            excerpt,
            category,
            isPublished: isPublished === 'true',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        };

        // Nếu có file ảnh mới được gửi lên, upload và cập nhật `featuredImage`.
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            updates.featuredImage = uploadResult.secure_url;
            // TODO: Xóa ảnh cũ trên Cloudinary để tránh rác.
        }

        const updatedBlog = await BlogModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Không tìm thấy bài viết." });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật thành công!",
            data: updatedBlog
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Xóa một bài viết.
 * @access  Private (Admin)
 */
export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Không tìm thấy bài viết." });
        }

        // Chú ý: Cần thêm logic để xóa ảnh trên Cloudinary.

        return res.status(200).json({
            success: true,
            message: "Đã xóa bài viết."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};