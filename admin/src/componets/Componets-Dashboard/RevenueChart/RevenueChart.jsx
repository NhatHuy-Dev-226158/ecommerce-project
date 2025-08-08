import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Box, Typography, Select, MenuItem, Paper } from '@mui/material';
import { FiCalendar } from "react-icons/fi";

// --- CÁC HÀM TIỆN ÍCH & DỮ LIỆU ---

// THAY ĐỔI: Hàm tạo dữ liệu theo từng ngày trong tháng
const generateDailyData = (year, month) => {
    // Lấy số ngày của tháng được chọn
    const daysInMonth = new Date(year, month, 0).getDate();
    const data = [];

    // Lặp qua từng ngày để tạo dữ liệu mẫu
    for (let day = 1; day <= daysInMonth; day++) {
        // Tạo dữ liệu ngẫu nhiên 
        const income = (Math.sin(day * 0.4 + month) * 20 + 40) * 1000000;
        const expenses = (Math.cos(day * 0.6 + month) * 15 + 30) * 1000000;
        data.push({
            name: day.toString().padStart(2, '0'), // Định dạng ngày thành "01", "02",...
            income: Math.max(0, Math.round(income)),
            expenses: Math.max(0, Math.round(expenses)),
        });
    }
    return data;
};

// Hàm định dạng (tỉ, triệu)
const formatValue = (value) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2).replace('.', ',')} tỉ`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace('.', ',')} tr`;
    return value.toLocaleString('vi-VN');
};

// Hàm định dạng giá trị cho trục Y 
const formatAxisValue = (value) => {
    if (value === 0) return '0';
    return `${value / 1000000}tr`;
};

// Tooltip 
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white shadow-xl rounded-lg border border-gray-200">
                <p className="font-bold text-gray-800 text-sm mb-2">Ngày: {label}</p>
                <div className="space-y-1">
                    {payload.map((p, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.stroke }}></div>
                            <span className="text-gray-500">{p.name}:</span>
                            <span className="font-bold text-gray-900">{p.value.toLocaleString('vi-VN')} đ</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// === COMPONENT CHÍNH ===
const SalesTrendChart = () => {
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const newData = generateDailyData(selectedDate.year, selectedDate.month);
        setChartData(newData);
    }, [selectedDate]);

    const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">Phân tích Thu-Chi</Typography>
                    <Typography variant="body2" color="text.secondary">Dữ liệu theo ngày của tháng đã chọn.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <FiCalendar size={20} className="text-gray-500" />
                    <Select
                        size="small"
                        value={selectedDate.month}
                        onChange={(e) => setSelectedDate(prev => ({ ...prev, month: e.target.value }))}
                        sx={{ '.MuiOutlinedInput-notchedOutline': { border: '1px solid #e5e7eb' } }}
                    >
                        {months.map(m => <MenuItem key={m} value={m}>Tháng {m}</MenuItem>)}
                    </Select>
                    <Select
                        size="small"
                        value={selectedDate.year}
                        onChange={(e) => setSelectedDate(prev => ({ ...prev, year: e.target.value }))}
                        sx={{ '.MuiOutlinedInput-notchedOutline': { border: '1px solid #e5e7eb' } }}
                    >
                        {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, mt: 3, mb: 3 }}>
                <Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><Typography variant="caption" color="text.secondary">Tổng thu</Typography></Box><Typography fontWeight="bold" variant="h5" component="p">{formatValue(totalIncome)}</Typography></Box>
                <Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div><Typography variant="caption" color="text.secondary">Tổng chi</Typography></Box><Typography fontWeight="bold" variant="h5" component="p">{formatValue(totalExpenses)}</Typography></Box>
            </Box>

            <Box sx={{ width: '100%', height: 300, ml: { xs: -3, sm: -4 } }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.25} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            stroke="#9ca3af"
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />

                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={formatAxisValue} />
                        <Tooltip content={<CustomTooltip />} />

                        <ReferenceLine y={0} stroke="#eef2ff" strokeDasharray="3 3" />

                        <Area type="monotone" dataKey="income" name="Tổng thu" fill="url(#incomeGradient)" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="expenses" name="Tổng chi" fill="url(#expensesGradient)" stroke="#fb923c" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default SalesTrendChart;