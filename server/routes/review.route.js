import { Router } from "express";
import auth from "../middleware/auth.js";
import { createReviewController, deleteReviewController, getMyReviewedItemsController, getMyToReviewItemsController, getReviewsByProductController, updateReviewController } from "../controllers/review.controller.js";

const reviewRouter = Router();

// Lấy tất cả đánh giá (không cần đăng nhập)
reviewRouter.get('/:productId', getReviewsByProductController);

// Tạo một đánh giá mới (yêu cầu đăng nhập)
reviewRouter.post('/', auth, createReviewController);

// Cập nhật một đánh giá (yêu cầu đăng nhập)
reviewRouter.put('/:reviewId', auth, updateReviewController);

// Xóa một đánh giá (yêu cầu đăng nhập)
reviewRouter.delete('/:reviewId', auth, deleteReviewController);

reviewRouter.get('/my/reviewed', auth, getMyReviewedItemsController);

// Lấy danh sách sản phẩm chờ đánh giá của người dùng
reviewRouter.get('/my/to-review', auth, getMyToReviewItemsController);

export default reviewRouter;