import React, { useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';

// Thư viện UI & Icons
import Button from '@mui/material/Button';
import { FiChevronRight, FiHome, FiArrowLeft, FiLock } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";

// Component con & Context
import CartItem from './CartComponets/CartItem';
import EmptyCart from './CartComponets/EmptyCart';
import { MyContext } from '../../App';

// Hàm tiện ích
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CartPage = () => {
    const context = useContext(MyContext);
    const { cart, updateQuantity, removeFromCart } = context;

    const { totalItems, subtotal, total, shipping } = useMemo(() => {
        const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const ship = sub > 0 ? 30000 : 0;
        return {
            totalItems: itemsCount,
            subtotal: sub,
            shipping: ship,
            total: sub + ship
        };
    }, [cart]);

    if (cart.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="container mx-auto max-w-7xl relative z-10">

                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="flex items-center hover:text-indigo-600 transition-colors">
                        <FiHome className="mr-2" /> Trang chủ
                    </Link>
                    <FiChevronRight className="mx-2" />
                    <span className="font-semibold text-gray-700">Giỏ hàng</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                    {/* Cột Trái: Danh sách sản phẩm */}
                    <div className="w-full lg:w-[65%] xl:w-[68%]">
                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30">
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800">Bạn có {totalItems} sản phẩm trong giỏ</h2>
                                <Link to="/product-list" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    Tiếp tục mua sắm <FiArrowLeft className="ml-1 transform rotate-180" />
                                </Link>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-4">
                                {cart.map(item => (
                                    <CartItem
                                        key={item.cartItemId}
                                        item={item}
                                        onUpdate={updateQuantity}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: Tóm tắt đơn hàng */}
                    <div className="w-full lg:w-[35%] xl:w-[32%]">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
                                    <div className="space-y-3 text-gray-700">
                                        <div className="flex justify-between"><span>Tổng tiền hàng</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                                        <div className="flex justify-between"><span>Phí vận chuyển</span><span className="font-medium">{formatCurrency(shipping)}</span></div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200">
                                    <div className="flex justify-between items-baseline text-gray-900 mb-4">
                                        <span className="text-lg font-bold">Tổng cộng:</span>
                                        <span className="text-3xl font-bold text-indigo-600">{formatCurrency(total)}</span>
                                    </div>
                                    <Link to='/checkout'>
                                        <Button
                                            fullWidth variant="contained" size="large" startIcon={<FiLock />}
                                            sx={{
                                                py: 1.5, fontWeight: 'bold', borderRadius: '12px', textTransform: 'none', fontSize: '1.1rem',
                                                transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: 8 }
                                            }}
                                        >
                                            Tiến hành thanh toán
                                        </Button>
                                    </Link>
                                    <div className="flex items-center justify-center gap-4 mt-4 text-gray-400 text-2xl">
                                        <FaCcVisa /><FaCcMastercard /><FaPaypal />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;