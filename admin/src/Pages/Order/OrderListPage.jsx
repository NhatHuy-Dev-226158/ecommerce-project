import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, Checkbox, TextField, Select, FormControl, InputLabel, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Tooltip, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { FiSearch, FiX, FiUser, FiMapPin, FiPhone, FiAlertCircle, FiPackage } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import toast from 'react-hot-toast';

// Import các hàm gọi API từ file utils của bạn
import { fetchDataFromApi, updateData } from '../../utils/api';

// --- CÁC COMPONENT GIAO DIỆN CON ---

const StatusTag = ({ status }) => {
    const statusMapping = useMemo(() => ({
        'Pending': { text: 'Chờ xác nhận', color: 'bg-orange-100 text-orange-800' },
        'Processing': { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
        'Shipped': { text: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
        'Delivered': { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
        'Cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    }), []);
    const statusInfo = statusMapping[status] || { text: 'Không xác định', color: 'bg-gray-100 text-gray-700' };
    return (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>);
};

const PageHeader = () => (
    <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
            <Typography variant="h5" component="h1" fontWeight="bold">Danh sách Đơn hàng</Typography>
            <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                <Link to='/admin/dashboard' className="text-sm hover:underline">Dashboard</Link>
                <Typography className="text-sm font-semibold">Các Đơn Hàng</Typography>
            </Breadcrumbs>
        </div>
    </div>
);

const OrderToolbar = ({ filters, onFilterChange }) => (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
        <TextField
            name="searchQuery"
            value={filters.searchQuery}
            onChange={onFilterChange}
            size="small"
            placeholder="Tìm theo Tên KH, SĐT..."
            className="flex-grow min-w-[300px]"
            InputProps={{ startAdornment: (<FiSearch className="text-gray-400 mr-2" />) }}
        />
        <div className="flex items-center gap-3 flex-wrap">
            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select name="status" value={filters.status} label="Trạng thái" onChange={onFilterChange}>
                    <MenuItem value="all">Tất cả trạng thái</MenuItem>
                    <MenuItem value="Pending">Chờ xác nhận</MenuItem>
                    <MenuItem value="Processing">Đang xử lý</MenuItem>
                    <MenuItem value="Shipped">Đang giao hàng</MenuItem>
                    <MenuItem value="Delivered">Đã giao</MenuItem>
                    <MenuItem value="Cancelled">Đã hủy</MenuItem>
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Lớp vận chuyển</InputLabel>
                <Select name="shippingClass" value={filters.shippingClass} label="Lớp vận chuyển" onChange={onFilterChange}>
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="Hàng tiêu chuẩn">Hàng tiêu chuẩn</MenuItem>
                    <MenuItem value="Hàng đông lạnh">Hàng đông lạnh</MenuItem>
                    <MenuItem value="Hàng dễ vỡ">Hàng dễ vỡ</MenuItem>
                </Select>
            </FormControl>
        </div>
    </div>
);

const QuickViewDialog = ({ open, onClose, order, onStatusUpdate }) => {
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        if (order) setNewStatus(order.status);
    }, [order]);

    if (!order) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle><div className="flex justify-between items-center">
                <Typography variant="h6" fontWeight="bold">Đơn hàng: #{order._id.slice(-6).toUpperCase()}</Typography>
                <IconButton onClick={onClose}><FiX /></IconButton>
            </div></DialogTitle>
            <DialogContent dividers className="space-y-4">
                <div>
                    <Typography variant="button" color="text.secondary">Thông tin khách hàng</Typography>
                    <div className="mt-2 space-y-1 text-sm">
                        <p className="flex items-center gap-2"><FiUser /><strong>{order.shippingAddress.fullName}</strong></p>
                        <p className="flex items-center gap-2"><FiPhone />{order.shippingAddress.phone}</p>
                        <p className="flex items-center gap-2"><FiMapPin />{`${order.shippingAddress.address}, ${order.shippingAddress.city}`}</p>
                    </div>
                </div>
                <Divider />
                <div>
                    <Typography variant="button" color="text.secondary">Trạng thái đơn hàng</Typography>
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                        <InputLabel>Cập nhật trạng thái</InputLabel>
                        <Select label="Cập nhật trạng thái" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <MenuItem value="Pending">Chờ xác nhận</MenuItem>
                            <MenuItem value="Processing">Đang xử lý</MenuItem>
                            <MenuItem value="Shipped">Đang giao hàng</MenuItem>
                            <MenuItem value="Delivered">Đã giao</MenuItem>
                            <MenuItem value="Cancelled">Đã hủy</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={() => onStatusUpdate(order._id, newStatus)}>Lưu thay đổi</Button>
            </DialogActions>
        </Dialog>
    );
};

// === COMPONENT TRANG CHÍNH ===
const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quickViewOrder, setQuickViewOrder] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'all',
        shippingClass: 'all'
    });

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: pagination.currentPage });
            if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.shippingClass !== 'all') params.append('shippingClass', filters.shippingClass);

            const response = await fetchDataFromApi(`/api/admin/orders?${params.toString()}`);

            if (response.success) {
                setOrders(response.data);
                setPagination(prev => ({ ...prev, totalPages: response.totalPages }));
            } else {
                throw new Error(response.message || 'Lỗi không xác định');
            }
        } catch (err) {
            setError(err.message);
            toast.error(`Lỗi khi tải đơn hàng: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.currentPage, filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (event, value) => {
        setPagination(prev => ({ ...prev, currentPage: value }));
    };

    const handleOpenQuickView = useCallback(async (orderId) => {
        try {
            const response = await fetchDataFromApi(`/api/admin/orders/${orderId}`);
            if (response.success) {
                setQuickViewOrder(response.data);
                setIsQuickViewOpen(true);
            }
        } catch (err) {
            toast.error(`Không thể lấy chi tiết đơn hàng: ${err.message}`);
        }
    }, []);

    const handleUpdateStatus = useCallback(async (orderId, newStatus) => {
        try {
            const response = await updateData(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            if (response.success) {
                toast.success("Cập nhật trạng thái thành công!");
                setOrders(prevOrders => prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                setIsQuickViewOpen(false);
            } else {
                throw new Error(response.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            toast.error(`Cập nhật thất bại: ${err.message}`);
        }
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center py-20"><CircularProgress /></div>;
        }
        if (error) {
            return <div className="text-center py-20 text-red-600"><FiAlertCircle className="mx-auto text-5xl mb-3" /><p>Đã xảy ra lỗi: {error}</p></div>;
        }
        if (orders.length === 0) {
            return <div className="text-center py-20 text-gray-500"><FiPackage className="mx-auto text-5xl mb-3" /><p>Không tìm thấy đơn hàng nào phù hợp.</p></div>;
        }
        return (
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="p-4"><Checkbox size="small" /></th>
                        <th className="p-4">Mã đơn hàng</th>
                        <th className="p-4">Khách hàng</th>
                        <th className="p-4">Ngày đặt</th>
                        <th className="p-4">Vận chuyển</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4 text-right">Tổng tiền</th>
                        <th className="p-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                            <td className="p-4"><Checkbox size="small" /></td>
                            <td className="p-4 font-semibold text-blue-600">#{order._id.slice(-6).toUpperCase()}</td>
                            <td className="p-4">
                                <div className="font-medium text-gray-800">{order.shippingAddress.fullName}</div>
                                <div className="text-gray-500">{order.shippingAddress.phone}</div>
                            </td>
                            <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                            <td className="p-4 text-gray-600 font-medium">{order.shippingClass}</td>
                            <td className="p-4"><StatusTag status={order.status} /></td>
                            <td className="p-4 font-semibold text-gray-800 text-right">{order.totalPrice.toLocaleString('vi-VN')} đ</td>
                            <td className="p-4 text-center flex items-center justify-center gap-1">
                                <Tooltip title="Xem nhanh"><Button size="small" onClick={() => handleOpenQuickView(order._id)}>Xem nhanh</Button></Tooltip>
                                <Tooltip title="Xem trang chi tiết"><Link to={`/admin/orders/${order._id}`}><Button variant="outlined" size="small">Chi tiết</Button></Link></Tooltip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <section className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <PageHeader />
            <OrderToolbar filters={filters} onFilterChange={handleFilterChange} />
            <div className="bg-white rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    {renderContent()}
                </div>
                {pagination.totalPages > 1 && !isLoading && (
                    <div className="flex justify-center p-4 border-t">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                )}
            </div>
            {quickViewOrder && (
                <QuickViewDialog
                    open={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                    order={quickViewOrder}
                    onStatusUpdate={handleUpdateStatus}
                />
            )}
        </section>
    );
};

export default OrderListPage;