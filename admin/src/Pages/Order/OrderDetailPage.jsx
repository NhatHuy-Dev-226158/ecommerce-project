import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, Select, FormControl, InputLabel, Paper, CircularProgress, TextField, Divider } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchDataFromApi, updateData } from '../../utils/api';

// --- Icon Imports ---
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiPrinter, FiShoppingCart, FiList, FiTruck, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

//================================================================================
// SUB-COMPONENTS (Thành phần giao diện con)
//================================================================================

// Component con để tạo section nhất quán cho các phần của trang
const FormSection = ({ title, children, icon }) => (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-gray-500">{icon}</div>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </div>
        <div className="space-y-4">{children}</div>
    </Paper>
);

// Component con để hiển thị tag trạng thái với màu sắc tương ứng
const StatusTag = ({ status }) => {
    // useMemo để tránh tính toán lại object mapping mỗi lần render
    const statusMapping = useMemo(() => ({
        'Pending': { color: 'bg-orange-100 text-orange-800' },
        'Processing': { color: 'bg-blue-100 text-blue-700' },
        'Shipped': { color: 'bg-purple-100 text-purple-800' },
        'Delivered': { color: 'bg-green-100 text-green-700' },
        'Cancelled': { color: 'bg-red-100 text-red-800' }
    }), []);
    const statusInfo = statusMapping[status] || { color: 'bg-gray-100 text-gray-700' };
    return (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>{status}</span>);
};

//================================================================================
// MAIN ORDER DETAIL PAGE COMPONENT
//================================================================================

/**
 * @component OrderDetailPage
 * @description Trang hiển thị chi tiết một đơn hàng và cho phép quản trị viên cập nhật trạng thái.
 */
