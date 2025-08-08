import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const salesChannelData = [
    { name: 'App', value: 68, orders: 1360, color: '#4f46e5' },
    { name: 'Tại cửa hàng', value: 14, orders: 280, color: '#7c3aed' },
    { name: 'Website', value: 15, orders: 300, color: '#a78bfa' },
    { name: 'Khác', value: 3, orders: 60, color: '#c4b5fd' },
];

const revenueByCategoryData = [
    { name: 'Hải sản tươi sống', value: 40, color: '#4f46e5' },
    { name: 'Rau củ & Trái cây', value: 30, color: '#6366f1' },
    { name: 'Thịt & Gia cầm', value: 25, color: '#818cf8' },
    { name: 'Hàng tiêu dùng', value: 18, color: '#a5b4fc' },
    { name: 'Quần áo & Phụ kiện', value: 15, color: '#c7d2fe' },
    { name: 'Đồ uống & Giải khát', value: 12, color: '#e0e7ff' },
];

const customerSegmentData = [
    { name: 'Khách mới', value: 164, color: '#4f46e5' },
    { name: 'Khách quay lại', value: 58, color: '#a78bfa' },
];
const totalCustomers = customerSegmentData.reduce((sum, item) => sum + item.value, 0);

// ---COMPONENT CON ---
//Tooltip để hiển thị số đơn hàng
const SalesChannelTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        // `payload[0].payload` chứa toàn bộ object dữ liệu gốc (bao gồm cả `orders`)
        const originalData = payload[0].payload;
        return (
            <div className="p-2 px-3 bg-white/80 backdrop-blur-sm shadow-xl rounded-md border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: originalData.color }}></div>
                    <span className="text-gray-500">{originalData.name}:</span>
                    <span className="font-bold text-gray-800">
                        {originalData.orders.toLocaleString('vi-VN')} đơn
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

// Tooltip cho Doanh thu
const RevenueTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="p-2 px-3 bg-white/80 backdrop-blur-sm shadow-xl rounded-md border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.color }}></div>
                    <span className="text-gray-500">{data.name}:</span>
                    <span className="font-bold text-gray-800">{(data.value * 1000000).toLocaleString('vi-VN')} đ</span>
                </div>
            </div>
        );
    }
    return null;
};

// Tooltip cho Khách hàng
const CustomerTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="p-2 px-3 bg-white/80 backdrop-blur-sm shadow-xl rounded-md border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.color }}></div>
                    <span className="text-gray-500">{data.name}:</span>
                    <span className="font-bold text-gray-800">{data.value} khách</span>
                </div>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ data, sx }) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', mt: 2, ...sx }}>
        {data.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center text-sm text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
            </div>
        ))}
    </Box>
);

const CenterLabel = ({ value, label }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <Typography variant="h5" component="p" fontWeight="bold" sx={{ color: '#1f2937' }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: '#6b7280' }}>{label}</Typography>
    </div>
);

const ChartCard = ({ title, children }) => (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#374151', mb: 2 }}>{title}</Typography>
        {children}
    </Paper>
);

// === COMPONENT CHÍNH ===
const DetailedAnalysisSection = () => {
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-semibold text-xs">{`${(percent * 100).toFixed(0)}%`}</text>);
    };

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Phân tích chi tiết</h2>
            <Grid container spacing={3}>
                {/* 1. Biểu đồ Kênh Bán hàng */}
                <Grid item xs={12} md={6} lg={4}>
                    <ChartCard title="Kênh Bán hàng">
                        <Box sx={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Tooltip content={<SalesChannelTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Pie data={salesChannelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomizedLabel}>
                                        {salesChannelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <CustomLegend data={salesChannelData} />
                    </ChartCard>
                </Grid>

                {/* 2. Biểu đồ Doanh thu theo Danh mục */}
                <Grid item xs={12} md={6} lg={4}>
                    <ChartCard title="Doanh thu theo Danh mục">
                        <Box sx={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Pie data={revenueByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                        {revenueByCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <CustomLegend data={revenueByCategoryData} sx={{ columnCount: 2, textAlign: 'left' }} />
                    </ChartCard>
                </Grid>

                {/* 3. Biểu đồ Phân loại Khách hàng */}
                <Grid item xs={12} md={6} lg={4}>
                    <ChartCard title="Phân loại Khách hàng">
                        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Tooltip content={<CustomerTooltip />} cursor={{ fill: 'transparent' }} wrapperStyle={{ zIndex: 999 }} />
                                    <Pie data={customerSegmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={80} startAngle={90} endAngle={450}>
                                        {customerSegmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <CenterLabel value={totalCustomers} label="Tổng khách" />
                        </Box>
                        <CustomLegend data={customerSegmentData} />
                    </ChartCard>
                </Grid>
            </Grid>
        </section>
    );
};

export default DetailedAnalysisSection;