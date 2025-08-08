import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material'; // Import Menu
import { FiStar, FiMessageSquare, FiAward, FiMoreHorizontal, FiFileText, FiPhoneCall } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount);

const EmployeeCard = ({ employee }) => {
    // State để quản lý Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        // Card chính với nền gradient tinh tế và đổ bóng
        <div className="relative p-6 rounded-2xl shadow-lg h-full flex flex-col
                       bg-gradient-to-br from-indigo-50 via-white to-purple-50
                       border border-gray-200/80 transition-all duration-300 hover:shadow-xl">

            {/* Nút 3 chấm ngang */}
            <div className="absolute top-4 right-4">
                <IconButton size="small" onClick={handleClick}>
                    <FiMoreHorizontal />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                            mt: 1.5,
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}><FiFileText className="mr-2" /> Xem lý lịch</MenuItem>
                    <MenuItem onClick={handleClose}><FiPhoneCall className="mr-2" /> Liên hệ</MenuItem>
                </Menu>
            </div>

            {/* Phần Header: Thông tin cá nhân */}
            <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                    <img src={employee.avatar} alt={employee.name} className="w-24 h-24 rounded-full object-cover shadow-md" />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2.5 rounded-full border-4 border-white shadow-lg">
                        <FiAward className="text-white h-6 w-6" />
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-gray-900">{employee.name}</h2>
                    <p className="text-indigo-600 font-bold">Nhân viên Ưu tú của Tháng</p>
                </div>
            </div>

            {/* Điểm mạnh & Chuyên môn */}
            <div className="mt-6 space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2"><FiStar size={16} className="text-gray-400" />Chuyên môn: <span className="font-semibold text-gray-800">{employee.specialty}</span></p>
                <p className="flex items-center gap-2"><FiMessageSquare size={16} className="text-gray-400" />Điểm mạnh: <span className="font-semibold text-gray-800">{employee.strength}</span></p>
            </div>

            {/* Phần Body: Các chỉ số hiệu suất */}
            <div className="grid grid-cols-3 gap-2 mt-6 py-4 border-y border-dashed">
                <div className="text-center px-2">
                    <p className="text-sm text-gray-500">Doanh số</p>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(employee.sales)} đ</p>
                </div>
                <div className="text-center px-2 border-x">
                    <p className="text-sm text-gray-500">Số đơn hàng</p>
                    <p className="text-xl font-bold text-gray-800">{employee.orders}</p>
                </div>
                <div className="text-center px-2">
                    <p className="text-sm text-gray-500">Đơn hàng TB</p>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(employee.avgOrderValue)} đ</p>
                </div>
            </div>

            {/* Phần Footer: Đề xuất */}
            <div className="mt-auto pt-4">
                <div className="mt-2 p-4 bg-yellow-50/50 rounded-lg text-center border border-yellow-200">
                    <div className="flex items-center justify-center gap-2 font-semibold text-sm text-yellow-700">
                        <BsLightbulb />
                        <span>Đề xuất từ hệ thống</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{employee.recommendation}</p>
                </div>
            </div>
        </div>
    );
};


export default EmployeeCard;