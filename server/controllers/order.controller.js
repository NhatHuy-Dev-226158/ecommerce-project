import OrderModel from '../models/order.model.js';
import CartModel from '../models/cart.model.js';

export const createOrderController = async (request, response) => {
    try {
        const userId = request.userId;
        const { shippingAddress, paymentMethod } = request.body;

        const cartItems = await CartModel.find({ userId: userId });

        if (cartItems.length === 0) {
            return response.status(400).json({ message: "Giỏ hàng của bạn đang trống." });
        }

        const orderItems = cartItems.map(item => ({
            name: item.productTitle,
            quantity: item.quantity,
            image: item.image,
            price: item.price,
            productId: item.productId,
        }));

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingPrice = itemsPrice > 0 ? 30000 : 0; // Phí ship cố định 30k
        const totalPrice = itemsPrice + shippingPrice;

        const order = new OrderModel({
            userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            status: 'Pending',
        });

        const createdOrder = await order.save();

        await CartModel.deleteMany({ userId: userId });

        response.status(201).json({
            success: true,
            message: "Đặt hàng thành công!",
            data: createdOrder,
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Lỗi máy chủ khi tạo đơn hàng.",
            error: true,
            success: false,
        });
    }
};

export const getMyOrdersController = async (request, response) => {
    try {
        const userId = request.userId;

        const orders = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return response.status(200).json({
                success: true,
                message: "Bạn chưa có đơn hàng nào.",
                data: [],
            });
        }

        response.status(200).json({
            success: true,
            message: "Tải danh sách đơn hàng thành công.",
            data: orders,
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Lỗi máy chủ khi lấy danh sách đơn hàng.",
            error: true,
            success: false,
        });
    }
};

export const getOrderByIdController = async (request, response) => {
    try {
        const userId = request.userId;
        const orderId = request.params.orderId;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return response.status(404).json({ message: "Không tìm thấy đơn hàng." });
        }

        if (order.userId.toString() !== userId) {
            return response.status(403).json({ message: "Bạn không có quyền truy cập đơn hàng này." });
        }

        response.status(200).json({
            success: true,
            message: "Tải chi tiết đơn hàng thành công.",
            data: order,
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Lỗi máy chủ khi lấy chi tiết đơn hàng.",
            error: true,
            success: false,
        });
    }
};
