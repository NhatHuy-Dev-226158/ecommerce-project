import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Box, Button, Button as MuiButton } from '@mui/material';
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

// Component cho các nút Đăng nhập Social
const SocialButton = ({ onClick, loading, icon, children }) => (
    <Button
        fullWidth
        onClick={onClick}
        endIcon={icon}
        loading={loading}
        loadingPosition="end"
        variant="outlined"
        sx={{
            textTransform: 'none',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            color: 'text.primary',
            '&:hover': {
                borderColor: 'text.primary',
                bgcolor: 'rgba(0, 0, 0, 0.04)'
            },
        }}
    >
        {children}
    </Button>
);


// === COMPONENT CHÍNH ===
const Login = () => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    const [isShowPassWord, setIsShowPassWord] = useState(false);

    function handleClickGoogle() { setLoadingGoogle(true); }
    function handleClickFacebook() { setLoadingFacebook(true); }

    return (
        <section className='w-full min-h-screen flex items-center justify-center p-4'>
            <img
                src="pexels-apasaric-325185.jpg"
                alt="Abstract background"
                className='w-full h-full fixed top-0 left-0 object-cover -z-10'
            />

            <header className='w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50'>
                <Link to='/'>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dash_%28cryptocurrency%29_logo.svg/1024px-Dash_%28cryptocurrency%29_logo.svg.png" alt="Dash Logo" className='w-24 h-auto' />
                </Link>
                <div className="flex items-center gap-2">
                    <NavLink
                        to='/login'
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-full text-sm px-5 py-2 text-center transition-all duration-200 ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800/50' : ''
                            }`
                        }
                    >
                        <FiLogIn className='text-[18px]' /> Đăng nhập
                    </NavLink>

                    <NavLink
                        to='/register'
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2 text-center transition-all duration-200 ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800/50' : ''
                            }`
                        }
                    >
                        <FiUserPlus className='text-[18px]' /> Đăng ký
                    </NavLink>
                </div>
            </header>

            <Box
                className="loginBox w-full max-w-lg rounded-2xl shadow-xl p-8 space-y-6"
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <div className="text-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dash_%28cryptocurrency%29_logo.svg/1024px-Dash_%28cryptocurrency%29_logo.svg.png" alt="Dash Logo" className='mx-auto w-28 h-auto mb-2' />
                    <h1 className='text-2xl font-bold text-gray-800'>Chào mừng trở lại!</h1>
                    <p className='text-sm text-gray-600'>Đăng nhập bằng thông tin của bạn.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4">
                    <SocialButton onClick={handleClickGoogle} loading={loadingGoogle} icon={<FcGoogle />}>
                        Với Google
                    </SocialButton>
                    <SocialButton onClick={handleClickFacebook} loading={loadingFacebook} icon={<FaFacebook color="#1877F2" />}>
                        Với Facebook
                    </SocialButton>
                </div>

                <div className="flex items-center text-center text-xs text-gray-500 uppercase after:flex-1 after:border-b after:border-gray-300 after:ml-4 before:flex-1 before:border-b before:border-gray-300 before:mr-4">
                    Hoặc
                </div>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">Email</label>
                        <input
                            type="email" id="email"
                            className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
                            placeholder="name@example.com" required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">Mật khẩu</label>
                        <div className="relative w-full">
                            <input
                                type={isShowPassWord ? 'text' : 'password'}
                                id="password"
                                className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
                                required
                            />
                            <MuiButton
                                className='!absolute top-1/2 -translate-y-1/2 right-2 !rounded-full !w-9 !h-9 !min-w-0 !text-gray-600'
                                onClick={() => setIsShowPassWord(!isShowPassWord)}
                            >
                                {isShowPassWord ? <IoIosEye size={22} /> : <IoIosEyeOff size={22} />}
                            </MuiButton>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 cursor-pointer">Ghi nhớ tôi</label>
                        </div>
                        <Link to='/forgot-password' className="text-sm font-medium text-blue-600 hover:underline">Quên mật khẩu?</Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200"
                    >
                        <FiLogIn className='text-[17px]' />
                        Đăng Nhập
                    </button>
                </form>
            </Box>
        </section>
    );
};

export default Login;