import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Rating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Typography,
    Chip,
    Avatar,
} from '@mui/material';
import {
    FiMessageSquare,
    FiStar,
    FiCamera,
    FiX,
    FiEdit2,
    FiThumbsUp
} from 'react-icons/fi';


// --- DỮ LIỆU TĨNH ---
const toReviewItems = [
    { id: 'prod1', orderId: '#AURA9012', name: 'Giày thể thao Zero-G', image: '/product/720x840.png', purchaseDate: '20/05/2024' },
    { id: 'prod2', orderId: '#AURA9012', name: 'Túi da Lunar', image: '/product/720x840.png', purchaseDate: '20/05/2024' },
];
const reviewedItems = [
    {
        id: 'review1',
        productId: 'prod3',
        name: 'Đồng hồ da Helios',
        image: '/product/720x840.png',
        rating: 5,
        date: '27/05/2024',
        comment: "Sản phẩm tuyệt vời! Đồng hồ rất sang trọng, dây da mềm, đeo rất thích. Giao hàng cũng rất nhanh chóng. Sẽ tiếp tục ủng hộ shop.",
        images: ["/product/720x840.png", "/product/720x840.png"]
    },
];

// --- COMPONENT CON CHO CÁC MỤC ĐÁNH GIÁ ---

// Card cho sản phẩm CHƯA đánh giá
const ReviewItemCard = ({ item, onWriteReview }) => (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl">
        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-grow">
            <p className="text-sm text-gray-500">Mua ngày: {item.purchaseDate}</p>
            <Link to={`/product-detail/${item.id}`} className="font-bold text-lg text-gray-800 hover:underline">{item.name}</Link>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <Button variant="contained" startIcon={<FiStar />} onClick={() => onWriteReview(item)} fullWidth>Viết nhận xét</Button>
        </div>
    </div>
);

// Card cho sản phẩm ĐÃ đánh giá
const ReviewedItemCard = ({ review, onEditReview }) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl">
        <div className="flex items-start gap-4">
            <img src={review.image} alt={review.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
                <Link to={`/product-detail/${review.productId}`} className="font-semibold text-gray-800 hover:underline">{review.name}</Link>
                <div className="flex items-center my-1">
                    <Rating value={review.rating} readOnly size="small" />
                    <p className="ml-2 text-sm font-bold text-green-600">Đã đánh giá</p>
                </div>
                <p className="text-xs text-gray-500">{review.date}</p>
            </div>
            <IconButton size="small" onClick={() => onEditReview(review)}><FiEdit2 /></IconButton>
        </div>
        <p className="text-gray-700 mt-3 text-sm">{review.comment}</p>
        {review.images.length > 0 && (
            <div className="flex gap-2 mt-3">
                {review.images.map((img, index) => (
                    <img key={index} src={img} alt={`review-img-${index}`} className="w-20 h-20 rounded-md object-cover" />
                ))}
            </div>
        )}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-dashed">
            <p className="text-sm text-gray-600 flex items-center gap-1.5"><FiThumbsUp /> 10 người đã thấy hữu ích</p>
        </div>
    </div>
);

// === COMPONENT CHÍNH ---
const ReviewsContent = () => {
    const [activeTab, setActiveTab] = useState('toReview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleOpenModal = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

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
                {activeTab === 'toReview' && toReviewItems.map(item => <ReviewItemCard key={item.id} item={item} onWriteReview={handleOpenModal} />)}
                {activeTab === 'reviewed' && reviewedItems.map(review => <ReviewedItemCard key={review.id} review={review} onEditReview={handleOpenModal} />)}
            </div>

            {/* Modal để viết/sửa nhận xét */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {currentItem?.comment ? 'Chỉnh sửa nhận xét' : 'Viết nhận xét'}
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}><FiX /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar src={currentItem?.image} variant="rounded" sx={{ width: 56, height: 56 }} />
                        <Typography fontWeight="bold">{currentItem?.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography component="legend" gutterBottom>Đánh giá của bạn</Typography>
                        <Rating name="product-rating" defaultValue={currentItem?.rating || 0} size="large" />
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Chia sẻ cảm nhận của bạn về sản phẩm"
                        defaultValue={currentItem?.comment || ''}
                    />
                    <Box sx={{ mt: 3 }}>
                        <Button variant="outlined" component="label" startIcon={<FiCamera />}>
                            Thêm hình ảnh/video
                            <input type="file" hidden multiple />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="contained">Gửi nhận xét</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ReviewsContent;