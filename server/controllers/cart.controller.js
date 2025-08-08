import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

// HÀM: Thêm sản phẩm vào giỏ hàng
export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                message: "Vui lòng cung cấp ID sản phẩm",
                error: true,
                success: false,
            });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        });

        if (checkItemCart) {
            return response.status(400).json({
                message: "Sản phẩm đã có trong giỏ hàng",
            });
        }

        // Tạo một mục giỏ hàng mới
        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        });

        const savedCartItem = await cartItem.save();

        // Cập nhật giỏ hàng của người dùng để thêm mục mới này
        await UserModel.updateOne(
            { _id: userId },
            {
                $push: { shopping_cart: savedCartItem._id }
            }
        );

        return response.json({
            data: savedCartItem,
            message: "Thêm sản phẩm thành công",
            error: false,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// HÀM: Lấy tất cả sản phẩm trong giỏ hàng của người dùng
export const getCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const cartItem = await CartProductModel.find({
            userId: userId
        }).populate('productId');

        return response.json({
            data: cartItem,
            error: false,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// HÀM: Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id, qty } = request.body;

        if (!_id || !qty) {
            return response.status(400).json({
                message: "Vui lòng cung cấp _id và qty",
            });
        }

        // Cập nhật số lượng của mục trong giỏ hàng
        const updateCartItem = await CartProductModel.updateOne(
            {
                _id: _id,
                userId: userId
            }, {
            quantity: qty
        });

        return response.json({
            message: "Cập nhật giỏ hàng thành công",
            success: true,
            error: false,
            data: updateCartItem
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// HÀM: Xóa sản phẩm khỏi giỏ hàng 
export const deleteCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Vui lòng cung cấp _id của mục cần xóa",
                error: true,
                success: false
            });
        }

        //Xóa mục khỏi collection cartproducts.
        const deleteCartItem = await CartProductModel.deleteOne({ _id: _id, userId: userId });

        // Nếu ID sai hoặc không thuộc về user báo lỗi.
        if (deleteCartItem.deletedCount === 0) {
            return response.status(404).json({
                message: "Không tìm thấy mục trong giỏ hàng để xóa",
                error: true,
                success: false,
            });
        }

        //  Xóa ObjectId tương ứng khỏi mảng shopping_cart của người dùng.
        await UserModel.updateOne(
            { _id: userId },
            {
                $pull: { shopping_cart: _id }
            }
        );

        return response.json({
            message: "Xóa sản phẩm thành công",
            error: false,
            success: true,
            data: deleteCartItem
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};