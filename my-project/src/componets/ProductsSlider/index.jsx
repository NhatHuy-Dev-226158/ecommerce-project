// src/componets/ProductsSlider/index.jsx

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductItem from '../ProductItem';
import { fetchDataFromApi } from '../../utils/api'; // Import hàm API
import { Skeleton } from '@mui/material'; // Import Skeleton cho loading

const ProductsSlider = ({ categoryId, items = 6 }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            let url = `/api/products/?limit=10`; // Lấy 10 sản phẩm
            if (categoryId) {
                url = `/api/products/?categories=${categoryId}&limit=10`;
            }
            try {
                const result = await fetchDataFromApi(url);
                if (result.success) {
                    setProducts(result.products);
                }
            } catch (error) {
                console.error("Failed to fetch products for slider:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);


    return (
        <div className='productsSlider py-3'>
            <Swiper
                slidesPerView={items}
                spaceBetween={15}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
                // Thêm breakpoints để responsive
                breakpoints={{
                    320: { slidesPerView: 2 },
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: items },
                }}
            >
                {isLoading ? (
                    Array.from(new Array(items)).map((_, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white shadow-md rounded-lg p-4">
                                <div className="w-full aspect-square bg-gray-200 rounded-md animate-pulse"></div>
                                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="mt-2 h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    products.map(product => (
                        <SwiperSlide key={product._id}>
                            <ProductItem product={product} />
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </div>
    );
};

export default ProductsSlider;