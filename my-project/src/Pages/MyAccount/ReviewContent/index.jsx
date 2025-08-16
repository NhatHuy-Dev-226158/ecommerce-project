import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Rating, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Typography, Chip, Avatar, CircularProgress } from '@mui/material';
import { FiStar, FiX, FiEdit2 } from 'react-icons/fi';
import { MyContext } from '../../../App';
import { fetchDataFromApi, postData, updateData } from '../../../utils/api';
import toast from 'react-hot-toast';

// --- COMPONENT CON (Đã sửa để dùng dữ liệu động) ---

const ReviewItemCard = ({ item, onWriteReview }) => (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl">
        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-grow">
            <p className="text-sm text-gray-500">Mua ngày: {new Date(item.purchaseDate).toLocaleDateString('vi-VN')}</p>
            <Link to={`/product-detail/${item.productId}`} className="font-bold text-lg text-gray-800 hover:underline">{item.name}</Link>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <Button variant="contained" startIcon={<FiStar />} onClick={() => onWriteReview(item)} fullWidth>Viết nhận xét</Button>
        </div>
    </div>
);

const ReviewedItemCard = ({ review, onEditReview }) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <div className="flex items-start gap-4">
            <img src={review.product.images[0]} alt={review.product.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
                <Link to={`/product-detail/${review.product._id}`} className="font-semibold text-gray-800 hover:underline">{review.product.name}</Link>
                <div className="flex items-center my-1">
                    <Rating value={review.rating} readOnly size="small" />
                    <p className="ml-2 text-sm font-bold text-green-600">Đã đánh giá</p>
                </div>
                <p className="text-xs text-gray-500">{new Date(review.updatedAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <IconButton size="small" onClick={() => onEditReview(review)}><FiEdit2 /></IconButton>
        </div>
        <p className="text-gray-700 mt-3 text-sm">{review.comment}</p>
    </div>
);

// === COMPONENT CHÍNH ---
const ReviewsContent = () => {
    const { isLogin } = useContext(MyContext);
    const [activeTab, setActiveTab] = useState('toReview');
    const [isLoading, setIsLoading] = useState(true);
    const [toReviewItems, setToReviewItems] = useState([]);
    const [reviewedItems, setReviewedItems] = useState([]);

    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchData = useCallback(async () => {
        if (!isLogin) return;
        setIsLoading(true);
        try {
            const [toReviewRes, reviewedRes] = await Promise.all([
                fetchDataFromApi('/api/reviews/my/to-review'),
                fetchDataFromApi('/api/reviews/my/reviewed')
            ]);
            if (toReviewRes.success) setToReviewItems(toReviewRes.data);
            if (reviewedRes.success) setReviewedItems(reviewedRes.data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách nhận xét.");
        } finally {
            setIsLoading(false);
        }
    }, [isLogin]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (item) => {
        setCurrentItem(item);
        // Nếu là item đã review (onEditReview), điền thông tin cũ
        if (item.rating) {
            setRating(item.rating);
            setComment(item.comment);
        } else { // Nếu là item mới (onWriteReview), reset form
            setRating(5);
            setComment('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmitReview = async () => {
        if (comment.trim() === '') return toast.error("Vui lòng nhập nhận xét.");

        try {
            let result;
            // Nếu currentItem đã có _id, nghĩa là đang EDIT
            if (currentItem._id) {
                const payload = { rating, comment };
                result = await updateData(`/api/reviews/${currentItem._id}`, payload);
            } else { // Nếu không, là CREATE
                const payload = { productId: currentItem.productId, rating, comment };
                result = await postData('/api/reviews/', payload);
            }

            if (result.success) {
                toast.success("Gửi nhận xét thành công!");
                handleCloseModal();
                fetchData(); // Tải lại cả 2 danh sách
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-10"><CircularProgress /></div>;
    }
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Nhận xét của tôi</h2>
                <p className="text-gray-500 mt-1">Chia sẻ trải nghiệm của bạn về các sản phẩm đã mua.</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('toReview')}
                        className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'toReview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Chờ nhận xét <Chip label={toReviewItems.length} size="small" sx={{ ml: 1 }} />
                    </button>
                    <button
                        onClick={() => setActiveTab('reviewed')}
                        className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviewed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Đã nhận xét <Chip label={reviewedItems.length} size="small" sx={{ ml: 1 }} />
                    </button>
                </nav>
            </div>

            {/* Content của Tab */}
            <div className="space-y-4">
                {activeTab === 'toReview' && (toReviewItems.length > 0
                    ? toReviewItems.map(item => <ReviewItemCard key={item.productId} item={item} onWriteReview={handleOpenModal} />)
                    : <Typography>Bạn đã nhận xét tất cả sản phẩm đã mua!</Typography>
                )}
                {activeTab === 'reviewed' && (reviewedItems.length > 0
                    ? reviewedItems.map(review => <ReviewedItemCard key={review._id} review={review} onEditReview={handleOpenModal} />)
                    : <Typography>Bạn chưa có nhận xét nào.</Typography>
                )}
            </div>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {currentItem?._id ? 'Chỉnh sửa nhận xét' : 'Viết nhận xét'}
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}><FiX /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar src={currentItem?.image || currentItem?.product?.images[0]} variant="rounded" sx={{ width: 56, height: 56 }} />
                        <Typography fontWeight="bold">{currentItem?.name || currentItem?.product?.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography component="legend" gutterBottom>Đánh giá của bạn</Typography>
                        <Rating name="product-rating" value={rating} onChange={(e, val) => setRating(val)} size="large" />
                    </Box>
                    <TextField fullWidth multiline rows={4} label="Chia sẻ cảm nhận..." value={comment} onChange={(e) => setComment(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmitReview}>Gửi nhận xét</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ReviewsContent;