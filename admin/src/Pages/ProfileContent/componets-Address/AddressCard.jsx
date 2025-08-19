import React from 'react';
import { useContext } from 'react';
import { Button } from '@mui/material';
import { FiEdit, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { MyContext } from '../../../App';

//================================================================================
// MAIN ADDRESS CARD COMPONENT
//================================================================================

/**
 * @component AddressCard
 * @description Hiển thị thông tin của một địa chỉ giao hàng trong một thẻ (card),
 * kèm theo các hành động như sửa, xóa, và đặt làm mặc định.
 * @param {object} props - Props cho component.
 * @param {object} props.address - Đối tượng chứa thông tin địa chỉ.
 * @param {boolean} props.isDefault - Cờ cho biết đây có phải là địa chỉ mặc định hay không.
 * @param {Function} props.onEdit - Callback được gọi khi nhấn nút "Sửa".
 * @param {Function} props.onDelete - Callback được gọi khi nhấn nút "Xóa".
 * @param {Function} props.onSetDefault - Callback được gọi khi nhấn nút "Đặt làm mặc định".
 */
const AddressCard = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
    // --- Hooks & Logic ---
    const context = useContext(MyContext);
    const userName = context?.userData?.name;

    // Lấy tên hiển thị: ưu tiên tên riêng của địa chỉ, nếu không có thì dùng tên người dùng
    const displayName = address.name || userName || "Địa chỉ";

    // --- Render ---
    return (
        <div
            className={`p-6 rounded-2xl transition-all duration-300 ease-in-out flex flex-col ${isDefault ? 'bg-indigo-50 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300'}`}
        >
            {/* Phần thông tin chính */}
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-800">{displayName}</h3>
                    {/* Hiển thị tag "Mặc định" nếu isDefault là true */}
                    {isDefault && (
                        <div className="flex items-center gap-1.5 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            <FiCheckCircle size={14} />
                            <span>Mặc định</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                    <p>
                        <span className="font-medium text-gray-500 w-20 inline-block">Địa chỉ:</span>
                        {`${address.address_line}, ${address.state}, ${address.city}`}
                    </p>
                    {address.mobile &&
                        <p>
                            <span className="font-medium text-gray-500 w-20 inline-block">Điện thoại:</span>
                            {address.mobile}
                        </p>
                    }
                </div>
            </div>

            {/* Phần các nút hành động */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button onClick={() => onEdit(address)} variant="outlined" color="inherit" size="small" startIcon={<FiEdit size={14} />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Sửa
                    </Button>
                    <Button onClick={() => onDelete(address._id)} variant="outlined" color="error" size="small" startIcon={<FiTrash2 size={14} />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Xóa
                    </Button>
                </div>

                {/* Chỉ hiển thị nút "Đặt làm mặc định" nếu đây không phải là địa chỉ mặc định */}
                {!isDefault && (
                    <Button onClick={() => onSetDefault(address)} variant="outlined" color="primary" size="small" sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Đặt làm mặc định
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AddressCard;