import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { FiHome, FiChevronRight, FiArrowLeft, FiMapPin, FiCreditCard, FiUser, FiPhone, FiPackage } from 'react-icons/fi';
import { MyContext } from '../../../App';
import { fetchDataFromApi } from '../../../utils/api';


// --- CÁC COMPONENT & HÀM TIỆN ÍCH ---
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const StatusBadge = ({ status }) => {
    // ... (Có thể copy component này từ OrdersContent.js)
    const statusMapping = {
        'Pending': { text: 'Chờ xác nhận', style: 'bg-orange-100 text-orange-800' },
        'Processing': { text: 'Đang xử lý', style: 'bg-blue-100 text-blue-800' },
        'Shipped': { text: 'Đang vận chuyển', style: 'bg-yellow-100 text-yellow-800' },
        'Delivered': { text: 'Đã giao', style: 'bg-green-100 text-green-800' },
        'Cancelled': { text: 'Đã hủy', style: 'bg-red-100 text-red-800' },
    };
    const currentStatus = statusMapping[status] || { text: status, style: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${currentStatus.style}`}>{currentStatus.text}</span>;
};

const InfoCard = ({ icon, title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            {icon}
            <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <div className="p-4 text-gray-600 space-y-1 text-sm">{children}</div>
    </div>
);


// --- COMPONENT CHÍNH ---
const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { openAlerBox } = useContext(MyContext);
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                setIsLoading(true);
                const result = await fetchDataFromApi(`/api/orders/${orderId}`);
                if (result.success) {
                    setOrder(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                openAlerBox("error", err.message || "Không thể tải chi tiết đơn hàng.");
                setOrder(null); // Clear previous data on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, openAlerBox]);

    if (isLoading) {
        return <div className="min-h-[60vh] flex justify-center items-center"><CircularProgress /></div>;
    }

    if (!order) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center text-center p-4">
                <FiPackage className="text-7xl text-gray-300 mb-5" />
                <h2 className="text-xl font-bold text-gray-800">Không tìm thấy đơn hàng</h2>
                <p className="text-gray-500">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <Link to="/my-account?tab=orders" className="mt-4 text-indigo-600 font-medium hover:underline">
                    Quay lại danh sách đơn hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 font-sans">
            <div className="container mx-auto max-w-5xl">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="flex items-center hover:text-indigo-600"><FiHome className="mr-2" /> Trang chủ</Link>
                    <FiChevronRight className="mx-2" />
                    <Link to="/my-account?tab=orders" className="hover:text-indigo-600">Đơn hàng của tôi</Link>
                    <FiChevronRight className="mx-2" />
                    <span className="font-semibold text-gray-700">Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</span>
                </nav>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</h1>
                        <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={order.status} />
                        <Link to="/my-account?tab=orders" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            <FiArrowLeft className="mr-1" /> Quay lại
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cột Trái: Danh sách sản phẩm */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-bold text-gray-800">Các sản phẩm đã đặt</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {order.orderItems.map(item => (
                                    <div key={item.productId} className="flex items-center gap-4 p-4">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover border" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-indigo-600">{formatCurrency(item.price * item.quantity)}</p>
                                            <p className="text-xs text-gray-500">({formatCurrency(item.price)} mỗi sản phẩm)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: Thông tin & Tổng kết */}
                    <div className="space-y-6">
                        <InfoCard icon={<FiMapPin className="text-indigo-500" />} title="Địa chỉ giao hàng">
                            <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            <p>{order.shippingAddress.country}</p>
                        </InfoCard>

                        <InfoCard icon={<FiCreditCard className="text-green-500" />} title="Thông tin thanh toán">
                            <p><strong>Phương thức:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</p>
                            <div className="mt-4 pt-4 border-t border-dashed">
                                <div className="flex justify-between"><span>Tạm tính:</span><span className="font-medium">{formatCurrency(order.itemsPrice)}</span></div>
                                <div className="flex justify-between"><span>Phí vận chuyển:</span><span className="font-medium">{formatCurrency(order.shippingPrice)}</span></div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 mt-2"><span>Tổng cộng:</span><span className="text-indigo-600">{formatCurrency(order.totalPrice)}</span></div>
                            </div>
                        </InfoCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;