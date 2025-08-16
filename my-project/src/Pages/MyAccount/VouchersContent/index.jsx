import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { FiTag, FiPlus, FiAlertTriangle, FiCheck, FiCopy, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- DỮ LIỆU TĨNH ---
const allVouchers = [
    { id: 1, code: 'AURA100K', type: 'fixed', value: 100000, title: 'Giảm 100K', description: 'Cho đơn hàng từ 1.000.000đ', expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)), status: 'active', gradient: 'from-purple-500 to-indigo-600' },
    { id: 2, code: 'FREESHIPMAX', type: 'shipping', value: 0, title: 'Miễn Phí Ship', description: 'Giảm tối đa 30.000đ phí vận chuyển', expiryDate: new Date(new Date().setDate(new Date().getDate() + 15)), status: 'active', gradient: 'from-green-500 to-teal-600' },
    { id: 3, code: 'BIGSALE50', type: 'percentage', value: 50, title: 'Giảm 50%', description: 'Giảm tối đa 50.000đ', expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)), status: 'active', gradient: 'from-orange-500 to-red-600' },
    { id: 4, code: 'WELCOME20', type: 'percentage', value: 20, title: 'Giảm 20%', description: 'Dành cho khách hàng mới', expiryDate: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'expired', gradient: 'from-gray-400 to-gray-500' },
    { id: 5, code: 'BLACKFRIDAY', type: 'fixed', value: 200000, title: 'Giảm 200K', description: 'Cho đơn hàng từ 2.000.000đ', expiryDate: new Date(new Date().setDate(new Date().getDate() - 10)), status: 'used', gradient: 'from-gray-400 to-gray-500' },
];

const formatExpiryDate = (date) => `HSD: ${new Intl.DateTimeFormat('vi-VN').format(date)}`;
const isExpiringSoon = (date) => (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) < 4;

// --- COMPONENT CON CHO CARD VOUCHER (THIẾT KẾ LẠI HOÀN TOÀN) ---
const VoucherCard = ({ voucher }) => {
    const [copied, setCopied] = useState(false);

    const isUsedOrExpired = voucher.status !== 'active';
    const expiringSoon = isExpiringSoon(voucher.expiryDate) && !isUsedOrExpired;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(voucher.code);
        setCopied(true);
        toast.success(`Đã sao chép mã: ${voucher.code}`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`relative rounded-xl text-white overflow-hidden transition-all duration-300 transform-gpu ${isUsedOrExpired ? 'saturate-50 opacity-60' : 'shadow-lg hover:shadow-2xl hover:-translate-y-1'}`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${voucher.gradient}`}></div>
            {/* Lớp Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-20"></div>

            <div className="relative z-10 p-5 flex flex-col justify-between h-48">
                {/* Phần trên: Tiêu đề và Mô tả */}
                <div>
                    <h3 className="text-2xl font-bold tracking-wider">{voucher.title}</h3>
                    <p className="text-sm opacity-90">{voucher.description}</p>
                </div>
                {/* Phần dưới: Mã, HSD và Nút dùng */}
                <div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full cursor-pointer" onClick={handleCopyCode}>
                            <span className="font-mono font-semibold text-sm">{voucher.code}</span>
                            <button className="text-white/80 hover:text-white">
                                {copied ? <FiCheck /> : <FiCopy size={14} />}
                            </button>
                        </div>
                        <Button
                            component={Link} to="/product-list" variant="contained" size="small"
                            disabled={isUsedOrExpired}
                            sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' }, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Dùng ngay
                        </Button>
                    </div>
                    <p className={`mt-2 text-xs flex items-center ${expiringSoon ? 'font-bold text-yellow-300' : 'opacity-80'}`}>
                        {expiringSoon && <FiAlertTriangle className="mr-1" />}
                        <span>{formatExpiryDate(voucher.expiryDate)}</span>
                    </p>
                </div>
            </div>

            {/* Tag trạng thái */}
            {isUsedOrExpired && (
                <div className="absolute top-3 right-3 text-xs font-bold uppercase px-2 py-1 rounded bg-black/50">
                    {voucher.status === 'used' ? 'Đã dùng' : 'Hết hạn'}
                </div>
            )}
        </div>
    );
};


// === COMPONENT CHÍNH ---
const VouchersContent = () => {
    // Logic state và filter/sort giữ nguyên như phiên bản trước
    const [activeTab, setActiveTab] = useState('Tất cả');
    // ...

    const tabs = ['Tất cả', 'Giảm giá', 'Freeship', 'Sắp hết hạn', 'Đã sử dụng'];
    const filteredVouchers = useMemo(() => {
        /* ... logic filter y hệt phiên bản trước ... */
        switch (activeTab) {
            case 'Giảm giá': return allVouchers.filter(v => v.type === 'fixed' || v.type === 'percentage');
            case 'Freeship': return allVouchers.filter(v => v.type === 'shipping');
            case 'Sắp hết hạn':
                const now = new Date();
                const fourDaysFromNow = new Date(new Date().setDate(now.getDate() + 4));
                return allVouchers.filter(v => v.expiryDate < fourDaysFromNow && v.status === 'active');
            case 'Đã sử dụng': return allVouchers.filter(v => v.status === 'used' || v.status === 'expired');
            case 'Tất cả':
            default: return allVouchers;
        }
    }, [activeTab]);


    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Ví Voucher(Chưa phát triển)</h2>
                <p className="text-gray-500 mt-1">Săn và lưu các mã giảm giá tốt nhất cho lần mua sắm tiếp theo.</p>
            </div>

            {/* Ô nhập mã */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <label className="text-md font-semibold text-gray-800">Tìm voucher</label>
                <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="Nhập mã voucher để lưu vào ví" className="w-full bg-gray-100 border-gray-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    <Button variant="contained" startIcon={<FiSave />} sx={{ px: 3 }}>Save</Button>
                </div>
            </div>

            {/* Tab Lọc */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Danh sách voucher */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVouchers.length > 0 ? (
                    filteredVouchers.map(voucher => (
                        <VoucherCard key={voucher.id} voucher={voucher} />
                    ))
                ) : (
                    <div className="lg:col-span-2 text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                        <FiTag className="mx-auto text-5xl text-gray-400 mb-4" />
                        <h3 className="font-bold text-xl">Không tìm thấy voucher</h3>
                        <p className="text-gray-500">Voucher của bạn sẽ xuất hiện ở đây.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VouchersContent;