import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonGroup, IconButton } from '@mui/material';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import Button from '@mui/material/Button';

// Hàm tiện ích
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CartItem = ({ item, onUpdate, onRemove }) => {
    return (
        <div className="flex items-start gap-4 p-4 mb-3 bg-white/50 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link to={`/product-detail/${item._id}`} className="flex-shrink-0">
                <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border border-gray-200"
                />
            </Link>

            <div className="flex-grow flex flex-col h-full">
                <Link to={`/product-detail/${item._id}`} className="block text-base md:text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors leading-tight">
                    {item.name}
                </Link>

                <div className="mt-auto pt-2">
                    <ButtonGroup variant="outlined" size="small" sx={{ height: '32px' }}>
                        <Button onClick={() => onUpdate(item.cartItemId, item.quantity - 1)} aria-label="decrease quantity">
                            <FiMinus />
                        </Button>
                        <Button disabled sx={{ width: '40px', '&.Mui-disabled': { color: 'text.primary', borderColor: 'rgba(0, 0, 0, 0.23)' } }}>
                            {item.quantity}
                        </Button>
                        <Button onClick={() => onUpdate(item.cartItemId, item.quantity + 1)} aria-label="increase quantity">
                            <FiPlus />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-full ml-2">
                <p className="font-bold text-lg !text-indigo-600">
                    {formatCurrency(item.price * item.quantity)}
                </p>
                <div className='mt-auto'>
                    <IconButton onClick={() => onRemove(item.cartItemId)} size="small" title="Remove item" sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light', color: 'white' } }}>
                        <FiTrash2 />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default CartItem;