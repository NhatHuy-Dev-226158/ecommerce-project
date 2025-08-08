// src/componets/Dashboard/QuickActionsCard.jsx
import React from 'react';

const QuickActionsCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Hành động nhanh</h3>
        <p className="text-sm text-gray-600">Thêm sản phẩm mới hoặc tạo chương trình khuyến mãi một cách nhanh chóng.</p>
        <div className="flex gap-2 mt-4">
            <button className="flex-1 text-sm py-2 px-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">Thêm sản phẩm</button>
            <button className="flex-1 text-sm py-2 px-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">Tạo khuyến mãi</button>
        </div>
    </div>
);

export default QuickActionsCard;