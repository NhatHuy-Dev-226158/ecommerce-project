import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

// --- DỮ LIỆU MẪU ĐÃ CẬP NHẬT ---
const data = [
    { name: 'Quận 1', value: 128 },
    { name: 'Quận 3', value: 135 },
    { name: 'Bình Thạnh', value: 68 },
    { name: 'Phú Nhuận', value: 62 },
    { name: 'Gò Vấp', value: 45 },
];
// Sắp xếp dữ liệu từ cao đến thấp
data.sort((a, b) => b.value - a.value);

// Dải màu gradient từ tím đậm đến tím nhạt
const colors = ['#6d28d9', '#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'];

// --- CÁC HÀM VÀ COMPONENT TIỆN ÍCH ---
const xAxisFormatter = (value) => `${value}Tr`;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((payload[0].value / total) * 100).toFixed(1);
        const rank = data.findIndex(item => item.name === label) + 1;

        return (
            <div className="p-2 bg-gray-800 text-white shadow-lg rounded-md text-sm">
                <p className="font-bold">{label} - <span className="text-yellow-400">Hạng #{rank}</span></p>
                <p>Doanh thu: {payload[0].value.toLocaleString()} Tr</p>
                <p className="text-xs opacity-80">{`Chiếm ${percentage}% tổng doanh thu`}</p>
            </div>
        );
    }
    return null;
};

// === COMPONENT CHÍNH ===
const RevenueByRegionChart = () => {
    // State để quản lý việc focus khi hover
    const [focusBar, setFocusBar] = useState(null);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 h-full">
            <h3 className="font-extrabold text-xl text-gray-900 mb-4">Doanh thu theo Khu vực</h3>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
                    onMouseMove={(state) => {
                        if (state.isTooltipActive) {
                            setFocusBar(state.activeTooltipIndex);
                        } else {
                            setFocusBar(null);
                        }
                    }}
                    onMouseLeave={() => setFocusBar(null)}
                >
                    <CartesianGrid
                        strokeDasharray="3 3" // Kiểu đường đứt nét
                        stroke="#e5e7eb" // Màu xám nhạt (gray-200)
                        horizontal={false} // Chỉ giữ lại đường kẻ dọc
                    />

                    <XAxis
                        type="number"
                        tickFormatter={xAxisFormatter}
                        // Hiển thị lại đường trục và vạch chia
                        axisLine={{ stroke: '#cbd5e1' }} // Màu của đường trục X
                        tickLine={{ stroke: '#cbd5e1' }} // Màu của vạch chia
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />

                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#374151' }} width={80} />

                    <Tooltip cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }} content={<CustomTooltip />} />

                    <Bar dataKey="value" barSize={30} radius={[0, 10, 10, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                                opacity={focusBar === null || focusBar === index ? 1 : 0.3}
                                className="transition-opacity duration-200"
                            />
                        ))}
                        <LabelList
                            dataKey="value"
                            position="right"
                            offset={8}
                            formatter={(value) => `${value}Tr`}
                            style={{ fill: '#374151', fontWeight: '500', fontSize: '12px' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueByRegionChart;