import React from 'react';
import { Link } from 'react-router-dom';

import { MdDelete } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi2";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

const dummyCartItems = [
    { id: 1, name: 'Tai nghe chống ồn Sony phiên bản mới nhất 2024', price: 1190000, quantity: 1, image: '/product/product(14).png' },
    { id: 2, name: 'Đồng hồ thông minh Pro X', price: 2500000, quantity: 2, image: '/product/product(15).png' },
    { id: 3, name: 'Bàn phím cơ không dây', price: 850000, quantity: 1, image: '/product/product(7).png' },
    { id: 4, name: 'Tai nghe chống ồn Sony phiên bản mới nhất 2024', price: 1190000, quantity: 1, image: '/product/product(14).png' },
    { id: 5, name: 'Đồng hồ thông minh Pro X', price: 2500000, quantity: 2, image: '/product/product(15).png' },
    { id: 6, name: 'Bàn phím cơ không dây', price: 850000, quantity: 1, image: '/product/product(7).png' },
    { id: 7, name: 'Tai nghe chống ồn Sony phiên bản mới nhất 2024', price: 1190000, quantity: 1, image: '/product/product(14).png' },
    { id: 8, name: 'Đồng hồ thông minh Pro X', price: 2500000, quantity: 2, image: '/product/product(15).png' },
    { id: 9, name: 'Bàn phím cơ không dây', price: 850000, quantity: 1, image: '/product/product(7).png' },
];

const CartPanel = () => {
    if (dummyCartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
                <HiOutlineShoppingCart className="text-7xl text-gray-300 mb-5" />
                <h4 className="text-xl font-semibold text-gray-800">Giỏ hàng trống</h4>
                <p className="text-md text-gray-500 mt-2 max-w-xs">
                    Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá cửa hàng nhé!
                </p>
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 !max-h-[440px] overflow-y-auto p-6 space-y-5">
                {dummyCartItems.map(item => (
                    <div key={item.id} className="cart-item flex space-x-4 border-b border-gray-200 pb-5 mb-5">
                        <div className="w-20 h-20 flex-shrink-0">
                            <Link to={`/product-detail/${item.id}`} className="block rounded-lg overflow-hidden border">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </Link>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className='flex justify-between items-start'>
                                <Link to={`/product-detail/${item.id}`} className="font-semibold text-sm text-gray-800 hover:text-blue-600 line-clamp-2 pr-2">
                                    {item.name}
                                </Link>
                                <button className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" title="Xóa sản phẩm">
                                    <MdDelete className="text-[25px]" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-2">
                                <div className="flex items-center border border-gray-200 rounded-full">
                                    <IconButton size="small" disabled className="!text-gray-500">
                                        <FiMinus className="w-3.5 h-3.5" />
                                    </IconButton>
                                    <span className="px-3 text-sm font-bold">{item.quantity}</span>
                                    <IconButton size="small" disabled className="!text-gray-500">
                                        <FiPlus className="w-3.5 h-3.5" />
                                    </IconButton>
                                </div>
                                <p className="text-blue-600 font-bold text-md">{item.price.toLocaleString()} đ</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 p-6 border-t-2 border-gray-100 bg-white shadow-[0_-4px_12px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-md font-bold text-gray-800">Tạm tính:</span>
                    <span className="text-2xl font-bold text-blue-600">14,260,000 đ</span>
                </div>
                <p className="text-xs text-gray-500 text-center mb-4">
                    Phí vận chuyển sẽ được tính ở trang thanh toán.
                </p>
                <div className="flex flex-col gap-3">
                    <Button
                        component={Link}
                        to="/checkout"
                        variant="contained"
                        fullWidth
                        className="!py-3 !bg-blue-600 hover:!bg-blue-700 !font-semibold !rounded-lg !shadow-lg !shadow-blue-500/30"
                    >
                        Tiến hành thanh toán
                    </Button>
                    <Button
                        component={Link}
                        to="/view-cart"
                        variant="outlined"
                        fullWidth
                        className="!py-2 !border-gray-300 !text-gray-700 hover:!bg-gray-100 !rounded-lg"
                    >
                        Xem giỏ hàng chi tiết
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartPanel;