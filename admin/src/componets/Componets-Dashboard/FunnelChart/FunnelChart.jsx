import React from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, Cell } from 'recharts';

// --- DỮ LIỆU MẪU ĐÃ THÊM 'absoluteValue' (giá trị tuyệt đối) ---
// Dữ liệu này khớp với hình ảnh của bạn
const data = [
    { name: 'Truy cập online', percentage: 100.0, absoluteValue: 905, fill: '#6366f1' }, // Indigo
    { name: 'Xem sản phẩm', percentage: 65.8, absoluteValue: 595, fill: '#a78bfa' }, // Purple-400
    { name: 'Thêm vào giỏ hàng', percentage: 30.1, absoluteValue: 271, fill: '#e879f9' }, // Fuchsia-400
    { name: 'Thanh toán', percentage: 24.8, absoluteValue: 224, fill: '#f43f5e' },    // Red-500
    { name: 'Hoàn tất mua', percentage: 23.3, absoluteValue: 211, fill: '#10b981' }, // Emerald-500
];

// --- COMPONENT TÙY CHỈNH CHO TOOLTIP ---
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        // payload[0] là dữ liệu của phần được hover
        const dataPoint = payload[0].payload;
        return (
            <div className="p-3 bg-white shadow-lg rounded-md border border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                    Số lượng : <span className="font-bold">{dataPoint.absoluteValue.toLocaleString()} người</span>
                </p>
            </div>
        );
    }
    return null;
};


// === COMPONENT CHÍNH ===
const ConversionFunnelChart = () => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200/80 h-full">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Phễu chuyển đổi (Kênh Online)</h3>
        {/* ResponsiveContainer đảm bảo biểu đồ co giãn theo kích thước của thẻ cha */}
        <ResponsiveContainer width="100%" height={320}>
            <FunnelChart>
                {/* Sử dụng component Tooltip tùy chỉnh */}
                <Tooltip content={<CustomTooltip />} />

                <Funnel dataKey="percentage" data={data} isAnimationActive>
                    {/* LabelList ở giữa để hiển thị % */}
                    <LabelList
                        position="center"
                        fill="#fff"
                        stroke="none"
                        dataKey="percentage"
                        formatter={(value) => `${value}%`}
                        className="font-bold text-sm"
                    />
                    {/* LabelList bên phải để hiển thị tên bước */}
                    <LabelList
                        position="right"
                        fill="#374151" // gray-700
                        stroke="none"
                        dataKey="name"
                        className="text-sm font-medium"
                    />
                    {/* 
                       Thêm <Cell> để gán màu cho từng phần của phễu.
                       Nếu không có, recharts sẽ tự chọn màu.
                     */}
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Funnel>
            </FunnelChart>
        </ResponsiveContainer>
    </div>
);

export default ConversionFunnelChart;