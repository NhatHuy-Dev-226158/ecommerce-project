import React, { useContext, useState } from 'react';
import AddProductQuantity from '../../componets/AddProductQuantity';
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { MyContext } from '../../App';

const ProductDetailsComponets = ({ product }) => {
    const context = useContext(MyContext);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        context.addToCart(product, quantity);
    };
    const [selectedSize, setSelectedSize] = useState(null);
    if (!product) {
        return <div>Đang tải thông tin sản phẩm...</div>;
    }

    return (
        <>
            <h1 className='text-2xl md:text-3xl font-bold mb-2'>{product.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
                <span className='text-gray-500 text-sm'>
                    Thương hiệu:
                    <span className='font-medium text-gray-800 ml-1'>
                        {product.brand || 'Chưa cập nhật'}
                    </span>
                </span>
                <Rating name="read-only" value={product.rating || 0} size="small" readOnly />
            </div>
            <div className="flex items-center gap-4 mt-4">
                <span className='text-primary text-2xl md:text-3xl font-bold'>{product.price.toLocaleString('vi-VN')} đ</span>
                {product.oldPrice > 0 && <span className='line-through text-gray-400 text-xl'>{product.oldPrice.toLocaleString('vi-VN')} đ</span>}
            </div>
            <div className='mt-2'>
                <span className='text-sm'>Trong kho: <span className='font-bold text-green-600'>{product.countInStock} sản phẩm</span></span>
            </div>
            <p className='text-sm mt-5 leading-relaxed text-gray-600'>{product.description}</p>
            {product.size && product.size.length > 0 && product.size[0] !== null && (
                <div className="flex items-center gap-3 mt-5">
                    <span className='text-base font-medium'>Size: </span>
                    <div className="btn-size flex items-center gap-2 flex-wrap">
                        {product.size.map((sizeValue, index) => (
                            <Button
                                key={index}
                                variant={selectedSize === sizeValue ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => setSelectedSize(sizeValue)}
                                sx={{
                                    minWidth: '45px',
                                    padding: '6px 12px',
                                    borderRadius: '8px'
                                }}
                            >
                                {sizeValue}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <p className='text-sm mt-5 mb-4 text-gray-500'>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>

            <div className="flex items-center gap-4">
                <div className="product-Quantity w-[100px]">
                    <AddProductQuantity quantity={quantity} setQuantity={setQuantity} />                </div>

                <Button onClick={handleAddToCart} className='org-btn gap-2 flex h-[40px] hover:!bg-[#38362b]'>
                    <HiOutlineShoppingCart className='text-[22px]' />
                    Mua Ngay
                </Button>
            </div>
            <div className="flex items-center gap-4 mt-6">
                <span className='flex items-center gap-2 text-[14px] link cursor-pointer
                            font-[500]'>
                    <FaRegHeart className='text-[18px]' />Đánh dấu yêu thích
                </span>
                <span className='flex items-center gap-2 text-[14px] link cursor-pointer
                            font-[500]'>
                    <IoMdGitCompare className='text-[18px]' />So Sánh
                </span>
            </div>
        </>
    )
}

export default ProductDetailsComponets;
