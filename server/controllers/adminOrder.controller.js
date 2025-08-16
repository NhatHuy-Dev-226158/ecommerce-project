import OrderModel from '../models/order.model.js';

// Lấy tất cả đơn hàng với bộ lọc và phân trang
export const getAllOrdersController = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, searchQuery } = req.query;

        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        if (searchQuery) {
            filter.$or = [
                // Populate user để tìm theo tên, nhưng phức tạp hơn.
                // Tạm thời tìm theo SĐT và Tên trong địa chỉ giao hàng
                { 'shippingAddress.fullName': { $regex: searchQuery, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: searchQuery, $options: 'i' } },
            ];
        }

        const orders = await OrderModel.find(filter)
            .populate('userId', 'name email') // Lấy thêm thông tin người dùng
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await OrderModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// Lấy chi tiết một đơn hàng (Admin)
export const getOrderDetailsController = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.orderId).populate('userId', 'name email phone');
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }

        const order = await OrderModel.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
        }

        order.status = status;
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công.", data: updatedOrder });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};