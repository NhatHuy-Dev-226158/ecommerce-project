import ReviewModel from '../models/review.model.js';
import ProductModel from '../models/product.model.js';
import OrderModel from '../models/order.model.js';


export const createReviewController = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, rating, comment } = req.body;

        // 1. Kiểm tra xem người dùng đã mua sản phẩm này chưa
        const hasPurchased = await OrderModel.exists({
            'userId': userId,
            'orderItems.productId': productId,
            'status': 'Delivered'
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: "Bạn phải mua sản phẩm này trước khi đánh giá." });
        }

        // 2. Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const alreadyReviewed = await ReviewModel.findOne({ user: userId, product: productId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi." });
        }

        // 3. Tạo đánh giá mới
        const review = new ReviewModel({
            product: productId,
            user: userId,
            rating,
            comment,
        });
        await review.save();

        // 4. (Quan trọng) Cập nhật rating trung bình của sản phẩm
        const reviews = await ReviewModel.find({ product: productId });
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const avgRating = totalRating / reviews.length;

        await ProductModel.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });

        res.status(201).json({ success: true, message: "Đánh giá của bạn đã được gửi thành công!", data: review });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
};


export const getReviewsByProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await ReviewModel.find({ product: productId })
            .populate('user', 'name avatar') // Lấy tên và avatar của người dùng
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
};

// === THÊM HÀM MỚI: CẬP NHẬT ĐÁNH GIÁ ===
export const updateReviewController = async (req, res) => {
    try {
        const userId = req.userId;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await ReviewModel.findById(reviewId);

        // 1. Kiểm tra xem đánh giá có tồn tại không
        if (!review) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá." });
        }

        // 2. (Bảo mật) Kiểm tra xem người yêu cầu có phải là chủ của đánh giá không
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền sửa đánh giá này." });
        }

        // 3. Cập nhật nội dung
        review.rating = rating;
        review.comment = comment;
        await review.save();

        // 4. Tính toán lại rating trung bình của sản phẩm
        const reviews = await ReviewModel.find({ product: review.product });
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const avgRating = totalRating / reviews.length;
        await ProductModel.findByIdAndUpdate(review.product, { rating: avgRating.toFixed(1) });

        // 5. Trả về đánh giá đã được cập nhật
        const updatedReview = await ReviewModel.findById(reviewId).populate('user', 'name avatar');
        res.status(200).json({ success: true, message: "Cập nhật đánh giá thành công!", data: updatedReview });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};


// === THÊM HÀM MỚI: XÓA ĐÁNH GIÁ ===
export const deleteReviewController = async (req, res) => {
    try {
        const userId = req.userId;
        const { reviewId } = req.params;

        const review = await ReviewModel.findById(reviewId);

        // 1. Kiểm tra xem đánh giá có tồn tại không
        if (!review) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá." });
        }

        // 2. (Bảo mật) Kiểm tra xem người yêu cầu có phải là chủ của đánh giá không
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa đánh giá này." });
        }

        const productId = review.product;

        // 3. Xóa đánh giá
        await review.deleteOne(); // Sử dụng deleteOne() trên document

        // 4. Tính toán lại rating trung bình của sản phẩm
        const reviews = await ReviewModel.find({ product: productId });
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            const avgRating = totalRating / reviews.length;
            await ProductModel.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });
        } else {
            // Nếu không còn đánh giá nào, set rating về 0
            await ProductModel.findByIdAndUpdate(productId, { rating: 0 });
        }

        res.status(200).json({ success: true, message: "Đã xóa đánh giá thành công." });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// === THÊM HÀM MỚI: LẤY CÁC SẢN PHẨM ĐÃ ĐÁNH GIÁ ===
export const getMyReviewedItemsController = async (req, res) => {
    try {
        const userId = req.userId;
        const reviews = await ReviewModel.find({ user: userId })
            .populate('product', 'name images') // Lấy thêm thông tin từ ProductModel
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};

// === THÊM HÀM MỚI: LẤY CÁC SẢN PHẨM CHỜ ĐÁNH GIÁ ===
export const getMyToReviewItemsController = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Lấy tất cả các sản phẩm người dùng đã mua và đã được giao
        const deliveredOrders = await OrderModel.find({ userId: userId, status: 'Delivered' });

        // Tạo một Map để lưu trữ các sản phẩm đã mua, tránh trùng lặp
        const purchasedProducts = new Map();
        deliveredOrders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!purchasedProducts.has(item.productId.toString())) {
                    purchasedProducts.set(item.productId.toString(), {
                        productId: item.productId,
                        name: item.name,
                        image: item.image,
                        purchaseDate: order.deliveredAt || order.updatedAt,
                        orderId: order._id,
                    });
                }
            });
        });

        // 2. Lấy tất cả các sản phẩm người dùng đã đánh giá
        const reviewedProductIds = await ReviewModel.find({ user: userId }).select('product');
        const reviewedIdsSet = new Set(reviewedProductIds.map(r => r.product.toString()));

        // 3. Lọc ra những sản phẩm đã mua nhưng CHƯA có trong danh sách đã đánh giá
        const toReviewItems = [];
        for (const [productId, productInfo] of purchasedProducts.entries()) {
            if (!reviewedIdsSet.has(productId)) {
                toReviewItems.push(productInfo);
            }
        }

        res.status(200).json({ success: true, data: toReviewItems });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
};