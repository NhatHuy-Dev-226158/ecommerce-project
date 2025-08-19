import CartModel from "../models/cart.model.js";

// =================================================================================
// CART CONTROLLERS
// Purpose: Xử lý tất cả các hoạt động liên quan đến giỏ hàng của người dùng.
// =================================================================================

/**
 * @route   GET /api/cart
 * @desc    Lấy tất cả các sản phẩm trong giỏ hàng của người dùng đang đăng nhập.
 * @access  Private
 */
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
            message: error.message || "Đã xảy ra lỗi máy chủ.",
            error: true,
            success: false
        });
    }
};

/**
 * @route   POST /api/cart/add
 * @desc    Thêm sản phẩm vào giỏ hàng, hoặc cập nhật số lượng nếu sản phẩm đã tồn tại.
 * @access  Private
 */
export const addToCartController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId, quantity, productTitle, image, price } = request.body;

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng này chưa.
        const existingItem = await CartModel.findOne({ userId, productId });

        if (existingItem) {
            // Nếu đã tồn tại, chỉ cộng dồn số lượng.
            existingItem.quantity += quantity;
            await existingItem.save();

            return response.status(200).json({ // 200 OK cho việc cập nhật
                success: true,
                message: "Số lượng sản phẩm đã được cập nhật.",
                data: existingItem,
            });
        } else {
            // Nếu chưa tồn tại, tạo một mục mới trong giỏ hàng.
            const newItem = new CartModel({
                userId,
                productId,
                quantity,
                productTitle,
                image,
                price
            });
            await newItem.save();

            return response.status(201).json({ // 201 Created cho việc tạo mới
                success: true,
                message: "Sản phẩm đã được thêm vào giỏ hàng.",
                data: newItem,
            });
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Đã xảy ra lỗi máy chủ.",
            error: true,
            success: false
        });
    }
};


/**
 * @route   PUT /api/cart/update-quantity
 * @desc    Cập nhật số lượng cho một sản phẩm cụ thể trong giỏ hàng.
 * @access  Private
 */
export const updateQuantityController = async (request, response) => {
    try {
        const { cartItemId, newQuantity } = request.body;
        const userId = request.userId;

        // Tìm mục trong giỏ hàng, điều kiện `userId` đảm bảo người dùng chỉ sửa được giỏ hàng của mình.
        const cartItem = await CartModel.findOne({ _id: cartItemId, userId: userId });

        if (!cartItem) {
            return response.status(404).json({
                message: "Không tìm thấy sản phẩm trong giỏ hàng.",
                success: false,
                error: true
            });
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
            message: error.message || "Đã xảy ra lỗi máy chủ.",
            error: true,
            success: false
        });
    }
};


/**
 * @route   DELETE /api/cart/delete/:id
 * @desc    Xóa một sản phẩm khỏi giỏ hàng.
 * @access  Private
 */
export const deleteFromCartController = async (request, response) => {
    try {
        const cartItemId = request.params.id;
        const userId = request.userId;

        // `findOneAndDelete` kết hợp điều kiện `userId` để đảm bảo quyền sở hữu.
        const deletedItem = await CartModel.findOneAndDelete({ _id: cartItemId, userId: userId });

        if (!deletedItem) {
            return response.status(404).json({
                message: "Không tìm thấy sản phẩm này trong giỏ hàng của bạn.",
                success: false,
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng."
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Đã xảy ra lỗi máy chủ.",
            error: true,
            success: false
        });
    }
};