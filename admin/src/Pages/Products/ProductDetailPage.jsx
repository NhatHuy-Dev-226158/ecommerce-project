// src/pages/ProductDetail/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api'; // Giả sử bạn có hàm này ở phía user
import { CircularProgress, Typography } from '@mui/material';

const ProductDetailPage = () => {
    // Lấy productId từ URL
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                // Backend của bạn có endpoint GET /api/product/:id
                const result = await fetchDataFromApi(`/api/products/${productId}`);
                if (result.success) {
                    setProduct(result.product);
                } else {
                    setError('Không tìm thấy sản phẩm.');
                }
            } catch (err) {
                setError('Lỗi khi tải dữ liệu sản phẩm.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]); // Chạy lại mỗi khi productId thay đổi

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><CircularProgress /></div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '40px' }}><Typography color="error">{error}</Typography></div>;
    }

    if (!product) {
        return null; // Hoặc một thông báo khác
    }

    // Giao diện hiển thị chi tiết sản phẩm
    return (
        <div>
            <h1>{product.name}</h1>
            <img src={product.images?.[0]} alt={product.name} style={{ maxWidth: '400px' }} />
            <p>{product.price.toLocaleString('vi-VN')} đ</p>
            <p>Mô tả:</p>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            {/* Thêm các thông tin khác và nút "Thêm vào giỏ hàng" ở đây */}
        </div>
    );
};

export default ProductDetailPage;