import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Typography, TableRow, TableCell, Button, Breadcrumbs, MenuItem, Checkbox, TextField, Select, FormControl, InputLabel, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Tooltip, Pagination, Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { alpha } from '@mui/material/styles';
import { fetchDataFromApi, updateData, deleteData, postData } from '../../utils/api';

// --- Icon Imports ---
import { FiSearch, FiX, FiUser, FiMapPin, FiPhone, FiAlertCircle, FiPackage, FiTrash2, FiEdit } from 'react-icons/fi';
import { FaRegEye } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';

// ====================================================================
// ===                      SUB-COMPONENTS                          ===
// ====================================================================

/**
 * Component con hiển thị tag trạng thái với màu sắc tương ứng.
 */
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

/**
 * Component con cho phần header của trang.
 */
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

/**
 * Component con cho thanh công cụ tìm kiếm và lọc.
 */
const OrderToolbar = ({ filters, onFilterChange }) => (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
        <TextField name="searchQuery" value={filters.searchQuery} onChange={onFilterChange} size="small" placeholder="Tìm theo Tên KH, SĐT..." className="flex-grow min-w-[300px]" InputProps={{ startAdornment: (<FiSearch className="text-gray-400 mr-2" />) }} />
        <div className="flex items-center gap-3 flex-wrap">
            <FormControl size="small" sx={{ minWidth: 160 }}><InputLabel>Trạng thái</InputLabel><Select name="status" value={filters.status} label="Trạng thái" onChange={onFilterChange}><MenuItem value="all">Tất cả trạng thái</MenuItem><MenuItem value="Pending">Chờ xác nhận</MenuItem><MenuItem value="Processing">Đang xử lý</MenuItem><MenuItem value="Shipped">Đang giao hàng</MenuItem><MenuItem value="Delivered">Đã giao</MenuItem><MenuItem value="Cancelled">Đã hủy</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Lớp vận chuyển</InputLabel><Select name="shippingClass" value={filters.shippingClass} label="Lớp vận chuyển" onChange={onFilterChange}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="Hàng tiêu chuẩn">Hàng tiêu chuẩn</MenuItem><MenuItem value="Hàng đông lạnh">Hàng đông lạnh</MenuItem><MenuItem value="Hàng dễ vỡ">Hàng dễ vỡ</MenuItem></Select></FormControl>
        </div>
    </div>
);

/**
 * Component con cho thanh công cụ hiển thị khi có item được chọn, dùng để xóa hàng loạt.
 */
const EnhancedTableToolbar = ({ numSelected, onBulkDelete }) => (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }) }}>
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">{numSelected} đã chọn</Typography>
        <Tooltip title="Xóa các mục đã chọn"><IconButton onClick={onBulkDelete} color="error"><FiTrash2 /></IconButton></Tooltip>
    </Toolbar>
);

/**
 * Component con cho Dialog "Xem nhanh" chi tiết đơn hàng.
 */
const QuickViewDialog = ({ open, onClose, order, onStatusUpdate }) => {
    const [newStatus, setNewStatus] = useState('');
    useEffect(() => { if (order) setNewStatus(order.status); }, [order]);
    if (!order) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle><div className="flex justify-between items-center"><Typography variant="h6" fontWeight="bold">Đơn hàng: #{order._id.slice(-6).toUpperCase()}</Typography><IconButton onClick={onClose}><FiX /></IconButton></div></DialogTitle>
            <DialogContent dividers className="space-y-4">
                <div><Typography variant="button" color="text.secondary">Thông tin khách hàng</Typography><div className="mt-2 space-y-1 text-sm"><p className="flex items-center gap-2"><FiUser /><strong>{order.shippingAddress.fullName}</strong></p><p className="flex items-center gap-2"><FiPhone />{order.shippingAddress.phone}</p><p className="flex items-center gap-2"><FiMapPin />{`${order.shippingAddress.address}, ${order.shippingAddress.city}`}</p></div></div>
                <Divider />
                <div><Typography variant="button" color="text.secondary">Trạng thái đơn hàng</Typography><FormControl fullWidth size="small" sx={{ mt: 2 }}><InputLabel>Cập nhật trạng thái</InputLabel><Select label="Cập nhật trạng thái" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}><MenuItem value="Pending">Chờ xác nhận</MenuItem><MenuItem value="Processing">Đang xử lý</MenuItem><MenuItem value="Shipped">Đang giao hàng</MenuItem><MenuItem value="Delivered">Đã giao</MenuItem><MenuItem value="Cancelled">Đã hủy</MenuItem></Select></FormControl></div>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Hủy</Button><Button variant="contained" onClick={() => onStatusUpdate(order._id, newStatus)}>Lưu thay đổi</Button></DialogActions>
        </Dialog>
    );
};

