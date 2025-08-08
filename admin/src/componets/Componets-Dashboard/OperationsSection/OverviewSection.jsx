import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { FiPackage, FiAlertTriangle } from 'react-icons/fi';

// --- DỮ LIỆU MẪU ---
const topSellingProductsData = [
    { id: 1, name: 'Tôm sú tươi', image: 'https://hungtruongsa.vn/wp-content/uploads/2022/06/z3761611865346_922cc119a266df5298a59678c98b949f-2.jpg', soldCount: 97, revenue: 1900000 },
    { id: 2, name: 'Cải bó xôi VietGAP', image: 'https://product.hstatic.net/200000668417/product/cai-bo-xoi-la-mot-mon-an-ngon-va-co-nhieu-tac-dung-chua-benh-1_94017511fbc545cdbba17039ba385670.jpg', soldCount: 97, revenue: 900000 },
    { id: 3, name: 'Áo phông nam', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', soldCount: 194, revenue: 1000000 },
    { id: 4, name: 'Ức gà file', image: 'https://thucphamsachgiagoc.com/wp-content/uploads/2018/12/uc-ga-phi-le-600x450.jpg', soldCount: 114, revenue: 1400000 },
    { id: 5, name: 'Nước ép cam', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', soldCount: 72, revenue: 1600000 },
];

const recentOrdersData = [
    { id: 1, customerName: 'Phạm Đức Bình', orderId: 'ORD-5346', amount: 474632, status: 'Cancelled', statusColor: 'red' },
    { id: 2, customerName: 'Nguyễn Thị Thu', orderId: 'ORD-3630', amount: 413087, status: 'Cancelled', statusColor: 'red' },
    { id: 3, name: 'Lê Minh Anh', orderId: 'ORD-3815', amount: 441324, status: 'Shipped', statusColor: 'blue' },
    { id: 4, name: 'Trần Văn Hoàng', orderId: 'ORD-5167', amount: 487608, status: 'Pending', statusColor: 'yellow' },
    { id: 5, name: 'Nguyễn Thị Thu', orderId: 'ORD-8655', amount: 367185, status: 'Completed', statusColor: 'green' },
    { id: 6, name: 'Vũ Bích Phương', orderId: 'ORD-3542', amount: 163644, status: 'Pending', statusColor: 'yellow' },
    { id: 7, name: 'Nguyễn Thị Thu', orderId: 'ORD-7513', amount: 419626, status: 'Completed', statusColor: 'green' },
];

const newArrivalsData = [
    { id: 1, name: 'Cá hồi Na-uy File', image: 'https://bizweb.dktcdn.net/100/227/495/products/salmon-fillet-in-norway.jpg?v=1722935190930', category: 'Hải sản tươi sống', arrivalDate: 'Hôm qua' },
    { id: 2, name: 'Dâu tây Hàn Quốc', image: 'https://traicaytonyteo.com/uploads/source/nho-mau-don/dau-han-quoc.webp', category: 'Rau củ & Trái cây', arrivalDate: '14/7/2025' },
    { id: 3, name: 'Áo khoác gió', image: 'https://product.hstatic.net/1000312752/product/afdt185-8-a_10c97d53e77f4b87b7c6ac26a465eccb.jpg', category: 'Quần áo & Phụ kiện', arrivalDate: '13/7/2025' },
    { id: 4, name: 'Nho Mỹ không hạt', image: 'https://traicaytonyteo.com/uploads/source/anh-web-ngoc/nho-den-khong-hat-my.jpg', category: 'Rau củ & Trái cây', arrivalDate: '12/7/2025' },
];

const lowStockItemsData = [
    { id: 1, name: 'Cá diêu hồng', remaining: 8 },
    { id: 2, name: 'Áo sơ mi nữ', remaining: 2 },
    { id: 3, name: 'Nước lau sàn Lix', remaining: 5 },
];


// --- CÁC COMPONENT CON ---
const StatusTag = ({ text, colorScheme }) => {
    const colors = {
        green: 'bg-green-100 text-green-700', blue: 'bg-blue-100 text-blue-700',
        yellow: 'bg-yellow-100 text-yellow-800', red: 'bg-red-100 text-red-700',
    };
    return (<span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[colorScheme] || 'bg-gray-100'}`}>{text}</span>);
};

const TopSellingProductsCard = () => (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary" mb={1}>Sản phẩm Bán chạy nhất</Typography>
        <div className="divide-y divide-gray-100">
            {topSellingProductsData.map(product => (
                <div key={product.id} className="flex items-center gap-4 py-3"> {/* Thêm padding dọc */}
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.soldCount} đã bán</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{product.revenue.toLocaleString('vi-VN')} đ</p>
                </div>
            ))}
        </div>
    </Paper>
);

const RecentOrdersCard = () => (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary" mb={1}>Đơn hàng Gần đây</Typography>
        <div className="divide-y divide-gray-100">
            {recentOrdersData.map(order => (
                <div key={order.id} className="flex items-center justify-between gap-4 py-3"> {/* Thêm padding dọc */}
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{order.customerName || order.name}</p>
                        <p className="text-xs text-gray-500">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{order.amount.toLocaleString('vi-VN')} đ</p>
                        <StatusTag text={order.status} colorScheme={order.statusColor} />
                    </div>
                </div>
            ))}
        </div>
    </Paper>
);

const NewArrivalsCard = () => (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2 mb-1">
            <FiPackage className="text-green-600" size={20} />
            <Typography variant="h6" fontWeight="bold">Hàng mới về</Typography>
        </div>
        <div className="divide-y divide-gray-100">
            {newArrivalsData.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-3"> {/* Thêm padding dọc */}
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                        <p className="text-xs text-center text-gray-600 bg-gray-200 rounded-full w-[140px] py-0.5 mt-1">
                            {item.category}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 self-start pt-1">{item.arrivalDate}</p>
                </div>
            ))}
        </div>
    </Paper>
);

const LowStockWarningCard = () => (
    <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
        <div className="flex items-center gap-2 mb-1">
            <FiAlertTriangle className="text-amber-600" />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#b45309' }}>Cảnh báo Tồn kho thấp</Typography>
        </div>
        <div className="divide-y divide-amber-200">
            {lowStockItemsData.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2"> {/* Thêm padding dọc */}
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-bold text-red-600">Còn lại: {item.remaining}</span>
                </div>
            ))}
        </div>
    </Paper>
);

// === COMPONENT CHÍNH ===
const OverviewSection = () => {
    return (
        <section className="">
            <Grid container spacing={3}>
                <Grid item xs={12} lg={4}>
                    <TopSellingProductsCard />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <RecentOrdersCard />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <div className="space-y-6">
                        <NewArrivalsCard />
                        <LowStockWarningCard />
                    </div>
                </Grid>
            </Grid>
        </section>
    );
};

export default OverviewSection;