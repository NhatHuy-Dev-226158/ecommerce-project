import React, { useState } from 'react';
import { Paper, Typography, Box, Grid, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { FiArrowUp, FiTrendingUp, FiBarChart2, FiZap, FiX, FiThumbsUp, FiThumbsDown, FiAlertTriangle, FiCheckCircle, FiUsers } from 'react-icons/fi';

// --- DỮ LIỆU MẪU ---
const marketingCampaignsData = [
    { id: 1, name: 'Khuyến mãi hải sản', channel: 'In-store Promo', channelColor: 'purple', status: 'Active', statusColor: 'green', budget: 2000000, conversions: 68, roi: 783.4 },
    { id: 2, name: 'Giảm giá hàng thời trang', channel: 'Social Media', channelColor: 'blue', status: 'Active', statusColor: 'green', budget: 2000000, conversions: 55, roi: 339.6 },
    { id: 3, name: 'Tờ rơi rau củ sạch', channel: 'Flyers', channelColor: 'orange', status: 'Paused', statusColor: 'yellow', budget: 3000000, conversions: 80, roi: 669.8 },
    { id: 4, name: 'Deal chớp nhoáng hàng tiêu dùng', channel: 'Social Media', channelColor: 'blue', status: 'Ended', statusColor: 'gray', budget: 3000000, conversions: 86, roi: 536.3 },
];

const potentialProductsData = [
    {
        id: 1, name: 'Nấm hữu cơ', englishName: 'Organic Mushrooms', image: 'https://beanmart.vn/wp-content/uploads/2023/09/trai-cay-nhap-khau2-40.jpg', demand: 'Cao', profitMargin: 45,
        targetAudience: 'Gia đình, người quan tâm sức khỏe',
        recommendation: { text: 'Nên nhập hàng', type: 'success' },
        pros: ['Xu hướng tiêu dùng xanh và thực phẩm sạch đang tăng mạnh.', 'Biên lợi nhuận cao hơn so với rau củ thông thường.', 'Phù hợp với tệp khách hàng hiện tại của siêu thị.'],
        cons: ['Yêu cầu quy trình bảo quản nghiêm ngặt, dễ hư hỏng.', 'Giá nhập đầu vào có thể cao hơn.']
    },
    {
        id: 2, name: 'Sữa hạt', englishName: 'Almond, Oat milk', image: 'https://file.hstatic.net/200000700229/article/cac-loai-sua-hat-1_fa8d145f920747cbb265b105db702c18.jpeg', demand: 'Cao', profitMargin: 35,
        targetAudience: 'Người trẻ, người không dung nạp lactose',
        recommendation: { text: 'Nên nhập hàng', type: 'success' },
        pros: ['Thị trường sữa thay thế đang phát triển rất nhanh.', 'Nhiều thương hiệu lớn đã có mặt, dễ tìm nguồn cung.', 'Bổ sung tốt cho ngành hàng đồ uống, thu hút khách hàng mới.'],
        cons: ['Cạnh tranh cao từ các chuỗi siêu thị lớn khác.', 'Hạn sử dụng ngắn đối với các loại sữa tươi.']
    },
    {
        id: 3, name: 'Snack rong biển ăn liền', englishName: '', image: 'https://cjfoods.com.vn/storage/products/jan-05-snack-seaweed-original-25g-1.jpg', demand: 'Trung bình', profitMargin: 50,
        targetAudience: 'Trẻ em, nhân viên văn phòng',
        recommendation: { text: 'Cân nhắc', type: 'warning' },
        pros: ['Sản phẩm ăn vặt tiện lợi, dễ bán.', 'Biên lợi nhuận rất hấp dẫn.'],
        cons: ['Thị trường có nhiều sản phẩm tương tự từ Hàn Quốc, Thái Lan.', 'Có thể không phải là mặt hàng thiết yếu, doanh số không ổn định.', 'Cần kiểm tra kỹ phản ứng của khách hàng địa phương.']
    },
];

// --- CÁC COMPONENT CON ---
const StatusTag = ({ text, colorScheme }) => {
    const colors = {
        green: 'bg-green-100 text-green-700', blue: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700', orange: 'bg-orange-100 text-orange-700',
        yellow: 'bg-yellow-100 text-yellow-700', gray: 'bg-gray-200 text-gray-700',
    };
    return (<span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colors[colorScheme] || colors.gray}`}>{text}</span>);
};

const MarketingCampaignsTable = () => (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#374151', mb: 3 }}>Hiệu suất Chiến dịch Marketing</Typography>
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 border-b border-gray-100"><div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Chiến dịch</div><div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kênh & Trạng thái</div><div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ngân sách</div><div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Chuyển đổi & ROI</div></div>
        <div className="divide-y divide-gray-100">{marketingCampaignsData.map((c) => (<div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 px-4 hover:bg-gray-50 transition-colors"><div className="col-span-1 md:col-span-4 text-sm font-semibold text-gray-800">{c.name}</div><div className="col-span-1 md:col-span-3 flex flex-wrap gap-2"><StatusTag text={c.channel} colorScheme={c.channelColor} /><StatusTag text={c.status} colorScheme={c.statusColor} /></div><div className="col-span-1 md:col-span-2 text-sm text-gray-700">{c.budget.toLocaleString('vi-VN')} đ</div><div className="col-span-1 md:col-span-3 flex items-center gap-3 text-sm"><span className="font-bold text-gray-800">{c.conversions} CVR</span><span className="flex items-center font-bold text-green-600"><FiArrowUp size={14} className="mr-0.5" /> {c.roi}%</span></div></div>))}</div>
    </Paper>
);

/* Cửa sổ modal hiển thị phân tích chi tiết.*/
const ProductAnalysisDialog = ({ open, onClose, product }) => {
    if (!product) return null;

    const recommendationTag = {
        success: { icon: <FiCheckCircle />, className: 'bg-green-100 text-green-800' },
        warning: { icon: <FiAlertTriangle />, className: 'bg-yellow-100 text-yellow-800' },
    };
    const currentRecommendation = recommendationTag[product.recommendation.type] || {};

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ m: 0, p: 2, pr: 8 }}>
                Phân tích Sản phẩm Tiềm năng
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}><FiX /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Phần thông tin chung */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1">
                        <Typography variant="h5" component="h2" fontWeight="bold">{product.name}</Typography>
                        {product.englishName && <Typography variant="body1" color="text.secondary" sx={{ mt: -0.5 }}>{product.englishName}</Typography>}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700 mt-2">
                            <span className="flex items-center gap-1.5"><FiTrendingUp className="text-green-500" /> Nhu cầu dự báo: <strong className="text-gray-900">{product.demand}</strong></span>
                            <span className="flex items-center gap-1.5"><FiBarChart2 className="text-blue-500" /> Lợi nhuận ước tính: <strong className="text-gray-900">{product.profitMargin}%</strong></span>
                            <span className="flex items-center gap-1.5"><FiUsers className="text-purple-500" /> Khách hàng mục tiêu: <strong className="text-gray-900">{product.targetAudience}</strong></span>
                        </div>
                    </div>
                </div>

                <Box sx={{ my: 3, py: 3, borderRadius: 3, bgcolor: '#f9fafb', textAlign: 'center' }}>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.05em' }}>
                        ĐỀ XUẤT TỪ HỆ THỐNG
                    </Typography>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 mt-1 rounded-full text-sm font-semibold ${currentRecommendation.className}`}>
                        {currentRecommendation.icon}
                        {product.recommendation.text}
                    </div>
                </Box>

                {/* Lý do và Rủi ro */}
                <Grid container spacing={3} >
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2.5, bgcolor: '#f0fdf4', borderRadius: 3, height: '100%' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <FiThumbsUp className="text-green-600" />
                                <Typography variant="body1" fontWeight="bold" sx={{ color: '#166534' }}>Lý do nên nhập hàng</Typography>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {product.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                            </ul>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2.5, bgcolor: '#fef2f2', borderRadius: 3, height: '100%' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <FiThumbsDown className="text-red-600" />
                                <Typography variant="body1" fontWeight="bold" sx={{ color: '#b91c1c' }}>Rủi ro tiềm ẩn</Typography>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {product.cons.map((con, index) => <li key={index}>{con}</li>)}
                            </ul>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', bgcolor: '#f9fafb' }}>
                <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, textTransform: 'none', px: 4 }}>Đóng</Button>
            </Box>
        </Dialog>
    );
};

