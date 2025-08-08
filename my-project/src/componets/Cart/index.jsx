import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// Thêm các icon cần thiết cho giao diện Summary mới
import { FiChevronRight, FiHome, FiArrowLeft, FiLock, FiTag } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";

// Import các component con
import CartItem from './CartComponets/CartItem';
import EmptyCart from './CartComponets/EmptyCart';
import EditItemModal from './CartComponets/EditItemModal';

// Dữ liệu giả lập ban đầu (giữ nguyên)
const initialCartItems = [
    { id: 1, name: 'Cyber-Optic Visor', image: '/product/720x840.png', price: 2750000, quantity: 1, attributes: { size: 'M', color: 'Black' } },
    { id: 2, name: 'Zero-G Sneaker Boots', image: '/product/720x840.png', price: 7300000, quantity: 2, attributes: { size: 'L', color: 'White' } },
    { id: 3, name: 'Chrono-Weave Jacket', image: '/product/720x840.png', price: 11200000, quantity: 1, attributes: { size: 'XL', color: 'Blue' } },
];

// Hàm định dạng tiền tệ (giữ nguyên)
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CartPage = () => {
    // === STATE MANAGEMENT (Giữ nguyên) ===
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [editingItem, setEditingItem] = useState(null);

    // === LOGIC HANDLERS (Giữ nguyên) ===
    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(id);
        } else {
            setCartItems(cartItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleEditSave = (id, newAttributes) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, attributes: newAttributes } : item
        ));
    };

    // === COMPUTED VALUES (Giữ nguyên) ===
    const { totalItems, subtotal, total, shipping } = useMemo(() => {
        const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const ship = sub > 0 ? 30000 : 0;
        return {
            totalItems: itemsCount,
            subtotal: sub,
            shipping: ship, // Đảm bảo biến shipping được trả về
            total: sub + ship
        };
    }, [cartItems]);

    // === RENDER LOGIC (Giữ nguyên) ===
    if (cartItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
            {/* Gradient nền trang trí (giữ nguyên) */}

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Breadcrumbs (giữ nguyên) */}
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="flex items-center hover:text-indigo-600 transition-colors">
                        <FiHome className="mr-2" /> Home
                    </Link>
                    <FiChevronRight className="mx-2" />
                    <span className="font-semibold text-gray-700">Shopping Cart</span>
                </nav>
                {/* Bố cục chính: 2 cột (giữ nguyên) */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">

                    {/* Cột Trái: Danh sách sản phẩm (giữ nguyên) */}
                    <div className="w-full lg:w-[65%] xl:w-[68%]">
                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30">
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800">Bạn có {totalItems} sản phẩm trong giỏ</h2>
                                <Link to="/product-list" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    Continue Shopping <FiArrowLeft className="ml-1 transform rotate-180" />
                                </Link>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-4">
                                {cartItems.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdate={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                        onEdit={() => setEditingItem(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ======================================================== */}
                    {/* Cột Phải: ĐÃ ĐƯỢC THAY THẾ BẰNG GIAO DIỆN MỚI */}
                    {/* ======================================================== */}
                    <div className="w-full lg:w-[35%] xl:w-[32%]">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80">
                                {/* Phần Tóm tắt giá */}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
                                    <div className="space-y-3 text-gray-700">
                                        <div className="flex justify-between"><span>Tổng tiền</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                                        <div className="flex justify-between"><span>Thuế</span><span className="font-medium">{formatCurrency(shipping)}</span></div>
                                    </div>
                                </div>
                                {/* Phần Mã khuyến mãi */}

                                {/* Phần Tổng cộng và Thanh toán */}
                                <div className="p-6 border-t border-gray-200">
                                    <div className="flex justify-between items-baseline text-gray-900 mb-4">
                                        <span className="text-lg font-bold">Của bạn hết:</span>
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

            {/* Modal chỉnh sửa item (giữ nguyên) */}
            {editingItem && (
                <EditItemModal
                    item={editingItem}
                    onSave={handleEditSave}
                    onClose={() => setEditingItem(null)}
                />
            )}
        </div>
    );
};

export default CartPage;