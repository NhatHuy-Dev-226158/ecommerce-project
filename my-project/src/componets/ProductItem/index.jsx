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


const ProductItem = ({ product }) => {
    const context = useContext(MyContext);
    const isWished = context.isInWishlist(product._id);

    const handleWishlistClick = () => {
        if (isWished) {
            context.removeFromWishlist(product._id);
        } else {
            context.addToWishlist(product);
        }
    };

    const handleAddToCart = () => {
        context.addToCart(product, 1);
    };

    const handleOpenModel = () => {
        context.setProductDataForModel(product);
        context.setOpenProductDetailModel(true);
    };

    if (!product) {
        return null;
    }
    const img1 = product.images?.[0] || '/placeholder.png';
    const img2 = product.images?.[1] || img1;

    return (
        <div className='productItem group flex flex-col bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1'>
            <div className="img-Wrapper w-full overflow-hidden relative">
                <Link to={`/product-detail/${product._id}`}>
                    <div className="img h-[210px]">
                        <img src={img1} alt={product.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                        <img src={img2} alt={product.name} className='w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100' />
                    </div>
                </Link>

                {product.discount > 0 && (
                    <span className='absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                        -{product.discount}%
                    </span>
                )}
                <div className="actions absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className='action-btn' onClick={handleOpenModel}>
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

            <div className="info p-2 flex flex-col flex-grow">
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

                <div className="grid">
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