/* Hiển thị danh sách sản phẩm. */
const ProductForecastCard = ({ onAnalyzeClick }) => (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%', backgroundColor: '#FBFCFF' }}>
        <div className="flex items-center gap-2 mb-4"><FiZap className="text-purple-600" size={20} /><Typography variant="h6" fontWeight="bold" sx={{ color: '#374151' }}>Dự báo Sản phẩm Tiềm năng</Typography></div>
        <div className="space-y-4">
            {potentialProductsData.map(product => (
                <div key={product.id} className="bg-white p-3 rounded-xl shadow-sm space-y-3 transition-shadow hover:shadow-md">
                    <div className="flex items-start gap-3"><img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" /><div className="flex-1"><p className="font-bold text-sm text-gray-800">{product.name}</p>{product.englishName && <p className="text-xs text-gray-500 -mt-0.5">{product.englishName}</p>}<div className="flex items-center gap-4 text-xs text-gray-600 mt-1.5"><span className="flex items-center gap-1"><FiTrendingUp className="text-green-500" /> Nhu cầu: {product.demand}</span><span className="flex items-center gap-1"><FiBarChart2 className="text-blue-500" /> LN: {product.profitMargin}%</span></div></div></div>
                    <Button onClick={() => onAnalyzeClick(product)} fullWidth variant="contained" sx={{ bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 'bold', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#e0e7ff' } }}>Xem phân tích sâu</Button>
                </div>
            ))}
        </div>
    </Paper>
);

// === COMPONENT CHÍNH ===
const OperationsSection = () => {
    // State để quản lý việc mở/đóng dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    // State để lưu trữ dữ liệu của sản phẩm được chọn
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Hàm để mở dialog
    const handleOpenDialog = (product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    // Hàm để đóng dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <main className="">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hoạt động & Vận hành</h2>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <MarketingCampaignsTable />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <ProductForecastCard onAnalyzeClick={handleOpenDialog} />
                </Grid>
            </Grid>
            <ProductAnalysisDialog open={dialogOpen} onClose={handleCloseDialog} product={selectedProduct} />
        </main>
    );
};

export default OperationsSection;