// ====================================================================
// ===                    MAIN COMPONENT                            ===
// ====================================================================
const OrderListPage = () => {
    // --- State Management ---
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quickViewOrder, setQuickViewOrder] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ searchQuery: '', status: 'all', shippingClass: 'all' });
    const [selected, setSelected] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState([]);
    const navigate = useNavigate()

    // --- Logic & Effects ---
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
            } else { throw new Error(response.message); }
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    }, [pagination.currentPage, filters]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // --- Event Handlers ---
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (event, value) => setPagination(prev => ({ ...prev, currentPage: value }));

    // Mở dialog xem nhanh và tải dữ liệu chi tiết
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

    // Cập nhật trạng thái từ dialog xem nhanh
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


    // === CÁC HÀM MỚI CHO VIỆC CHỌN VÀ XÓA ===
    const handleSelectAllClick = (event) => setSelected(event.target.checked ? orders.map((n) => n._id) : []);
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else newSelected = selected.filter(selId => selId !== id);
        setSelected(newSelected);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleDeleteClick = (id) => { setIdsToDelete([id]); setIsConfirmOpen(true); };
    const handleBulkDeleteClick = () => { setIdsToDelete(selected); setIsConfirmOpen(true); };
    const handleCloseConfirm = () => { setIsConfirmOpen(false); setIdsToDelete([]); };
    const handleConfirmDelete = async () => {
        if (!idsToDelete || idsToDelete.length === 0) return;
        try {
            const result = idsToDelete.length === 1
                ? await deleteData(`/api/admin/orders/${idsToDelete[0]}`)
                : await postData('/api/admin/orders/delete-multiple', { ids: idsToDelete });
            if (result.success) {
                toast.success(result.message || "Xóa thành công!");
                fetchOrders();
                setSelected([]);
            } else { throw new Error(result.message); }
        } catch (err) { toast.error(`Lỗi khi xóa: ${err.message}`); }
        finally { handleCloseConfirm(); }
    };

    // --- Render ---
    const renderTableContent = () => {
        if (isLoading) return <TableRow><TableCell colSpan={8} align="center" sx={{ p: 10 }}><CircularProgress /></TableCell></TableRow>;
        if (error) return <TableRow><TableCell colSpan={8} align="center" sx={{ p: 10, color: 'red' }}><FiAlertCircle /><div>Đã xảy ra lỗi: {error}</div></TableCell></TableRow>;
        if (orders.length === 0) return <TableRow><TableCell colSpan={8} align="center" sx={{ p: 10 }}><FiPackage /><div>Không tìm thấy đơn hàng.</div></TableCell></TableRow>;

        return orders.map((order) => {
            const isItemSelected = isSelected(order._id);
            return (
                <TableRow key={order._id} hover onClick={(event) => handleClick(event, order._id)} role="checkbox" tabIndex={-1} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox"><Checkbox color="primary" checked={isItemSelected} /></TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>#{order._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="medium">{order.shippingAddress.fullName}</Typography>
                        <Typography variant="caption" color="text.secondary">{order.shippingAddress.phone}</Typography>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell>{order.shippingClass}</TableCell>
                    <TableCell><StatusTag status={order.status} /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{order.totalPrice.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell align="center">
                        <Tooltip title="Xem nhanh"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenQuickView(order._id); }}><FaRegEye /></IconButton></Tooltip>
                        <IconButton size="small" onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click của cả hàng
                            navigate(`/admin/orders/${order._id}`); // Điều hướng đến trang chi tiết
                        }}>
                            <FiEdit />
                        </IconButton><Tooltip title="Xóa đơn hàng"><IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(order._id); }}><FiTrash2 /></IconButton></Tooltip>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <section className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <PageHeader />
            <OrderToolbar filters={filters} onFilterChange={handleFilterChange} />
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {selected.length > 0 && <EnhancedTableToolbar numSelected={selected.length} onBulkDelete={handleBulkDeleteClick} />}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="p-4"><Checkbox indeterminate={selected.length > 0 && selected.length < orders.length} checked={orders.length > 0 && selected.length === orders.length} onChange={handleSelectAllClick} /></th>
                                <th className="p-4">Mã Đơn</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Ngày đặt</th>
                                <th className="p-4">Vận chuyển</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-right">Tổng tiền</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>{renderTableContent()}</tbody>
                    </table>
                </div>
                <Pagination count={pagination.totalPages} page={pagination.currentPage} onChange={handlePageChange} sx={{ p: 2, display: 'flex', justifyContent: 'center' }} />
            </div>
            {quickViewOrder && <QuickViewDialog open={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} order={quickViewOrder} onStatusUpdate={handleUpdateStatus} />}
            <ConfirmationDialog open={isConfirmOpen} onClose={handleCloseConfirm} onConfirm={handleConfirmDelete} title="Xác nhận xóa" message={`Bạn có chắc chắn muốn xóa ${idsToDelete.length} đơn hàng đã chọn? Hành động này không thể hoàn tác.`} />
        </section>
    );
};

export default OrderListPage;