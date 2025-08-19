import { Router } from "express";
import auth from "../middleware/auth.js";
import { createReviewController, deleteReviewController, getMyReviewedItemsController, getMyToReviewItemsController, getReviewsByProductController, updateReviewController } from "../controllers/review.controller.js";

const reviewRouter = Router();

reviewRouter.get('/:productId', getReviewsByProductController);
reviewRouter.post('/', auth, createReviewController);
reviewRouter.put('/:reviewId', auth, updateReviewController);
reviewRouter.delete('/:reviewId', auth, deleteReviewController);
reviewRouter.get('/my/reviewed', auth, getMyReviewedItemsController);
reviewRouter.get('/my/to-review', auth, getMyToReviewItemsController);

export default reviewRouter;