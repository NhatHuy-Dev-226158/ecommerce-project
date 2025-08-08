import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from '@mui/material';
import { FiSearch, FiTruck, FiCheckCircle, FiXCircle, FiDollarSign, FiStar, FiRepeat, FiPackage } from 'react-icons/fi';

// --- DỮ LIỆU TĨNH ĐỂ RENDER GIAO DIỆN ---
const allOrders = [
    {
        id: '#AURA1234', date: '28/05/2024', status: 'Đang xử lý', total: 8550000,
        products: [
            { name: 'Khăn lụa Aura', image: '/product/720x840.png' },
            { name: 'Đồng hồ da Helios', image: '/product/720x840.png' },
        ]
    },
    {
        id: '#AURA5678', date: '25/05/2024', status: 'Đang vận chuyển', total: 3450000,
        products: [{ name: 'Áo khoác Chrono-Weave', image: '/product/720x840.png' }]
    },
    {
        id: '#AURA9012', date: '20/05/2024', status: 'Đã giao', total: 1800000,
        products: [{ name: 'Giày thể thao Zero-G', image: '/product/720x840.png' }]
    },
    {
        id: '#AURA3456', date: '15/05/2024', status: 'Chờ xác nhận', total: 2100000,
        products: [
            { name: 'Túi da Lunar', image: '/product/720x840.png' },
            { name: 'Sản phẩm A', image: '/product/720x840.png' },
            { name: 'Sản phẩm B', image: '/product/720x840.png' },
            { name: 'Sản phẩm C', image: '/product/720x840.png' },
        ]
    },
    {
        id: '#AURA7890', date: '10/05/2024', status: 'Đã hủy', total: 450000,
        products: [{ name: 'Áo thun Cotton-pima', image: '/product/720x840.png' }]
    },
];

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// --- COMPONENT CON CHO TRẠNG THÁI ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
        'Chờ xác nhận': 'bg-orange-100 text-orange-800',
        'Đang xử lý': 'bg-blue-100 text-blue-800',
        'Đang vận chuyển': 'bg-yellow-100 text-yellow-800',
        'Đã giao': 'bg-green-100 text-green-800',
        'Đã hủy': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

// --- COMPONENT CON CHO CARD ĐƠN HÀNG ---
const OrderCard = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 mb-1">
        {/* Header Card */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 gap-2">
            <div>
                <p className="font-bold text-lg text-gray-800">{order.id}</p>
                <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
            </div>
            <StatusBadge status={order.status} />
        </div>
        {/* Body Card */}
        <div className="p-4">
            {order.products.slice(0, 2).map((product, index) => (
                <div key={index} className="flex items-center gap-4 mb-3">
                    <img src={product.image} alt={product.name} className="w-14 h-14 rounded-md object-cover" />
                    <p className="font-medium text-gray-700">{product.name}</p>
                </div>
            ))}
            {order.products.length > 2 && (
                <p className="text-sm text-gray-500 ml-18">+ {order.products.length - 2} sản phẩm khác</p>
            )}
        </div>
        {/* Footer Card */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-b-xl gap-3">
            <div>
                <span className="text-gray-600">Tổng cộng:</span>
                <span className="font-bold text-lg text-indigo-600 ml-2">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex gap-2">
                {order.status === 'Chờ xác nhận' && (
                    <>
                        <Link to='/checkout'>
                            <Button variant="contained" size="small" startIcon={<FiDollarSign />}>Thanh toán</Button>
                        </Link>
                        <Button variant="text" color="error" size="small">Hủy</Button>
                    </>
                )}
                {order.status === 'Đang vận chuyển' && <Button variant="outlined" size="small" startIcon={<FiTruck />}>Theo dõi</Button>}
                {order.status === 'Đã giao' && (
                    <>
                        <Button variant="outlined" size="small" startIcon={<FiStar />}>Đánh giá</Button>
                        <Button variant="contained" size="small" startIcon={<FiRepeat />}>Mua lại</Button>
                    </>
                )}
            </div>
        </div>
    </div>
);


// === COMPONENT CHÍNH CỦA TRANG QUẢN LÝ ĐƠN HÀNG ===
const OrdersContent = () => {
    // Logic cơ bản để quản lý bộ lọc và tìm kiếm
    const [activeStatus, setActiveStatus] = useState('Tất cả');
    const [searchTerm, setSearchTerm] = useState('');

    const statuses = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang vận chuyển', 'Đã giao', 'Đã hủy'];
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
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [activeStatus, searchTerm, allOrders]);


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
                <p className="text-gray-500 mt-1">Theo dõi, quản lý và xem lại tất cả các đơn hàng của bạn.</p>
            </div>

            {/* Thanh tìm kiếm */}
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

            {/* Bộ lọc trạng thái (Tabs) */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeStatus === status
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            {status} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeStatus === status ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>{statusCounts[status]}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <Link key={order.id} to={`/orders/${order.id.replace('#', '')}`}>
                            <OrderCard order={order} />
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                        <FiPackage className="mx-auto text-5xl text-gray-400 mb-4" />
                        <h3 className="font-bold text-xl">Không tìm thấy đơn hàng</h3>
                        <p className="text-gray-500">Chưa có đơn hàng nào phù hợp với bộ lọc của bạn.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersContent;