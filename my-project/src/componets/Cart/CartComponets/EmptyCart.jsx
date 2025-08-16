import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiShoppingBag } from 'react-icons/fi';

const EmptyCart = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="text-center bg-white/50 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-lg border border-white/20 relative z-10">
                <FiShoppingBag className="mx-auto text-gray-400" size={80} />
                <h2 className="mt-6 text-2xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h2>
                <p className="mt-2 text-gray-500 max-w-sm">
                    Hãy tìm kiếm và thêm những sản phẩm tuyệt vời vào đây nhé!
                </p>
                <Button
                    component={Link}
                    to="/product-list"
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4,
                        borderRadius: '50px',
                        px: 5,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        boxShadow: 'lg'
                    }}
                >
                    Bắt đầu mua sắm
                </Button>
            </div>
        </div>
    );
};

export default EmptyCart;