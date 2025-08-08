import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiShoppingBag } from 'react-icons/fi';

const EmptyCart = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* ... Gradients ... */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="text-center bg-white/50 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-lg border border-white/20 relative z-10">
                <FiShoppingBag className="mx-auto text-gray-400" size={80} />
                <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Shopping Bag is Empty</h2>
                <p className="mt-2 text-gray-500 max-w-sm">
                    Let's find something amazing for you!
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
                    Start Shopping
                </Button>
            </div>
        </div>
    );
};

export default EmptyCart;