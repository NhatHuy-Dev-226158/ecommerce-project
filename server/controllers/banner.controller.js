import BannerModel from '../models/banner.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // File System module của Node.js, dùng để xóa file tạm

// =================================================================================
// BANNER CONTROLLERS
// Purpose: Quản lý các banner quảng cáo, bao gồm upload ảnh và các thao tác CRUD.
// =================================================================================

// --- Cấu hình Cloudinary từ biến môi trường ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


/**
 * @route   POST /api/banners/upload
 * @desc    Upload một hoặc nhiều file ảnh lên Cloudinary.
 * @access  Private (Admin)
 */
export const uploadBannerImages = async (request, response) => {
    try {
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({
                message: "Không có file ảnh nào được cung cấp.",
                success: false,
                error: true
            });
        }

        const imageUrls = [];
        const files = request.files; // Mảng các file từ middleware (vd: multer)

        // Lặp qua từng file, upload lên Cloudinary và xóa file tạm trên server.
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);

            // Xóa file tạm đã upload khỏi thư mục trên server để tiết kiệm dung lượng.
            fs.unlinkSync(file.path);
        }

        return response.status(200).json({
            message: "Tải ảnh lên thành công.",
            success: true,
            data: { images: imageUrls }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   POST /api/banners
 * @desc    Tạo một banner mới.
 * @access  Private (Admin)
 */
export const createBanner = async (request, response) => {
    try {
        const newBanner = new BannerModel(request.body);
        const savedBanner = await newBanner.save();

        return response.status(201).json({
            message: "Tạo banner thành công.",
            success: true,
            data: savedBanner
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   GET /api/banners
 * @desc    Lấy tất cả banner (cho trang admin).
 * @access  Private (Admin)
 */
export const getAllBanners = async (request, response) => {
    try {
        const banners = await BannerModel.find().sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Lấy danh sách banner thành công.",
            success: true,
            data: banners
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   GET /api/banners/public
 * @desc    Lấy các banner đã được công khai (cho trang người dùng).
 * @access  Public
 */
export const getPublicBanners = async (request, response) => {
    try {
        // Chỉ lấy các banner có trường `isPublished` là true.
        const banners = await BannerModel.find({ isPublished: true }).sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Lấy danh sách banner công khai thành công.",
            success: true,
            data: banners
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   GET /api/banners/:id
 * @desc    Lấy thông tin chi tiết của một banner.
 * @access  Private (Admin)
 */
export const getBannerById = async (request, response) => {
    try {
        const banner = await BannerModel.findById(request.params.id);
        if (!banner) {
            return response.status(404).json({ message: "Không tìm thấy banner." });
        }

        return response.status(200).json({
            success: true,
            data: banner
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   PUT /api/banners/:id
 * @desc    Cập nhật thông tin của một banner.
 * @access  Private (Admin)
 */
export const updateBanner = async (request, response) => {
    try {
        const updatedBanner = await BannerModel.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true } // Tùy chọn `new: true` để trả về document sau khi đã cập nhật.
        );
        if (!updatedBanner) {
            return response.status(404).json({ message: "Không tìm thấy banner." });
        }

        return response.status(200).json({
            message: "Cập nhật banner thành công.",
            success: true,
            data: updatedBanner
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   DELETE /api/banners/:id
 * @desc    Xóa một banner.
 * @access  Private (Admin)
 */
export const deleteBanner = async (request, response) => {
    try {
        const deletedBanner = await BannerModel.findByIdAndDelete(request.params.id);
        if (!deletedBanner) {
            return response.status(404).json({ message: "Không tìm thấy banner." });
        }

        // Chú ý: Hàm này chỉ xóa bản ghi trong database.
        // Cần thêm logic để xóa ảnh tương ứng trên Cloudinary nếu muốn dọn dẹp triệt để.

        return response.status(200).json({
            message: "Xóa banner thành công.",
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};