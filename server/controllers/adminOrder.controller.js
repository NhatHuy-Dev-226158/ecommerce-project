import OrderModel from '../models/order.model.js';


/**
 * @route   GET /api/admin/orders
 * @desc    Lấy tất cả đơn hàng với bộ lọc, tìm kiếm và phân trang.
 * @access  Private (Admin)
 */
export const getAllOrdersController = async (req, res) => {
    try {
        // Lấy các tham số truy vấn (query parameters)
        const { page = 1, limit = 10, status, searchQuery } = req.query;

        // --- Xây dựng đối tượng filter động ---
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Tìm kiếm không phân biệt chữ hoa/thường trên nhiều trường của địa chỉ giao hàng.
        if (searchQuery) {
            filter.$or = [
                { 'shippingAddress.fullName': { $regex: searchQuery, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: searchQuery, $options: 'i' } },
            ];
        }

        // --- Truy vấn dữ liệu ---
        // Truy vấn chính: áp dụng bộ lọc, phân trang và sắp xếp.
        const orders = await OrderModel.find(filter)
            .populate('userId', 'name email') // Lấy thông tin cơ bản của người dùng liên quan.
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 }); // Sắp xếp đơn hàng mới nhất lên đầu.

        // Lấy tổng số document khớp với bộ lọc để tính toán tổng số trang.
        const count = await OrderModel.countDocuments(filter);

        // --- Trả về kết quả ---
        return res.status(200).json({
            success: true,
            data: orders,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   GET /api/admin/orders/:orderId
 * @desc    Lấy chi tiết một đơn hàng cụ thể.
 * @access  Private (Admin)
 */
export const getOrderDetailsController = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.orderId)
            .populate('userId', 'name email phone');

        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

/**
 * @route   PUT /api/admin/orders/:orderId/status
 * @desc    Cập nhật trạng thái của một đơn hàng.
 * @access  Private (Admin)
 */
export const updateOrderStatusController = async (req, res) => {
    try {
        const { status } = req.body;

        // Xác thực trạng thái đầu vào để đảm bảo tính toàn vẹn dữ liệu.
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Trạng thái không hợp lệ.",
                success: false,
                error: true
            });
        }

        const order = await OrderModel.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng.",
                success: false,
                error: true
            });
        }

        // Cập nhật trạng thái
        order.status = status;

        // Tự động gán thời gian giao hàng khi trạng thái là 'Delivered'.
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái thành công.",
            data: updatedOrder
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};


export const deleteOrderController = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ." });
        }
        const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
        }
        res.status(200).json({ success: true, message: "Đã xóa đơn hàng thành công." });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// === XÓA NHIỀU ĐƠN HÀNG ===
export const deleteMultipleOrdersController = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Vui lòng cung cấp một mảng ID đơn hàng." });
        }
        const deleteResult = await OrderModel.deleteMany({ _id: { $in: ids } });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng nào." });
        }
        res.status(200).json({ success: true, message: `Đã xóa thành công ${deleteResult.deletedCount} đơn hàng.` });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};