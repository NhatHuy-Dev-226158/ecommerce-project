import React from 'react';
import { FaAward } from "react-icons/fa6";

// --- DỮ LIỆU MẪU ---
const categories = [
    { rank: 1, name: 'Rau củ & Trái cây', sales: 1120000, },
    { rank: 2, name: 'Hải sản tươi sống', sales: 1100000 },
    { rank: 3, name: 'Thịt & Gia cầm', sales: 940000 },
    { rank: 4, name: 'Đồ uống & Giải khát', sales: 720000 },
    { rank: 5, name: 'Hàng tiêu dùng', sales: 400000 },
    { rank: 6, name: 'Quần áo & Phụ kiện', sales: 360000, },
];
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount);

// --- CÁC COMPONENT CON ---
//Top 3
const Medal = ({ rank }) => {
    const rankConfig = {
        1: { color: 'text-yellow-400', icon: <FaAward /> },
        2: { color: 'text-gray-400', icon: <FaAward /> },
        3: { color: 'text-orange-400', icon: <FaAward /> },
    };
    if (rank > 3) {
        return <span className="font-bold text-base text-gray-400 w-8 text-center">#{rank}</span>;
    }
    const config = rankConfig[rank];
    return <span className={`text-2xl w-8 text-center ${config.color}`}>{config.icon}</span>;
};

// Thanh tiến trình
const ProgressBar = ({ sales, maxSales }) => {
    const progress = (sales / maxSales) * 100;
    return (
        <div className="w-full bg-gray-200/70 rounded-full h-1.5 mt-2">
            <div
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};


// === COMPONENT CHÍNH ===
const CategoryRanking = () => {
    // Tìm doanh số cao nhất
    const maxSales = Math.max(...categories.map(c => c.sales));

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 h-full">
            <h3 className="font-[700] text-xl text-gray-900 mb-5">
                Bảng xếp hạng Danh mục
            </h3>
            <div className="space-y-4">
                {categories.map(cat => (
                    <div key={cat.rank} className="grid grid-cols-12 gap-2 items-center">
                        {/* Cột trái: Rank và Tên */}
                        <div className="col-span-6 flex items-center gap-2">
                            <Medal rank={cat.rank} />
                            <p className="font-semibold whitespace-nowrap text-sm text-gray-800">{cat.name}</p>
                        </div>
                        {/* Cột phải: Tag và Doanh số */}
                        <div className="col-span-6 flex items-center justify-end gap-3">
                            <p className="font-bold text-sm text-indigo-600 w-28 text-right">{formatCurrency(cat.sales)} đ</p>
                        </div>
                        {/* Thanh progress bar chiếm toàn bộ 12 cột */}
                        <div className="col-span-12">
                            <ProgressBar sales={cat.sales} maxSales={maxSales} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryRanking;