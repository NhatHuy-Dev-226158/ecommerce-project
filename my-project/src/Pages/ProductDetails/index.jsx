import React from 'react';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Box, Rating, TextField, Button, CircularProgress, Avatar, IconButton, Tooltip } from '@mui/material';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

import ProductsSlider from '../../componets/ProductsSlider';
import ProductDetailsComponets from '../../componets/ProductDetails/inddex';
import ZoomdetailPage from '../../componets/ZoomProductImg/ZoomdetailPage';
import { fetchDataFromApi, postData, updateData, deleteData } from '../../utils/api';
import { MyContext } from '../../App';


// === COMPONENT CON ĐỂ HIỂN THỊ MỘT ĐÁNH GIÁ ===
const ReviewItem = ({ review, isOwnReview, onEdit, onDelete }) => (
    <div className="flex gap-4 border-b pb-4 last:border-b-0">
        <Avatar src={review.user?.avatar || '/user.png'} alt={review.user?.name} />
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Typography variant="subtitle2" fontWeight="bold">{review.user?.name || 'Người dùng ẩn danh'}</Typography>
                    {isOwnReview && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Đây là bạn</span>}
                </div>
                <Typography variant="caption" color="text.secondary">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</Typography>
            </div>
            <Rating name="read-only" value={review.rating} readOnly size="small" />
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{review.comment}</Typography>

            {isOwnReview && (
                <div className="flex items-center justify-end gap-1 mt-2">
                    <Tooltip title="Sửa đánh giá">
                        <IconButton size="small" onClick={() => onEdit(review)}>
                            <FiEdit className="text-sm" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa đánh giá">
                        <IconButton size="small" onClick={() => onDelete(review._id)}>
                            <FiTrash2 className="text-sm text-red-500" />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </div>
    </div>
);


// === COMPONENT TRANG CHÍNH ===
const ProductDetails = () => {
    const { productId } = useParams();
    // Lấy đầy đủ các giá trị cần thiết từ context
    const { isLogin, userData, openAlerBox } = useContext(MyContext);

    // State cho sản phẩm và tab
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActiveTab, setActiveTab] = useState(0);

    // State cho đánh giá
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');

    // State để quản lý chế độ của form: 'create' hoặc 'edit'
    const [formMode, setFormMode] = useState('create');
    const [editingReviewId, setEditingReviewId] = useState(null);

    // --- LOGIC GỌI API ---
    useEffect(() => {
        if (!productId) { setIsLoading(false); return; }
        window.scrollTo(0, 0);
        const fetchProductDetails = async () => {
            setIsLoading(true);
            try {
                const result = await fetchDataFromApi(`/api/products/${productId}`);
                if (result.success) {
                    setProduct(result.product);
                } else {
                    openAlerBox("error", "Không tìm thấy sản phẩm.");
                }
            } catch (error) {
                openAlerBox("error", "Lỗi khi tải chi tiết sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId, openAlerBox]);

    useEffect(() => {
        if (!productId) return;
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const result = await fetchDataFromApi(`/api/reviews/${productId}`);
                if (result.success) {
                    setReviews(result.data);
                }
            } catch (error) { console.error("Lỗi khi tải đánh giá:", error); }
            finally { setIsLoadingReviews(false); }
        };
        fetchReviews();
    }, [productId]);

    // --- LOGIC XỬ LÝ FORM ĐÁNH GIÁ ---

    // Tìm đánh giá của người dùng hiện tại trong danh sách
    const userReview = useMemo(() => {
        if (!isLogin || !userData) return null;
        return reviews.find(review => review.user?._id === userData._id);
    }, [reviews, isLogin, userData]);

    // Tự động chuyển form sang chế độ 'edit' nếu người dùng đã có đánh giá
    useEffect(() => {
        if (userReview) {
            setFormMode('edit');
            setEditingReviewId(userReview._id);
            setUserRating(userReview.rating);
            setUserComment(userReview.comment);
        } else {
            setFormMode('create');
            setEditingReviewId(null);
            setUserRating(5);
            setUserComment('');
        }
    }, [userReview]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin) return toast.error("Vui lòng đăng nhập.");
        if (userComment.trim() === '') return toast.error("Vui lòng nhập bình luận.");

        if (formMode === 'create') {
            await handleCreateReview();
        } else {
            await handleUpdateReview();
        }
    };

    const handleCreateReview = async () => {
        try {
            const payload = { productId, rating: userRating, comment: userComment };
            const result = await postData('/api/reviews/', payload);
            if (result.success) {
                toast.success("Gửi đánh giá thành công!");
                setReviews([result.data, ...reviews]);
            } else { throw new Error(result.message); }
        } catch (error) { toast.error(`Lỗi: ${error.message}`); }
    };

    const handleUpdateReview = async () => {
        try {
            const payload = { rating: userRating, comment: userComment };
            const result = await updateData(`/api/reviews/${editingReviewId}`, payload);
            if (result.success) {
                toast.success("Cập nhật đánh giá thành công!");
                setReviews(reviews.map(r => r._id === editingReviewId ? result.data : r));
            } else { throw new Error(result.message); }
        } catch (error) { toast.error(`Lỗi: ${error.message}`); }
    };

    const handleEditClick = (review) => {
        setUserRating(review.rating);
        setUserComment(review.comment);
        document.querySelector('.reviews-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteClick = async (reviewId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
            try {
                const result = await deleteData(`/api/reviews/${reviewId}`);
                if (result.success) {
                    toast.success("Xóa đánh giá thành công!");
                    setReviews(reviews.filter(r => r._id !== reviewId));
                } else { throw new Error(result.message); }
            } catch (error) { toast.error(`Lỗi: ${error.message}`); }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    if (!product) {
        return <div className="text-center py-10"><Typography>Không tìm thấy sản phẩm.</Typography></div>;
    }

    const productInfoDetails = [
        ["Tên sản phẩm", product.name],
        ["Thương hiệu", product.brand || 'N/A'],
        ["Danh mục", product.category?.name || 'N/A'],
        ["Tồn kho", `${product.countInStock} sản phẩm`],
        ["Đánh giá", `${product.rating || 0} / 5 sao`],
    ];

    return (
        <>
            <div className='py-5 bg-gray-50 border-b'>
                <div className="container">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link component={RouterLink} underline="hover" color="inherit" to="/">TRANG CHỦ</Link>
                        {product.category && <Link component={RouterLink} underline="hover" color="inherit" to={`/category/${product.category._id}`}>{product.category.name.toUpperCase()}</Link>}
                        <Typography color="text.primary">{product.name.toUpperCase()}</Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <section className='bg-white py-8'>
                <div className="!w-[85%] container grid grid-cols-1 lg:grid-cols-2 ">
                    <div className="w-full">
                        <ZoomdetailPage images={product.images} />
                    </div>
                    <div className="w-full">
                        <ProductDetailsComponets product={product} />
                    </div>
                </div>

                <div className="container pt-12">
                    <div className="flex items-center gap-8 mb-5 border-b">
                        <span className={`py-3 font-medium cursor-pointer transition-all ${isActiveTab === 0 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`} onClick={() => setActiveTab(0)}>Mô tả</span>
                        <span className={`py-3 font-medium cursor-pointer transition-all ${isActiveTab === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`} onClick={() => setActiveTab(1)}>Thông tin chi tiết</span>
                        <span className={`py-3 font-medium cursor-pointer transition-all ${isActiveTab === 2 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`} onClick={() => setActiveTab(2)}>Đánh giá ({reviews.length})</span>
                    </div>

                    <Box sx={{ mt: 3 }}>
                        {isActiveTab === 0 && (
                            <div
                                className="prose max-w-none shadow-md py-8 px-8 rounded-md leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.richDescription || product.description.replace(/\n/g, '<br />') }}
                            />
                        )}

                        {isActiveTab === 1 && (
                            <div className="shadow-md w-full py-8 px-8 rounded-md space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/2 w-full">
                                        <h3 className="text-2xl font-semibold mb-4">Thông tin chi tiết</h3>
                                        <table className="table-auto w-full border border-gray-300 text-sm">
                                            <tbody>
                                                {productInfoDetails.map(([label, value], index) => (
                                                    <tr key={index} className="even:bg-gray-50">
                                                        <td className="border px-3 py-2 font-medium w-1/3">{label}</td>
                                                        <td className="border px-3 py-2">{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:w-1/2 w-full flex justify-center items-center">
                                        <img
                                            src={product.images?.[1] || product.images?.[0] || '/placeholder.png'}
                                            alt="Hình minh họa sản phẩm"
                                            className="rounded-md border shadow-md max-h-[400px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isActiveTab === 2 && (
                            <div className="shadow-md w-full md:w-4/5 py-8 px-8 rounded-md">
                                <h3 className="text-2xl font-semibold mb-4">Đánh giá & Bình luận</h3>
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 mb-6">
                                    {isLoadingReviews ? (
                                        <div className="flex justify-center"><CircularProgress size={24} /></div>
                                    ) : reviews.length > 0 ? (
                                        reviews.map(review => (
                                            <ReviewItem
                                                key={review._id}
                                                review={review}
                                                isOwnReview={isLogin && userData?._id === review.user?._id}
                                                onEdit={handleEditClick}
                                                onDelete={handleDeleteClick}
                                            />
                                        ))
                                    ) : (
                                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                    )}
                                </div>
                                <div className="reviews-form bg-gray-50 p-4 rounded-md">
                                    <h4 className='text-lg font-semibold'>
                                        {formMode === 'create' ? 'Để lại bình luận của bạn' : 'Chỉnh sửa đánh giá của bạn'}
                                    </h4>
                                    <form className='w-full mt-4 space-y-4' onSubmit={handleFormSubmit}>
                                        <TextField
                                            label="Nhập bình luận..."
                                            multiline
                                            rows={3}
                                            fullWidth
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                            disabled={!isLogin}
                                        />
                                        <Rating
                                            name="user-rating"
                                            value={userRating}
                                            onChange={(event, newValue) => { setUserRating(newValue); }}
                                            disabled={!isLogin}
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" variant="contained" disabled={!isLogin}>
                                                {formMode === 'create' ? 'Gửi bình luận' : 'Cập nhật'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Box>
                </div>

                <div className="container pt-14">
                    <h2 className='text-2xl font-bold mb-4'>Sản phẩm tương tự</h2>
                    <ProductsSlider items={6} categoryId={product.category?._id} />
                </div>
            </section>
        </>
    );
};

export default ProductDetails;