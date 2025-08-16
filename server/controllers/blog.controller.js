// File: controllers/blog.controller.js
import BlogModel from '../models/blog.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import mongoose from 'mongoose';

// 1. Tạo bài viết mới
export const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, isPublished } = req.body;
        const authorId = req.userId; // Lấy từ middleware auth

        if (!req.file) return res.status(400).json({ message: "Ảnh đại diện là bắt buộc." });

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);

        const newBlog = new BlogModel({
            title, content, excerpt, category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isPublished: isPublished === 'true',
            author: authorId,
            featuredImage: uploadResult.secure_url,
        });

        await newBlog.save();
        res.status(201).json({ success: true, message: "Tạo bài viết thành công!", data: newBlog });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// 2. Lấy tất cả bài viết
export const getAllBlogs = async (req, res) => {
    try {
        // Nếu có query `publishedOnly=true`, chỉ lấy các bài đã xuất bản
        const filter = req.query.publishedOnly === 'true' ? { isPublished: true } : {};

        const blogs = await BlogModel.find(filter).populate('author', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// 3. Lấy 1 bài viết theo ID (cho admin) hoặc SLUG (cho public)
export const getBlog = async (req, res) => {
    try {
        const { identifier } = req.params;
        let blog;

        // Kiểm tra xem identifier có phải là một ObjectId hợp lệ không
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            blog = await BlogModel.findById(identifier).populate('author', 'name');
        } else {
            // Nếu không, coi nó là một slug
            blog = await BlogModel.findOne({ slug: identifier, isPublished: true }).populate('author', 'name avatar');
        }

        if (!blog) return res.status(404).json({ message: "Không tìm thấy bài viết." });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// 4. Cập nhật bài viết
export const updateBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, isPublished } = req.body;
        const updates = { title, content, excerpt, category, isPublished: isPublished === 'true', tags: tags ? tags.split(',').map(tag => tag.trim()) : [] };

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            updates.featuredImage = uploadResult.secure_url;
        }

        const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "Không tìm thấy bài viết." });
        res.status(200).json({ success: true, message: "Cập nhật thành công!", data: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// 5. Xóa bài viết
export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Không tìm thấy bài viết." });
        // TODO: Xóa ảnh trên Cloudinary
        res.status(200).json({ success: true, message: "Đã xóa bài viết." });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};