import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import mongoose from 'mongoose';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function uploadProductImages(request, response) {
    try {
        const files = request.files;
        if (!files || files.length === 0) {
            return response.status(400).json({ message: "No image files provided." });
        }
        const imageUrls = [];
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
}

export async function createProduct(request, response) {
    try {
        // 1. Kiểm tra xem Category có tồn tại không
        const category = await CategoryModel.findById(request.body.category);
        if (!category) {
            return response.status(400).json({ message: 'Invalid Category' });
        }

        // 2. Tạo sản phẩm với dữ liệu từ body
        const product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: request.body.images, // Nhận mảng ảnh từ body
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            category: request.body.category, // Chỉ cần lưu ID
            countInStock: request.body.countInStock,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount // Giữ lại nếu bạn vẫn dùng schema cũ
        });

        const savedProduct = await product.save();

        if (!savedProduct) {
            return response.status(500).json({ message: 'The product could not be created' });
        }

        return response.status(201).json({
            message: "Product created successfully",
            success: true,
            product: savedProduct
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}

export async function getAllProduct(request, response) {
    try {
        const {
            page = 1,
            limit = 15,
            categories,
            search,
            minPrice,  // Tham số mới
            maxPrice,  // Tham số mới
            brand,     // Tham số mới
            sort       // Tham số mới
        } = request.query;

        // --- BỘ LỌC ĐỘNG ---
        const filter = {};

        // 1. Lọc theo danh mục
        if (categories) {
            filter.category = { $in: categories.split(',') };
        }

        // 2. Tìm kiếm theo tên
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // 3. LỌC THEO KHOẢNG GIÁ (PHẦN QUAN TRỌNG)
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = Number(minPrice); // $gte = lớn hơn hoặc bằng
            }
            if (maxPrice) {
                filter.price.$lte = Number(maxPrice); // $lte = nhỏ hơn hoặc bằng
            }
        }

        // 4. Lọc theo thương hiệu
        if (brand) {
            filter.brand = { $in: brand.split(',') };
        }


        // --- SẮP XẾP ---
        let sortOption = { createdAt: -1 }; // Mặc định: Mới nhất
        if (sort) {
            switch (sort) {
                case 'price_asc': sortOption = { price: 1 }; break;
                case 'price_desc': sortOption = { price: -1 }; break;
                case 'name_asc': sortOption = { name: 1 }; break;
                case 'name_desc': sortOption = { name: -1 }; break;
                default: sortOption = { createdAt: -1 };
            }
        }

        // --- TRUY VẤN DATABASE ---
        const skip = (Number(page) - 1) * Number(limit);

        const products = await ProductModel.find(filter)
            .populate('category')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await ProductModel.countDocuments(filter);

        // Trả về theo cấu trúc cũ của bạn
        return response.status(200).json({
            success: true,
            products: products,
            totalPages: Math.ceil(totalProducts / Number(limit)),
            currentPage: Number(page),
            totalCount: totalProducts
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}


export async function getProductCount(request, response) {
    try {
        const productCount = await ProductModel.countDocuments();
        return response.status(200).json({ success: true, productCount: productCount });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}

export async function getFeaturedProducts(request, response) {
    try {
        const count = request.params.count ? parseInt(request.params.count, 10) : 0;
        const products = await ProductModel.find({ isFeatured: true }).limit(count).populate('category');
        return response.status(200).json({ success: true, products: products });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}

export async function deleteProduct(request, response) {
    try {
        if (!mongoose.isValidObjectId(request.params.id)) {
            return response.status(400).json({ message: 'Invalid Product ID' });
        }

        const product = await ProductModel.findById(request.params.id);
        if (!product) {
            return response.status(404).json({ message: 'Product not found' });
        }

        // --- HOÀN THIỆN LOGIC XÓA ẢNH ---
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                const urlArr = imageUrl.split("/");
                const imageName = urlArr[urlArr.length - 1].split(".")[0];
                if (imageName) {
                    await cloudinary.uploader.destroy(imageName);
                }
            }
        }

        await ProductModel.findByIdAndDelete(request.params.id);

        return response.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}

export async function deleteMultipleProducts(request, response) {
    try {
        const { ids } = request.body; // Nhận một mảng các ID từ request body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.status(400).json({
                message: "Please provide an array of product IDs to delete.",
                error: true,
                success: false
            });
        }

        const productsToDelete = await ProductModel.find({ _id: { $in: ids } });
        for (const product of productsToDelete) {
            for (const imageUrl of product.images) {
                const urlArr = imageUrl.split("/");
                const imageName = urlArr[urlArr.length - 1].split(".")[0];
                if (imageName) {
                    cloudinary.uploader.destroy(imageName);
                }
            }
        }

        // Dùng $in để xóa tất cả các sản phẩm có _id nằm trong mảng `ids`
        const deleteResult = await ProductModel.deleteMany({ _id: { $in: ids } });

        if (deleteResult.deletedCount === 0) {
            return response.status(404).json({
                message: "No products found with the provided IDs.",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: `Successfully deleted ${deleteResult.deletedCount} products.`,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getProductById(request, response) {
    try {
        if (!mongoose.isValidObjectId(request.params.id)) {
            return response.status(400).json({ message: 'Invalid Product ID' });
        }
        const product = await ProductModel.findById(request.params.id).populate('category');
        if (!product) {
            return response.status(404).json({ message: 'Product not found' });
        }
        return response.status(200).json({ success: true, product: product });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}

export async function updateProduct(request, response) {
    try {
        // Kiểm tra ID sản phẩm có hợp lệ không
        if (!mongoose.isValidObjectId(request.params.id)) {
            return response.status(400).json({ message: 'Invalid Product ID' });
        }

        // Kiểm tra Category (nếu có thay đổi)
        if (request.body.category) {
            const category = await CategoryModel.findById(request.body.category);
            if (!category) {
                return response.status(400).json({ message: 'Invalid Category' });
            }
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            request.params.id,
            {
                // Chỉ cập nhật các trường được gửi lên
                name: request.body.name,
                description: request.body.description,
                images: request.body.images,
                brand: request.body.brand,
                price: request.body.price,
                oldPrice: request.body.oldPrice,
                category: request.body.category,
                countInStock: request.body.countInStock,
                isFeatured: request.body.isFeatured,
                discount: request.body.discount
            },
            { new: true } // Trả về tài liệu đã được cập nhật
        );

        if (!updatedProduct) {
            return response.status(404).json({ message: "Product not found!" });
        }

        return response.status(200).json({
            message: "The product was updated successfully",
            success: true,
            product: updatedProduct
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
}