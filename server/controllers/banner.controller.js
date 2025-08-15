import BannerModel from '../models/banner.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. UPLOAD ẢNH 
export const uploadBannerImages = async (request, response) => {
    try {
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ message: "No image files provided." });
        }

        const imageUrls = [];
        const files = request.files;

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
            fs.unlinkSync(file.path);
        }

        return response.status(200).json({
            message: "Images uploaded successfully.",
            success: true,
            data: { images: imageUrls }
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

// 2. TẠO BANNER MỚI
export const createBanner = async (request, response) => {
    try {
        const newBanner = new BannerModel(request.body);
        const savedBanner = await newBanner.save();
        return response.status(201).json({
            message: "Banner created successfully.",
            success: true,
            data: savedBanner
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

// 3. LẤY TẤT CẢ BANNER
export const getAllBanners = async (request, response) => {
    try {
        const banners = await BannerModel.find().sort({ createdAt: -1 });
        return response.status(200).json({
            message: "Banners fetched successfully.",
            success: true,
            data: banners
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

// ---LẤY CÁC BANNER CÔNG KHAI ---
export const getPublicBanners = async (request, response) => {
    try {
        const banners = await BannerModel.find({ isPublished: true }).sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Public banners fetched successfully.",
            success: true,
            data: banners
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

// 4. LẤY MỘT BANNER THEO ID
export const getBannerById = async (request, response) => {
    try {
        const banner = await BannerModel.findById(request.params.id);
        if (!banner) {
            return response.status(404).json({ message: "Banner not found." });
        }
        return response.status(200).json({ success: true, data: banner });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

// 5. CẬP NHẬT BANNER
export const updateBanner = async (request, response) => {
    try {
        const updatedBanner = await BannerModel.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true } // Trả về tài liệu đã được cập nhật
        );
        if (!updatedBanner) {
            return response.status(404).json({ message: "Banner not found." });
        }
        return response.status(200).json({
            message: "Banner updated successfully.",
            success: true,
            data: updatedBanner
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

// 6. XÓA BANNER
export const deleteBanner = async (request, response) => {
    try {
        const deletedBanner = await BannerModel.findByIdAndDelete(request.params.id);
        if (!deletedBanner) {
            return response.status(404).json({ message: "Banner not found." });
        }
        // TODO: Xóa ảnh trên Cloudinary nếu cần
        return response.status(200).json({
            message: "Banner deleted successfully.",
            success: true
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};