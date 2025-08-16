// File: models/order.model.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // Người dùng đã đặt hàng
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Mảng chứa tất cả sản phẩm trong đơn hàng
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            // productId để có thể liên kết ngược lại sản phẩm gốc
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    // "Ảnh chụp nhanh" địa chỉ giao hàng tại thời điểm đặt hàng
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
    },
    // Phương thức thanh toán
    paymentMethod: {
        type: String,
        required: true,
        default: 'Thanh toán khi nhận hàng',
    },
    // Giá trị các phần của đơn hàng
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    // Trạng thái đơn hàng, rất quan trọng để theo dõi
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    deliveredAt: {
        type: Date,
    },
    shippingClass: {
        type: String,
        enum: ['Hàng tiêu chuẩn', 'Hàng đông lạnh', 'Hàng dễ vỡ'],
        default: 'Hàng tiêu chuẩn',
    },
}, {
    timestamps: true // Tự động tạo createdAt và updatedAt
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;