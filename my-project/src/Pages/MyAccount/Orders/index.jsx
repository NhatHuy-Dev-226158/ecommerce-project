import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { FiSearch, FiTruck, FiStar, FiRepeat, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { fetchDataFromApi } from '../../../utils/api';
import { MyContext } from '../../../App';


// --- CÁC COMPONENT CON ---
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const StatusBadge = ({ status }) => {
    const statusMapping = {
        'Pending': { text: 'Chờ xác nhận', style: 'bg-orange-100 text-orange-800' },
        'Processing': { text: 'Đang xử lý', style: 'bg-blue-100 text-blue-800' },
        'Shipped': { text: 'Đang vận chuyển', style: 'bg-yellow-100 text-yellow-800' },
        'Delivered': { text: 'Đã giao', style: 'bg-green-100 text-green-800' },
        'Cancelled': { text: 'Đã hủy', style: 'bg-red-100 text-red-800' },
    };
    const currentStatus = statusMapping[status] || { text: status, style: 'bg-gray-100 text-gray-800' };
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${currentStatus.style}`}>
            {currentStatus.text}
        </span>
    );
};

const OrderCard = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 mb-1">
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 gap-2">
            <div>
                <p className="font-bold text-lg text-gray-800">Mã đơn: #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <StatusBadge status={order.status} />
        </div>
        <div className="p-4">
            {order.orderItems.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                    <p className="font-medium text-gray-700">{item.name}</p>
                </div>
            ))}
            {order.orderItems.length > 2 && (
                <p className="text-sm text-gray-500 ml-18">+ {order.orderItems.length - 2} sản phẩm khác</p>
            )}
        </div>
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-b-xl gap-3">
            <div>
                <span className="text-gray-600">Tổng cộng:</span>
                <span className="font-bold text-lg text-indigo-600 ml-2">{formatCurrency(order.totalPrice)}</span>
            </div>
            <div className="flex gap-2">
                {order.status === 'Shipped' && <Button variant="outlined" size="small" startIcon={<FiTruck />}>Theo dõi</Button>}
                {order.status === 'Delivered' && (
                    <>
                        <Button variant="outlined" size="small" startIcon={<FiStar />}>Đánh giá</Button>
                        <Button variant="contained" size="small" startIcon={<FiRepeat />}>Mua lại</Button>
                    </>
                )}
            </div>
        </div>
    </div>
);

// --- COMPONENT CHÍNH ---
const OrdersContent = () => {
    const { openAlerBox } = useContext(MyContext);
    const [allOrders, setAllOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeStatus, setActiveStatus] = useState('Tất cả');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await fetchDataFromApi('/api/orders/');
                if (result.success) {
                    setAllOrders(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                setError(err.message || "Không thể tải đơn hàng.");
                openAlerBox("error", err.message || "Không thể tải đơn hàng.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [openAlerBox]);

    // Sử dụng 'Tất cả' và các giá trị enum từ model
    const statuses = ['Tất cả', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const statusTranslations = {
        'Tất cả': 'Tất cả', 'Pending': 'Chờ xác nhận', 'Processing': 'Đang xử lý',
        'Shipped': 'Đang vận chuyển', 'Delivered': 'Đã giao', 'Cancelled': 'Đã hủy'
    };

    const statusCounts = useMemo(() => {
        const counts = {};
        statuses.forEach(status => {
            if (status === 'Tất cả') {
                counts[status] = allOrders.length;
            } else {
                counts[status] = allOrders.filter(o => o.status === status).length;
            }
        });
        return counts;
    }, [allOrders]);

    const filteredOrders = useMemo(() => {
        return allOrders
            .filter(order => activeStatus === 'Tất cả' || order.status === activeStatus)
            .filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderItems.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [activeStatus, searchTerm, allOrders]);

    // --- RENDER ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-red-300 bg-red-50 rounded-xl">
                <FiAlertCircle className="mx-auto text-5xl text-red-400 mb-4" />
                <h3 className="font-bold text-xl text-red-800">Đã có lỗi xảy ra</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
                <p className="text-gray-500 mt-1">Theo dõi, quản lý và xem lại tất cả các đơn hàng của bạn.</p>
            </div>

            <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {statuses.map(status => (
                        <button key={status} onClick={() => setActiveStatus(status)}
                            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeStatus === status ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {statusTranslations[status]} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeStatus === status ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>{statusCounts[status]}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <Link key={order._id} to={`/my-account/orders/${order._id}`}>
                            <OrderCard order={order} />
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                        <FiPackage className="mx-auto text-5xl text-gray-400 mb-4" />
                        <h3 className="font-bold text-xl">Không tìm thấy đơn hàng</h3>
                        <p className="text-gray-500">{activeStatus === 'Tất cả' && searchTerm === '' ? 'Bạn chưa có đơn hàng nào.' : 'Chưa có đơn hàng nào phù hợp với bộ lọc của bạn.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersContent;