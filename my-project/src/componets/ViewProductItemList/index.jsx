import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Rating, Chip, IconButton, Tooltip, Divider, Button } from '@mui/material';
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { GoGitCompare } from "react-icons/go";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MyContext } from '../../App';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const ViewProductItemList = ({ product }) => {
    const context = useContext(MyContext);
    const isWished = context.isInWishlist(product._id);

    const handleWishlistToggle = () => {
        if (isWished) {
            context.removeFromWishlist(product._id);
        } else {
            context.addToWishlist(product);
        }
    };

    if (!product) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-4 bg-white rounded-xl border border-transparent shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-200 group"
        >
            {/* Tag giảm giá */}
            {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                </div>
            )}

            {/* Cột 1: Ảnh sản phẩm */}
            <div className="col-span-12 md:col-span-3">
                <Link to={`/product-detail/${product._id}`} className="block overflow-hidden rounded-lg">
                    <img
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Cột 2: Nội dung */}
            <div className="col-span-12 md:col-span-9 flex flex-col justify-center h-full">
                <div>
                    <Typography component="p" variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                        {product.brand || 'Thương hiệu'}
                    </Typography>

                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', my: 0.5, lineHeight: 1.3 }}>
                        <Link to={`/product-detail/${product._id}`}
                            className="text-gray-800 hover:text-primary transition-colors no-underline">
                            {product.name}
                        </Link>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Rating name="read-only" value={product.rating || 0} precision={0.5} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" className="line-clamp-2">
                        {product.description}
                    </Typography>
                </div>

                <Divider sx={{ my: 2.5 }} />

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Cột giá */}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                        <Typography variant="h5" fontWeight="bold" color="primary.main">{formatCurrency(product.price)}</Typography>
                        {product.oldPrice > 0 && (
                            <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>{formatCurrency(product.oldPrice)}</Typography>
                        )}
                    </Box>

                    {/* Cột hành động */}
                    <div className="flex items-center justify-start w-full sm:w-auto gap-2">
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
                            <Tooltip title={isWished ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                                <IconButton size="small" onClick={handleWishlistToggle} sx={{ p: 1.25 }}>
                                    {isWished ? <FaHeart className="text-red-500" /> : <FiHeart />}
                                </IconButton>
                            </Tooltip>
                            <Divider orientation="vertical" flexItem />
                            <Tooltip title="So sánh sản phẩm">
                                <IconButton size="small" onClick={() => toast('Chức năng đang phát triển!')} sx={{ p: 1.25 }}><GoGitCompare /></IconButton>
                            </Tooltip>
                        </Box>
                        <Button
                            onClick={() => toast.success(`${product.name} đã được thêm vào giỏ!`)}
                            variant="contained"
                            startIcon={<FiShoppingCart />}
                            className='org-btn gap-2 flex h-[40px] hover:!bg-[#38362b]'                        >
                            Thêm vào giỏ
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ViewProductItemList;