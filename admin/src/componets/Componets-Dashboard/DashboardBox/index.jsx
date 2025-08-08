import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
// Import các icon lớn, có đường nét dày hơn để phù hợp với phong cách mới
import { Wallet, ReceiptText, Users, AreaChart } from 'lucide-react';
import CountUp from 'react-countup'; // Thêm hiệu ứng số đếm để sinh động hơn

// --- CẤU HÌNH DỮ LIỆU VỚI MÀU SẮC RIÊNG ---
const cardData = [
    {
        title: 'Doanh thu',
        value: 76000000, // Sử dụng số để CountUp hoạt động
        prefix: '',
        suffix: ' đ',
        percentage: 15,
        isPositive: true,
        icon: <Wallet size={28} />,
        gradient: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-500'
    },
    {
        title: 'Số hóa đơn',
        value: 972,
        prefix: '',
        suffix: '',
        percentage: 4,
        isPositive: true,
        icon: <ReceiptText size={28} />,
        gradient: 'from-emerald-500 to-green-600',
        textColor: 'text-emerald-500'
    },
    {
        title: 'Lượt khách hàng',
        value: 3424,
        prefix: '',
        suffix: '',
        percentage: 17,
        isPositive: true,
        icon: <Users size={28} />,
        gradient: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-500'
    },
    {
        title: 'Giá trị đơn TB',
        value: 796000,
        prefix: '',
        suffix: ' đ',
        percentage: 0.3,
        isPositive: false,
        icon: <AreaChart size={28} />,
        gradient: 'from-rose-500 to-red-600',
        textColor: 'text-rose-500'
    },
];

// --- COMPONENT STAT CARD DUY NHẤT ---
const StatCard = ({ title, value, prefix, suffix, percentage, isPositive, icon, gradient, textColor }) => (
    // Card với hiệu ứng kính mờ, đổ bóng và viền phát sáng khi hover
    <div className="relative p-6 bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg 
                    hover:shadow-indigo-500/20 hover:border-white/50 transition-all duration-300">

        {/* Lớp nền gradient để tạo hiệu ứng màu sắc */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} rounded-t-2xl`}></div>

        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl  font-extrabold text-gray-900 mt-2">
                    <CountUp
                        start={0}
                        end={value}
                        duration={2.5}
                        separator="."
                        prefix={prefix}
                        suffix={suffix}
                    />
                </p>
            </div>
            {/* Icon với nền màu tương ứng */}
            <div className={`p-3 rounded-xl bg-gradient-to-tr ${gradient} text-white shadow-md`}>
                {icon}
            </div>
        </div>

        {percentage !== null && (
            <div className="flex items-center mt-4 text-sm">
                <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <FiArrowUp size={12} className="mr-1" /> : <FiArrowDown size={12} className="mr-1" />}
                    {percentage}%
                </span>
                <span className="ml-2 text-gray-500">so với tháng trước</span>
            </div>
        )}
    </div>
);

// --- COMPONENT LẮP RÁP CÁC CARD LẠI ---
const StatsGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
            <StatCard
                key={index}
                title={card.title}
                value={card.value}
                prefix={card.prefix}
                suffix={card.suffix}
                percentage={card.percentage}
                isPositive={card.isPositive}
                icon={card.icon}
                gradient={card.gradient}
                textColor={card.textColor}
            />
        ))}
    </div>
);

export default StatsGrid;