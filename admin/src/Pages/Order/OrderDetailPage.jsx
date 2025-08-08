import React, { useState } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, Select, FormControl, InputLabel, Paper, IconButton, Divider, TextField } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiPrinter, FiShoppingCart, FiList, FiTruck, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// --- DỮ LIỆU MẪU CHI TIẾT ---
const orderDetailData = {
    id: 1, orderId: '#OD-85471', date: '26/07/2025, 10:30', status: 'Đang xử lý',
    shippingClass: 'Hàng đông lạnh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingMethod: 'Giao hàng nhanh',
    customer: { name: 'Trần Văn Hoàng', phone: '0987654321', email: 'hoang.tv@example.com', address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh' },
    customerNote: 'Giao hàng sau 5 giờ chiều. Vui lòng gọi trước khi đến.',
    products: [
        { id: 101, sku: 'TS-20KG', name: 'Tôm sú tươi', image: 'https://i.imgur.com/example.png', variant: 'Kích cỡ: Size 20 con/kg', qty: 1, price: 490000, salePrice: 487608 },
        { id: 103, sku: 'BBM-CL3MM', name: 'Thịt ba rọi bò Mỹ', image: 'https://i.imgur.com/example.png', variant: 'Độ dày: Cắt lát 3mm', qty: 2, price: 250000, salePrice: null },
        { id: 106, sku: 'BBM-CL4MM', name: 'Thịt ba rọi Heo', image: 'https://i.imgur.com/example.png', variant: 'Độ dày: Cắt lát 5mm', qty: 2, price: 250000, salePrice: null },
    ],
    summary: { subtotal: 1487608, shippingFee: 30000, discount: { code: 'FREESHIP', amount: 30000 }, tax: 0, grandTotal: 1487608 },
    history: [
        { time: '11:05, 26/07/2025', action: "Admin đã đổi trạng thái từ 'Chờ xác nhận' sang 'Đang xử lý'." },
        { time: '10:30, 26/07/2025', action: 'Đơn hàng được tạo thành công.' },
    ],
    internalNotes: [{ user: 'Admin', time: '11:06', note: 'Đã xác nhận với khách, chuẩn bị hàng đông lạnh riêng.' }]
};
const statusMapping = { 'Chờ xác nhận': 'yellow', 'Đang xử lý': 'blue', 'Đang giao hàng': 'purple', 'Đã giao': 'green', 'Đã hủy': 'red' };

// --- CÁC COMPONENT GIAO DIỆN CON ---
// Card chung cho các khối thông tin
const FormSection = ({ title, children, icon }) => (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-gray-500">{icon}</div>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </div>
        <div className="space-y-4">{children}</div>
    </Paper>
);

// Thẻ trạng thái
const StatusTag = ({ status }) => {
    const color = statusMapping[status] || 'gray';
    const colors = { yellow: 'bg-yellow-100 text-yellow-800', blue: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700', green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-gray-100 text-gray-700' };
    return (<span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[color]}`}>{status}</span>);
};

// === COMPONENT TRANG CHÍNH ===
const OrderDetailPage = () => {
    // Trong thực tế, bạn sẽ dùng useParams để lấy ID và fetch dữ liệu
    // const { orderId } = useParams();
    const [order, setOrder] = useState(orderDetailData);

    const handleStatusChange = (e) => {
        setOrder({ ...order, status: e.target.value });
    };

    return (
        <section className="bg-gray-50">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Chi tiết Đơn hàng {order.orderId}</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        <Link to='/' className="text-sm hover:underline">Dashboard</Link>
                        <Link to='/orders' className="text-sm hover:underline">Các Đơn Hàng</Link>
                        <Typography className="text-sm font-semibold">{order.orderId}</Typography>
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outlined" color="secondary" startIcon={<FiPrinter />} sx={{ textTransform: 'none', borderRadius: '8px' }}>In hóa đơn</Button>
                    <Button variant="contained" sx={{ textTransform: 'none', borderRadius: '8px' }}>Lưu thay đổi</Button>
                </div>
            </div>

            {/* Layout chính của trang */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Cột trái: Chứa thông tin chính của đơn hàng */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    <FormSection title="Chi tiết sản phẩm & Tổng kết" icon={<FiShoppingCart />}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-gray-500"><tr><th className="p-2">Sản phẩm</th><th className="p-2">Số lượng</th><th className="p-2 text-right">Đơn giá</th><th className="p-2 text-right">Thành tiền</th></tr></thead>
                                <tbody>
                                    {order.products.map(p => (
                                        <tr key={p.id} className="border-t">
                                            <td className="p-2"><div className="flex items-center gap-3"><img src={p.image} className="w-12 h-12 rounded-md object-cover" /><div><p className="font-semibold">{p.name}</p><p className="text-xs text-gray-500">{p.variant}</p></div></div></td>
                                            <td className="p-2 font-medium">x {p.qty}</td>
                                            <td className="p-2 text-right">{p.price.toLocaleString('vi-VN')} đ</td>
                                            <td className="p-2 text-right font-semibold">{(p.salePrice || p.price * p.qty).toLocaleString('vi-VN')} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Divider />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Tổng tiền hàng:</span><span>{order.summary.subtotal.toLocaleString('vi-VN')} đ</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển:</span><span>{order.summary.shippingFee.toLocaleString('vi-VN')} đ</span></div>
                            <div className="flex justify-between text-green-600"><span >Giảm giá ({order.summary.discount.code}):</span><span>- {order.summary.discount.amount.toLocaleString('vi-VN')} đ</span></div>
                            <Divider />
                            <div className="flex justify-between font-bold text-lg"><span >Tổng cộng:</span><span>{order.summary.grandTotal.toLocaleString('vi-VN')} đ</span></div>
                        </div>
                    </FormSection>

                    <FormSection title="Lịch sử & Ghi chú nội bộ" icon={<FiFileText />}>
                        <TextField fullWidth label="Thêm ghi chú nội bộ..." variant="outlined" multiline rows={3} />
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Thêm ghi chú</Button>
                        <Divider />
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                            {order.history.map((h, i) => <p key={i} className="text-xs text-gray-500"><span className="font-semibold">{h.time}:</span> {h.action}</p>)}
                        </div>
                    </FormSection>
                </div>

                {/* Cột phải: Chứa thông tin phụ và các hành động */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <FormSection title="Thông tin chung" icon={<FiList />}>
                        <div className="flex justify-between items-center pb-2">
                            <div>
                                <Typography variant="body2" color="text.secondary">Mã đơn hàng</Typography>
                                <Typography variant="body1" fontWeight="bold">{order.orderId}</Typography>
                            </div>
                            <div>
                                <Typography variant="body2" color="text.secondary" align="right">Ngày đặt</Typography>
                                <Typography variant="body1" fontWeight="medium">{order.date}</Typography>
                            </div>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center"><Typography variant="body2">Trạng thái hiện tại:</Typography><StatusTag status={order.status} /></div>
                        <FormControl fullWidth><InputLabel>Cập nhật trạng thái</InputLabel><Select label="Cập nhật trạng thái" value={order.status} onChange={handleStatusChange}>{Object.keys(statusMapping).map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}</Select></FormControl>
                        <Divider />
                        <div className="grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <FiDollarSign className="text-gray-500" />
                                <Typography className='whitespace-nowrap' color="text.secondary">Tổng tiền:</Typography>
                                <Typography className='whitespace-nowrap' fontWeight="bold">{order.summary.grandTotal.toLocaleString('vi-VN')} đ</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiCreditCard className="text-gray-500" />
                                <Typography className='whitespace-nowrap' color="text.secondary">Thanh toán:</Typography>
                                <Typography className='whitespace-nowrap' fontWeight="medium">{order.paymentMethod}</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiTruck className="text-gray-500" />
                                <Typography className='whitespace-nowrap' color="text.secondary">Vận chuyển:</Typography>
                                <Typography className='whitespace-nowrap' fontWeight="medium">{order.shippingMethod}</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiTruck className="text-gray-500" />
                                <Typography className='whitespace-nowrap' color="text.secondary">Lớp VC:</Typography>
                                <Typography className='whitespace-nowrap' fontWeight="medium">{order.shippingClass}</Typography>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Thông tin khách hàng" icon={<FiUser />}>
                        <p className="flex items-center gap-2"><FiUser className="text-gray-500" /><strong>{order.customer.name}</strong></p>
                        <p className="flex items-center gap-2"><FiPhone className="text-gray-500" />{order.customer.phone}</p>
                        <p className="flex items-center gap-2"><FiMail className="text-gray-500" />{order.customer.email}</p>
                        <Divider />
                        <p className="flex items-start gap-2"><FiMapPin className="text-gray-500 mt-1" /><span>{order.customer.address} <a href="#" className="text-blue-600 hover:underline text-xs">[Xem bản đồ]</a></span></p>
                        {order.customerNote && <div className="p-2 bg-yellow-50 rounded-md border border-yellow-200 text-sm">{order.customerNote}</div>}
                    </FormSection>
                </div>
            </div>
        </section>
    );
};

export default OrderDetailPage;