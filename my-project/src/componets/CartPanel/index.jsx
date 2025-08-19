import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { MyContext } from '../../App';
import { Link as RouterLink } from 'react-router-dom';


const Cart = () => {
    const context = useContext(MyContext);
    const subtotal = context.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // GIAO DIỆN KHI GIỎ HÀNG TRỐNG
    if (context.cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50">
                <HiOutlineShoppingCart className="text-7xl text-gray-300 mb-5" />
                <h4 className="text-xl font-semibold text-gray-800">Giỏ hàng của bạn đang trống</h4>
                <p className="text-md text-gray-500 mt-2 max-w-xs">
                    Hãy khám phá và thêm sản phẩm bạn yêu thích vào giỏ hàng nhé!
                </p>
                <Button
                    onClick={context.toggleCartPanel(false)}
                    variant="contained"
                    fullWidth
                    className="!mt-6 !py-3 !bg-blue-600 hover:!bg-blue-700 !font-semibold !rounded-lg"
                >
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* LẶP QUA MẢNG `cart` TỪ CONTEXT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {context.cart.map(item => (
                    <div key={item._id} className="cart-item flex space-x-4 border-b border-gray-200 pb-5 last:border-b-0">
                        <div className="w-20 h-20 flex-shrink-0">
                            <Link
                                component={RouterLink} // Chỉ định nó hoạt động như RouterLink
                                to={`/product-detail/${item._id}`} // Cung cấp đường dẫn
                                onClick={context.toggleCartPanel(false)} // Giữ lại onClick để đóng panel
                                className="block rounded-lg overflow-hidden border"
                            >
                                <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                            </Link>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className='flex justify-between items-start'>
                                <Link
                                    component={RouterLink}
                                    to={`/product-detail/${item._id}`}
                                    onClick={context.toggleCartPanel(false)}
                                    className="font-semibold text-sm text-gray-800 hover:text-blue-600 line-clamp-2 pr-2"
                                    underline="hover"
                                    color="inherit"
                                >
                                    {item.name}
                                </Link>
                                <button onClick={() => context.removeFromCart(item.cartItemId)}>
                                    <MdDelete className="text-xl" />
                                </button>
                            </div>


                            <div className="flex items-center justify-between mt-auto pt-2">
                                {/* KẾT NỐI CÁC HÀM CẬP NHẬT SỐ LƯỢNG */}
                                <div className="flex items-center border border-gray-200 rounded-full">
                                    <IconButton size="small" onClick={() => context.updateQuantity(item.cartItemId, item.quantity - 1)} className="!text-gray-500">
                                        <FiMinus className="w-3.5 h-3.5" />
                                    </IconButton>
                                    <span className="px-3 text-sm font-bold">{item.quantity}</span>
                                    <IconButton size="small" onClick={() => context.updateQuantity(item.cartItemId, item.quantity + 1)} className="!text-gray-500">
                                        <FiPlus className="w-3.5 h-3.5" />
                                    </IconButton>
                                </div>
                                <p className="text-blue-600 font-bold text-md">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HIỂN THỊ TỔNG TIỀN ĐỘNG */}
            <div className="flex-shrink-0 p-6 border-t-2 border-gray-100 bg-white shadow-[0_-4px_12px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-md font-bold text-gray-800">Tạm tính:</span>
                    <span className="text-2xl font-bold text-blue-600">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <p className="text-xs text-gray-500 text-center mb-4">
                    Phí vận chuyển sẽ được tính ở trang thanh toán.
                </p>
                <div className="flex flex-col gap-3">
                    <Button
                        component={Link}
                        to="/checkout"
                        onClick={context.toggleCartPanel(false)}
                        variant="contained"
                        fullWidth
                        className="!py-3 !bg-blue-600 hover:!bg-blue-700 !font-semibold !rounded-lg"
                    >
                        Tiến hành thanh toán
                    </Button>
                    <Button
                        component={Link}
                        to="/view-cart"
                        onClick={context.toggleCartPanel(false)}
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

export default Cart;