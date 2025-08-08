import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { TbZoomScanFilled } from "react-icons/tb";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { MyContext } from '../../App';
import { FaCartArrowDown } from "react-icons/fa6";

import '../ProductItem/style.css'

const sampleProduct = {
    id: 1,
    name: 'Tên Sản Phẩm Dài Hơn Một Chút',
    description: 'Mô tả ngắn gọn nhưng đầy đủ về sản phẩm',
    rating: 4,
    oldPrice: 1490000,
    price: 1190000,
    discount: 10,
    img2: '/product/720x840.png',
    img1: '/product/download(1).png'
}

const ProductItem = ({ product = sampleProduct }) => {
    const context = useContext(MyContext);

    const [isWished, setIsWished] = useState(false);

    const handleWishlistClick = () => {
        setIsWished(!isWished);
    };

    const handleAddToCart = () => {
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }

    return (
        <div className='productItem group flex flex-col bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1'>
            <div className="img-Wrapper w-full overflow-hidden relative">
                <Link to={`/product-detail/${product.id}`}>
                    <div className="img h-[220px]">
                        <img src={product.img1} alt={product.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                        <img src={product.img2} alt={product.name} className='w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100' />
                    </div>
                </Link>

                {product.discount > 0 && (
                    <span className='absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                        -{product.discount}%
                    </span>
                )}
                <div className="actions absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className='action-btn' onClick={() => context.setOpenProductDetailModel(true)}>
                        <TbZoomScanFilled />
                    </Button>
                    <Button className='action-btn' onClick={handleWishlistClick}>
                        {isWished ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </Button>
                    <Button className='action-btn'>
                        <IoMdGitCompare />
                    </Button>
                    <Button className='action-btn'
                        onClick={handleAddToCart}
                    >
                        <FaCartArrowDown />
                    </Button>
                </div>
            </div>

            <div className="info p-4 flex flex-col flex-grow">
                <h6 className='text-sm text-gray-500 mb-1'>Thương hiệu</h6>
                <h3 className='text-base font-semibold text-gray-800 overflow-hidden'>
                    <Link to={`/product-detail/${product.id}`} className='hover:text-red-500 transition-colors'>
                        {product.name}
                    </Link>
                </h3>
                <div className="my-2 flex items-center gap-8 ">
                    <Rating name="read-only" value={product.rating} size="small" readOnly />
                    <p className='text-[12px] text-gray-500'>Review(123)</p>
                </div>

                <div className="flex items-center gap-3 ">
                    <span className='text-lg font-[600] text-red-600'>{product.price.toLocaleString()}</span>
                    {product.oldPrice && (
                        <span className='text-sm line-through text-gray-400'>{product.oldPrice.toLocaleString()}</span>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ProductItem;