const OrderDetailPage = () => {
    // --- Hooks & State ---
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(''); // State riêng cho dropdown để cập nhật

    // --- Logic & Effects ---

    // Hàm tải chi tiết đơn hàng, dùng useCallback để tối ưu
    const fetchOrderDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchDataFromApi(`/api/admin/orders/${orderId}`);
            if (response.success) {
                setOrder(response.data);
                setCurrentStatus(response.data.status); // Cập nhật trạng thái cho dropdown
            } else {
                throw new Error(response.message || 'Không thể tải chi tiết đơn hàng');
            }
        } catch (err) {
            setError(err.message);
            toast.error(`Lỗi: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    // Tải dữ liệu khi component được mount hoặc orderId thay đổi
    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    // Xử lý lưu thay đổi trạng thái
    const handleSaveChanges = async () => {
        if (currentStatus === order.status) {
            toast.error('Trạng thái chưa thay đổi.');
            return;
        }
        try {
            const response = await updateData(`/api/admin/orders/${order._id}/status`, { status: currentStatus });
            if (response.success) {
                toast.success('Cập nhật trạng thái đơn hàng thành công!');
                setOrder(response.data); // Cập nhật lại dữ liệu đơn hàng mới
                navigate("/orders");
            } else {
                throw new Error(response.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            toast.error(`Lỗi: ${err.message}`);
        }
    };

    // --- Conditional Rendering ---
    // Xử lý các trạng thái loading, error trước khi render nội dung chính

    if (isLoading) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    if (error) return (
        <div className="text-center p-10 text-red-600">
            <FiAlertCircle className="mx-auto text-5xl mb-3" />
            <Typography variant="h6">Đã xảy ra lỗi</Typography>
            <Typography>{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/admin/orders')}>Quay lại danh sách</Button>
        </div>
    );
    if (!order) return null; // Tránh lỗi nếu không có dữ liệu đơn hàng

    // --- Main Render ---
    return (
        <section className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header của trang */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Chi tiết Đơn hàng #{order._id.slice(-6).toUpperCase()}</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        <Link to='/admin/dashboard' className="text-sm hover:underline">Dashboard</Link>
                        <Link to='/admin/orders' className="text-sm hover:underline">Các Đơn Hàng</Link>
                        <Typography className="text-sm font-semibold">#{order._id.slice(-6).toUpperCase()}</Typography>
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outlined" color="secondary" startIcon={<FiPrinter />} sx={{ textTransform: 'none', borderRadius: '8px' }}>In hóa đơn</Button>
                    <Button variant="contained" sx={{ textTransform: 'none', borderRadius: '8px' }} onClick={handleSaveChanges}>Lưu thay đổi</Button>
                </div>
            </div>

            {/* Layout chính của trang */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Cột trái: Chi tiết sản phẩm và Lịch sử */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    <FormSection title="Chi tiết sản phẩm & Tổng kết" icon={<FiShoppingCart />}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-gray-500"><tr><th className="p-2">Sản phẩm</th><th className="p-2">Số lượng</th><th className="p-2 text-right">Đơn giá</th><th className="p-2 text-right">Thành tiền</th></tr></thead>
                                <tbody>
                                    {order.orderItems.map(p => (
                                        <tr key={p._id} className="border-t">
                                            <td className="p-2"><div className="flex items-center gap-3"><img src={p.image} alt={p.name} className="w-12 h-12 rounded-md object-cover" /><div><p className="font-semibold">{p.name}</p></div></div></td>
                                            <td className="p-2 font-medium">x {p.quantity}</td>
                                            <td className="p-2 text-right">{p.price.toLocaleString('vi-VN')} đ</td>
                                            <td className="p-2 text-right font-semibold">{(p.price * p.quantity).toLocaleString('vi-VN')} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Divider />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Tổng tiền hàng:</span><span>{order.itemsPrice.toLocaleString('vi-VN')} đ</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển:</span><span>{order.shippingPrice.toLocaleString('vi-VN')} đ</span></div>
                            <Divider />
                            <div className="flex justify-between font-bold text-lg"><span >Tổng cộng:</span><span>{order.totalPrice.toLocaleString('vi-VN')} đ</span></div>
                        </div>
                    </FormSection>
                    <FormSection title="Lịch sử & Ghi chú nội bộ" icon={<FiFileText />}>
                        <TextField fullWidth label="Thêm ghi chú nội bộ..." variant="outlined" multiline rows={3} />
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Thêm ghi chú</Button>
                    </FormSection>
                </div>

                {/* Cột phải: Thông tin chung và Khách hàng */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <FormSection title="Thông tin chung" icon={<FiList />}>
                        <div className="flex justify-between items-center"><Typography variant="body2">Trạng thái hiện tại:</Typography><StatusTag status={order.status} /></div>
                        <FormControl fullWidth>
                            <InputLabel>Cập nhật trạng thái</InputLabel>
                            <Select label="Cập nhật trạng thái" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
                                <MenuItem value="Pending">Chờ xác nhận</MenuItem>
                                <MenuItem value="Processing">Đang xử lý</MenuItem>
                                <MenuItem value="Shipped">Đang giao hàng</MenuItem>
                                <MenuItem value="Delivered">Đã giao</MenuItem>
                                <MenuItem value="Cancelled">Đã hủy</MenuItem>
                            </Select>
                        </FormControl>
                        <Divider />
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2"><FiCreditCard className="text-gray-500" /><Typography color="text.secondary">Thanh toán:</Typography><Typography fontWeight="medium">{order.paymentMethod}</Typography></div>
                            <div className="flex items-center gap-2"><FiTruck className="text-gray-500" /><Typography color="text.secondary">Lớp VC:</Typography><Typography fontWeight="medium">{order.shippingClass}</Typography></div>
                        </div>
                    </FormSection>
                    <FormSection title="Thông tin khách hàng" icon={<FiUser />}>
                        <p className="flex items-center gap-2"><FiUser className="text-gray-500" /><strong>{order.shippingAddress.fullName}</strong></p>
                        <p className="flex items-center gap-2"><FiPhone className="text-gray-500" />{order.shippingAddress.phone}</p>
                        {order.userId?.email && <p className="flex items-center gap-2"><FiMail className="text-gray-500" />{order.userId.email}</p>}
                        <Divider />
                        <p className="flex items-start gap-2"><FiMapPin className="text-gray-500 mt-1" /><span>{`${order.shippingAddress.address}, ${order.shippingAddress.city}`}</span></p>
                    </FormSection>
                </div>
            </div>
        </section>
    );
};

export default OrderDetailPage;