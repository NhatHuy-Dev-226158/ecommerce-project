import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Rating, Chip, IconButton, Tooltip, Divider, Button } from '@mui/material'; // Thêm Divider
import { FaHeart, FaCheckCircle } from "react-icons/fa";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { GoGitCompare } from "react-icons/go";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// --- DỮ LIỆU MẪU & HÀM TIỆN ÍCH ---
const sampleProduct = {
    id: 'product-123',
    brand: 'AURA',
    name: 'Studio Wireless Headphones Gen 3',
    rating: 4.8,
    reviews: 256,
    image1: '/product/720x840.png',
    stockStatus: 'In Stock',
    tags: ['Noise-Cancelling', 'Hi-Fi Audio'],
    shortDescription: 'Immerse yourself in pure, high-fidelity sound with our iconic, ergonomically designed wireless headphones. Immerse yourself in pure, high-fidelity sound with our iconic, ergonomically designed wireless headphones.',
    currentPrice: 3190000,
    oldPrice: 3890000,
    discount: '18%'
};
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ViewProductItemList = ({ product = sampleProduct }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const handleWishlistToggle = () => setIsWishlisted(!isWishlisted);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative grid grid-cols-10 items-center gap-6 p-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200/50 group"
        >
            {/* Tag giảm giá */}
            {product.discount && (
                <Box sx={{
                    position: 'absolute', top: '16px', left: '16px', zIndex: 10,
                    bgcolor: 'error.main', color: 'white',
                    px: 1.5, py: 0.5, borderRadius: '6px',
                    fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                    - {product.discount}
                </Box>
            )}

            {/* Cột 1: Ảnh sản phẩm */}
            <div className="col-span-10 md:col-span-3">
                <Link to={`/product-detail/${product.id}`} className="block overflow-hidden rounded-xl">
                    <img
                        src={product.image1}
                        alt={product.name}
                        className="w-full h-full object-cover aspect-square transform transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Cột 2: Nội dung */}
            <div className="col-span-10 md:col-span-7 flex flex-col justify-center h-full">
                <div>
                    <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'grey.600' }}>
                        {product.brand}
                    </Typography>

                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', my: 0.5, lineHeight: 1.25 }}>
                        <Link to={`/product-detail/${product.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            className="transition-colors hover:!text-indigo-600">
                            {product.name}
                        </Link>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Rating name="read-only" value={product.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">({product.reviews} đánh giá)</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {product.shortDescription}
                    </Typography>
                </div>

                <Divider sx={{ my: 2 }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Cột giá và tag */}
                    <div>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                            <Typography variant="h5" fontWeight="bold" color="primary.main">{formatCurrency(product.currentPrice)}</Typography>
                            {product.oldPrice && (
                                <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>{formatCurrency(product.oldPrice)}</Typography>
                            )}
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            {product.tags.map(tag => (<Chip key={tag} label={tag} size="small" />))}
                        </Box>
                    </div>

                    {/* Cột hành động */}
                    <div className="flex items-center justify-start sm:justify-end gap-2">
                        {/* Các nút icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: 1, borderColor: 'grey.300', borderRadius: 2, p: '4px' }}>
                            <Tooltip title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                                <IconButton size="small" onClick={handleWishlistToggle}>
                                    {isWishlisted ? <FaHeart className="text-red-500" /> : <FiHeart className="text-gray-500" />}
                                </IconButton>
                            </Tooltip>
                            <Divider orientation="vertical" flexItem />
                            <Tooltip title="So sánh sản phẩm">
                                <IconButton size="small" onClick={() => toast('Chức năng đang phát triển!')}><GoGitCompare className="text-gray-500" /></IconButton>
                            </Tooltip>
                        </Box>
                        {/* Nút thêm vào giỏ */}
                        <Button
                            onClick={() => toast.success(`${product.name} đã được thêm vào giỏ!`)}
                            variant="contained"
                            startIcon={<FiShoppingCart />}
                            sx={{
                                py: 1.25,
                                px: { xs: 2, sm: 3 },
                                borderRadius: '8px',
                                fontWeight: 'bold'
                            }}
                        >
                            Thêm vào giỏ
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ViewProductItemList;