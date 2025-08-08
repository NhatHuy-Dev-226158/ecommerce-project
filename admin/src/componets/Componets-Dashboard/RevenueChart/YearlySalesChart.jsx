import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { Box, Typography, Select, MenuItem, FormControl, Paper } from '@mui/material';
import { FiArrowUp } from "react-icons/fi";

// --- DỮ LIỆU VÀ CÁC HÀM TIỆN ÍCH ---
const data = [
    { name: 'Thg 1', income: 55, expenses: 60 }, { name: 'Thg 2', income: 35, expenses: 45 },
    { name: 'Thg 3', income: 42, expenses: 38 }, { name: 'Thg 4', income: 60, expenses: 55 },
    { name: 'Thg 5', income: 95, expenses: 80 }, { name: 'Thg 6', income: 80, expenses: 100 },
    { name: 'Thg 7', income: 70, expenses: 85 }, { name: 'Thg 8', income: 150, expenses: 120 },
    { name: 'Thg 9', income: 110, expenses: 90 }, { name: 'Thg 10', income: 98, expenses: 105 },
    { name: 'Thg 11', income: 75, expenses: 88 }, { name: 'Thg 12', income: 55, expenses: 70 },
];
const totalIncome = 925000000;
const totalExpenses = 946000000;
const forecastValue = 1322000000;

// trục tung
const formatAxisValue = (value) => `${value} tr`;

const formatDisplayValue = (value) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2).replace('.', ',')} tỉ`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(2).replace('.', ',')} tr`;
    return value.toLocaleString('vi-VN');
};

//Tooltip 
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white shadow-xl rounded-lg border border-gray-200">
                <p className="font-bold text-gray-800 text-sm mb-2">{label}</p>
                <div className="space-y-1">
                    {payload.map((p, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.stroke }}></div>
                            <span className="text-gray-500">{p.name}:</span>
                            {/* Nhân giá trị với 1 triệu và định dạng lại */}
                            <span className="font-bold text-gray-900">
                                {(p.value * 1000000).toLocaleString('vi-VN')} đ
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// === COMPONENT CHÍNH  ===
const YearlySalesChart = () => {
    const [year, setYear] = useState(2024);

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">Doanh số Năm</Typography>
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                        <FiArrowUp size={16} style={{ marginRight: '4px' }} /> (+43%) so với năm ngoái
                    </Typography>
                </Box>
                <FormControl size="small" variant="outlined">
                    <Select value={year} onChange={(e) => setYear(e.target.value)}
                        sx={{
                            borderRadius: '8px', bgcolor: 'rgba(241, 245, 249, 0.7)',
                            boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 },
                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 0 },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'primary.main' }
                        }}>
                        <MenuItem value={2023}>2023</MenuItem>
                        <MenuItem value={2024}>2024</MenuItem>
                        <MenuItem value={2025}>2025</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Chú thích & Tóm tắt */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' }, gap: 2, mt: 3, mb: 3 }}>
                <Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><Typography variant="caption" color="text.secondary">Tổng thu</Typography></Box><Typography fontWeight="bold" variant="h5" component="p">{formatDisplayValue(totalIncome)}</Typography></Box>
                <Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div><Typography variant="caption" color="text.secondary">Tổng chi</Typography></Box><Typography fontWeight="bold" variant="h5" component="p">{formatDisplayValue(totalExpenses)}</Typography></Box>
                <Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div><Typography variant="caption" color="text.secondary">Dự đoán</Typography></Box><Typography fontWeight="bold" variant="h5" component="p">{formatDisplayValue(forecastValue)}</Typography></Box>
            </Box>

            {/* Biểu đồ */}
            <Box sx={{ width: '100%', height: 300, ml: { xs: -3, sm: -4 } }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.2} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis
                            tickFormatter={formatAxisValue}
                            tick={{ fontSize: 12 }}
                            stroke="#9ca3af"
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 'dataMax + 50']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="income" name="Tổng thu" fill="url(#incomeGradient)" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="expenses" name="Tổng chi" fill="url(#expensesGradient)" stroke="#fb923c" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default YearlySalesChart;