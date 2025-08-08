import React, { useState } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, Checkbox, TextField, Select, FormControl, InputLabel, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiX, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// --- DỮ LIỆU MẪU (Đã được tối ưu hóa) ---
const orderListData = [
    { id: 1, orderId: '#OD-85471', customerName: 'Trần Văn Hoàng', customerPhone: '0987654321', date: '26/07/2025, 10:30', status: 'Đang xử lý', total: 487608, shippingClass: 'Hàng đông lạnh' },
    { id: 2, orderId: '#OD-85470', customerName: 'Nguyễn Thị Thu', customerPhone: '0912345678', date: '26/07/2025, 09:15', status: 'Đã giao', total: 367185, shippingClass: 'Hàng tiêu chuẩn' },
    { id: 3, orderId: '#OD-85469', customerName: 'Phạm Đức Bình', customerPhone: '0905123456', date: '25/07/2025, 14:00', status: 'Đã hủy', total: 474632, shippingClass: 'Hàng tiêu chuẩn' },
    { id: 4, orderId: '#OD-85468', customerName: 'Lê Minh Anh', customerPhone: '0934789123', date: '25/07/2025, 11:20', status: 'Chờ xác nhận', total: 441324, shippingClass: 'Hàng dễ vỡ' },
];
// Dữ liệu chi tiết, giả lập việc fetch khi cần
const fullOrderDetails = {
    1: { id: 1, orderId: '#OD-85471', customer: { name: 'Trần Văn Hoàng', phone: '0987654321', email: 'hoang.tv@example.com' }, date: '26/07/2025, 10:30', status: 'Đang xử lý', address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh', customerNote: 'Giao hàng sau 5 giờ chiều.' },
    // ... các đơn hàng chi tiết khác
};
const statusMapping = { 'Chờ xác nhận': { text: 'Chờ xác nhận', color: 'yellow' }, 'Đang xử lý': { text: 'Đang xử lý', color: 'blue' }, 'Đang giao hàng': { text: 'Đang giao hàng', color: 'purple' }, 'Đã giao': { text: 'Đã giao', color: 'green' }, 'Đã hủy': { text: 'Đã hủy', color: 'red' } };

// --- CÁC COMPONENT GIAO DIỆN CON ---

// Thẻ trạng thái đơn hàng có màu
const StatusTag = ({ status }) => {
    const statusInfo = statusMapping[status] || { text: 'N/A', color: 'gray' };
    const colors = { yellow: 'bg-yellow-100 text-yellow-800', blue: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700', green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-gray-100 text-gray-700' };
    return (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[statusInfo.color]}`}>{statusInfo.text}</span>);
};

// Header của trang, chứa tiêu đề và breadcrumbs
const PageHeader = () => (<div className="flex flex-wrap justify-between items-center mb-6"> <div><Typography variant="h5" component="h1" fontWeight="bold">Danh sách Đơn hàng</Typography><Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}><Link to='/' className="text-sm hover:underline">Dashboard</Link><Typography className="text-sm font-semibold">Các Đơn Hàng</Typography></Breadcrumbs></div> </div>);

// Thanh công cụ chứa các bộ lọc
const OrderToolbar = () => (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-grow"><TextField size="small" placeholder="Tìm theo Mã đơn, Tên KH, SĐT..." className="flex-grow min-w-[300px]" InputProps={{ startAdornment: (<FiSearch className="text-gray-400 mr-2" />) }} /></div>
        <div className="flex items-center gap-3">
            <FormControl size="small" sx={{ minWidth: 160 }}><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" defaultValue="all">{Object.keys(statusMapping).map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}<MenuItem value="all">Tất cả trạng thái</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}><InputLabel>Thời gian</InputLabel><Select label="Thời gian" defaultValue="this_month"><MenuItem value="today">Hôm nay</MenuItem><MenuItem value="this_week">Tuần này</MenuItem><MenuItem value="this_month">Tháng này</MenuItem></Select></FormControl>
            {/* THAY ĐỔI: Thêm bộ lọc Lớp vận chuyển */}
            <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Lớp vận chuyển</InputLabel><Select label="Lớp vận chuyển" defaultValue="all"><MenuItem value="all">Tất cả</MenuItem><MenuItem value="standard">Hàng tiêu chuẩn</MenuItem><MenuItem value="frozen">Hàng đông lạnh</MenuItem><MenuItem value="fragile">Hàng dễ vỡ</MenuItem></Select></FormControl>
        </div>
    </div>
);

// Dialog xem nhanh thông tin đơn hàng
const QuickViewDialog = ({ open, onClose, order }) => {
    if (!order) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle><div className="flex justify-between items-center"><div><Typography variant="h6" fontWeight="bold">Đơn hàng: {order.orderId}</Typography><Typography variant="body2" color="text.secondary">Xem nhanh thông tin</Typography></div><IconButton onClick={onClose}><FiX /></IconButton></div></DialogTitle>
            <DialogContent dividers className="space-y-4">
                <div><Typography variant="button" color="text.secondary">Thông tin khách hàng</Typography><div className="mt-2 space-y-1 text-sm"><p className="flex items-center gap-2"><FiUser /><strong>{order.customer.name}</strong></p><p className="flex items-center gap-2"><FiPhone />{order.customer.phone}</p><p className="flex items-center gap-2"><FiMapPin />{order.address}</p></div></div>
                <Divider />
                <div><div className="flex justify-between items-center"><Typography variant="button" color="text.secondary">Trạng thái đơn hàng</Typography><StatusTag status={order.status} /></div><FormControl fullWidth size="small" sx={{ mt: 2 }}><InputLabel>Cập nhật trạng thái</InputLabel><Select label="Cập nhật trạng thái" defaultValue={order.status}>{Object.keys(statusMapping).map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}</Select></FormControl></div>
                {order.customerNote && <><Divider /><div className="text-sm"><Typography variant="button" color="text.secondary">Ghi chú của khách</Typography><p className="mt-1 p-2 bg-yellow-50 rounded-md border border-yellow-200">{order.customerNote}</p></div></>}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Hủy</Button><Button variant="contained">Lưu thay đổi</Button></DialogActions>
        </Dialog>
    );
};

// === COMPONENT TRANG CHÍNH ===
const OrderListPage = () => {
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    const handleQuickView = (orderSummary) => { const details = fullOrderDetails[orderSummary.id] || orderSummary; setSelectedOrder(details); setQuickViewOpen(true); };
    const handleCloseQuickView = () => setQuickViewOpen(false);
    const handleViewDetails = (orderId) => { navigate(`/orders/${orderId}`); };

    return (
        <section className="p-4 md:p-6 bg-gray-50">
            <PageHeader />
            <OrderToolbar />
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="p-4"><Checkbox size="small" /></th>
                                <th className="p-4">Mã đơn hàng</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Ngày đặt</th>
                                {/* THAY ĐỔI: Thêm cột Vận chuyển */}
                                <th className="p-4">Vận chuyển</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-right">Tổng tiền</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderListData.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4"><Checkbox size="small" /></td>
                                    <td className="p-4 font-semibold text-gray-800">{order.orderId}</td>
                                    <td className="p-4"><div className="font-medium text-gray-800">{order.customerName}</div><div className="text-gray-500">{order.customerPhone}</div></td>
                                    <td className="p-4 text-gray-600">{order.date}</td>
                                    {/* THAY ĐỔI: Thêm ô hiển thị Lớp vận chuyển */}
                                    <td className="p-4 text-gray-600 font-medium">{order.shippingClass}</td>
                                    <td className="p-4"><StatusTag status={order.status} /></td>
                                    <td className="p-4 font-semibold text-gray-800 text-right">{order.total.toLocaleString('vi-VN')} đ</td>
                                    <td className="p-4 text-center flex items-center justify-center gap-1">
                                        <Button variant="text" size="small" onClick={() => handleQuickView(order)} sx={{ textTransform: 'none' }}>Xem nhanh</Button>
                                        <Link to='/orders-Detail'>
                                            <Button variant="outlined" size="small" /*onClick={() => handleViewDetails(order.id)}*/ sx={{ textTransform: 'none' }}>Chi tiết</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <QuickViewDialog open={quickViewOpen} onClose={handleCloseQuickView} order={selectedOrder} />
        </section>
    );
};

export default OrderListPage;