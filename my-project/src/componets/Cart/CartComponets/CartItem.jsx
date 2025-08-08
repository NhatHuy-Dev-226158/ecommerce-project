import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonGroup, IconButton } from '@mui/material';
import { FiTrash2, FiPlus, FiMinus, FiEdit2 } from 'react-icons/fi';
import Button from '@mui/material/Button';

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CartItem = ({ item, onUpdate, onRemove, onEdit }) => {
    return (
        // Thẻ item chính với hiệu ứng hover
        <div className="flex items-start gap-4 p-4 mb-3 bg-white/50 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Ảnh sản phẩm */}
            <Link to={`/product-detail/${item.id}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border border-gray-200" />
            </Link>

            {/* Thông tin sản phẩm */}
            <div className="flex-grow flex flex-col h-full">
                <Link to={`/product-detail/${item.id}`} className="block text-base md:text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors leading-tight">
                    {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                    Size: <span className="font-medium text-gray-700">{item.attributes.size}</span> /
                    Color: <span className="font-medium text-gray-700">{item.attributes.color}</span>
                </p>

                {/* Đẩy bộ nút tăng/giảm số lượng xuống dưới */}
                <div className="mt-auto pt-2">
                    <ButtonGroup variant="outlined" size="small" sx={{ height: '32px' }}>
                        <Button onClick={() => onUpdate(item.id, item.quantity - 1)} aria-label="decrease quantity"><FiMinus /></Button>
                        <Button disabled sx={{ width: '40px', '&.Mui-disabled': { color: 'text.primary', borderColor: 'rgba(0, 0, 0, 0.23)' } }}>{item.quantity}</Button>
                        <Button onClick={() => onUpdate(item.id, item.quantity + 1)} aria-label="increase quantity"><FiPlus /></Button>
                    </ButtonGroup>
                </div>
            </div>

            {/* Giá và nút hành động */}
            <div className="flex flex-col items-end justify-between h-full ml-2">
                <p className="font-bold text-lg !text-indigo-600">{formatCurrency(item.price * item.quantity)}</p>
                <div className='mt-auto'>
                    <IconButton onClick={onEdit} size="small" title="Edit item" sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}>
                        <FiEdit2 />
                    </IconButton>
                    <IconButton onClick={() => onRemove(item.id)} size="small" title="Remove item" sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light' } }}>
                        <FiTrash2 />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default CartItem;