// File: controllers/cart.controller.js

import CartModel from "../models/cart.model.js";

// === LẤY TẤT CẢ SẢN PHẨM TRONG GIỎ HÀNG CỦA NGƯỜI DÙNG ===
export const getCartController = async (request, response) => {
    try {
        const userId = request.userId;
        const cartItems = await CartModel.find({ userId: userId }).sort({ createdAt: -1 });

        return response.status(200).json({
            success: true,
            data: cartItems,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// === THÊM SẢN PHẨM VÀO GIỎ HÀNG (HOẶC CẬP NHẬT SỐ LƯỢNG) ===
export const addToCartController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId, quantity, productTitle, image, price } = request.body;

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
        const existingItem = await CartModel.findOne({ userId, productId });

        if (existingItem) {
            // Nếu đã tồn tại, cập nhật số lượng
            existingItem.quantity += quantity;
            await existingItem.save();
            return response.status(200).json({
                success: true,
                message: "Số lượng sản phẩm đã được cập nhật trong giỏ hàng.",
                data: existingItem,
            });
        } else {
            // Nếu chưa tồn tại, tạo mới
            const newItem = new CartModel({
                userId,
                productId,
                quantity,
                productTitle,
                image,
                price
            });
            await newItem.save();
            return response.status(201).json({
                success: true,
                message: "Sản phẩm đã được thêm vào giỏ hàng.",
                data: newItem,
            });
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


// === CẬP NHẬT SỐ LƯỢNG SẢN PHẨM ===
export const updateQuantityController = async (request, response) => {
    try {
        const { cartItemId, newQuantity } = request.body;
        const userId = request.userId;

        const cartItem = await CartModel.findOne({ _id: cartItemId, userId: userId });

        if (!cartItem) {
            return response.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng." });
        }

        cartItem.quantity = newQuantity;
        await cartItem.save();

        return response.status(200).json({
            success: true,
            message: "Cập nhật số lượng thành công.",
            data: cartItem
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


// === XÓA SẢN PHẨM KHỎI GIỎ HÀNG ===
export const deleteFromCartController = async (request, response) => {
    try {
        const cartItemId = request.params.id; // Lấy _id của mục trong giỏ hàng
        const userId = request.userId;

        const deletedItem = await CartModel.findOneAndDelete({ _id: cartItemId, userId: userId });

        if (!deletedItem) {
            return response.status(404).json({
                message: "Không tìm thấy sản phẩm này trong giỏ hàng của bạn."
            });
        }

        return response.status(200).json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng."
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};