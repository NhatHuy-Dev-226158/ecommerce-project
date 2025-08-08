import React, { useState } from 'react'
import AddProductQuantity from '../../componets/AddProductQuantity';
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

const ProductDetailsComponets = () => {
    const [isProductSizeBtn, setProductSizeBtn] = useState(null);
    return (
        <>
            <h1 className='text-[24px] font-[600] mb-2'> Name Product </h1>
            <div className="flex items-center gap-2">
                <span className='text-gray-400 text-[13px]'>
                    Brands :
                    <span className='font-[500] text-[#000] opacity-80'>
                        Name Brand
                    </span>
                </span>
                <Rating name="size-small" defaultValue={3} size="small" readOnly />
                <span className='text-[#5f5f5f] text-[13px] font-[500] cursor-pointer'>Reviews (0)</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
                <span className='oldPrice line-through text-gray-500 text-[20px] font-[500]'>1,490,000</span>
                <span className='price text-primary text-[20px] font-[600]'>1,190,000</span>
                <span className='text-[14px]'>Trong Kho: <span className='!text-[#059f00] text-[14px] font-bold'>123 Items</span> </span>
            </div>
            <p className='text-[14px] mt-3 leading-[25px] pr-2 mb-5'>
                Tai nghe Bluetooth Zento X9 – Âm thanh đỉnh cao, thiết kế thời thượng
                Zento X9 là dòng tai nghe không dây thế hệ mới với công nghệ chống ồn chủ động (ANC),
                mang lại trải nghiệm nghe nhạc trong trẻo và không bị gián đoạn bởi tiếng ồn xung quanh.
                Thời lượng pin lên tới 30 giờ giúp bạn sử dụng cả ngày dài mà không lo sạc. Thiết kế gọn nhẹ,
                đệm tai êm ái tạo cảm giác thoải mái khi đeo lâu. Kết nối Bluetooth 5.2 nhanh chóng và ổn định,
                thích hợp cho học tập, làm việc và giải trí mọi lúc mọi nơi.
            </p>
            <div className="flex items-center gap-3">
                <span className='text-[16px]'>Size: </span>
                <div className="btn-size flex items-center gap-1">
                    <Button className={`${isProductSizeBtn === 0 ? '!bg-[#ff0084] !text-[#ffffff]' : ''}`} onClick={() => setProductSizeBtn(0)}>S</Button>
                    <Button className={`${isProductSizeBtn === 1 ? '!bg-[#ff0084] !text-[#ffffff]' : ''}`} onClick={() => setProductSizeBtn(1)}>M</Button>
                    <Button className={`${isProductSizeBtn === 2 ? '!bg-[#ff0084] !text-[#ffffff]' : ''}`} onClick={() => setProductSizeBtn(2)}>L</Button>
                    <Button className={`${isProductSizeBtn === 3 ? '!bg-[#ff0084] !text-[#ffffff]' : ''}`} onClick={() => setProductSizeBtn(3)}>XL</Button>
                    <Button className={`${isProductSizeBtn === 4 ? '!bg-[#ff0084] !text-[#ffffff]' : ''}`} onClick={() => setProductSizeBtn(4)}>XXL</Button>
                </div>
            </div>

            <p className='text-[14px] mt-3 mb-2'> Free Ship Khi Giao Hàng Trể</p>

            <div className="flex items-center gap-3">
                <div className="product-Quantity w-[70px]">
                    <AddProductQuantity></AddProductQuantity>
                </div>

                <Button className='org-btn gap-2 flex h-[40px] hover:!bg-[#38362b]'>
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
