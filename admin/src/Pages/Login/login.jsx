import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import toast from 'react-hot-toast';

// --- Material-UI & Icon Imports ---
import { Box, Button as MuiButton, CircularProgress } from '@mui/material';
import { FiLogIn } from "react-icons/fi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

//================================================================================
// MAIN LOGIN COMPONENT
//================================================================================

/**
 * @component Login
 * @description Trang đăng nhập dành cho quản trị viên.
 */
const Login = () => {
    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassWord, setIsShowPassWord] = useState(false);
    const [formFields, setFormFields] = useState({ email: '', password: '' });

    // --- Hooks ---
    const context = useContext(MyContext);
    const navigate = useNavigate();

    // --- Event Handlers ---

    // Cập nhật state của form khi người dùng nhập liệu
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };

    // Xử lý logic khi submit form đăng nhập
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = formFields;

        if (!email || !password) {
            return context.openAlerBox("error", "Vui lòng điền đầy đủ email và mật khẩu.");
        }

        setIsLoading(true);
        try {
            // Gọi API đăng nhập dành riêng cho Admin
            const result = await postData("/api/user/admin-login", formFields);

            if (result.success) {
                toast.success("Đăng nhập quản trị thành công!");

                const { accesstoken, user } = result.data;

                // Lưu token, cập nhật context và điều hướng
                localStorage.setItem("accesstoken", accesstoken);
                context.setIslogin(true);
                context.setUserData(user);
                navigate('/'); // Luôn chuyển hướng đến dashboard admin

            } else {
                throw new Error(result.message || "Email, mật khẩu không đúng hoặc bạn không có quyền truy cập.");
            }
        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---
    return (
        <section className='w-full min-h-screen flex items-center justify-center p-4 bg-gray-100'>
            <Box
                className="loginBox w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6"
                sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
            >
                {/* Phần Header của form */}
                <div className="text-center">
                    <div className="py-2 w-full flex items-center justify-center">
                        <Link to='/'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dash_%28cryptocurrency%29_logo.svg/1024px-Dash_%28cryptocurrency%29_logo.svg.png" className='w-[160px]' alt="Logo" />
                        </Link>
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800'>Trang Quản Trị</h1>
                    <p className='text-sm text-gray-600'>Vui lòng đăng nhập để tiếp tục.</p>
                </div>

                {/* Form đăng nhập */}
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">Email</label>
                        <input
                            type="email" id="email" name='email'
                            value={formFields.email} onChange={onChangeInput} disabled={isLoading}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
                            placeholder="admin@example.com" required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">Mật khẩu</label>
                        <div className="relative w-full">
                            <input
                                type={isShowPassWord ? 'text' : 'password'} id="password" name='password'
                                value={formFields.password} onChange={onChangeInput} disabled={isLoading}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-gray-700 to-gray-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200"
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : <><FiLogIn className='text-[17px]' /><span>Đăng nhập</span></>}
                    </button>

                    <p className='text-sm text-center text-gray-600'>
                        Bạn chưa có tài khoản?{' '}
                        <Link to='/register' className='link font-medium text-blue-600 hover:underline'>
                            Đăng ký ngay
                        </Link>
                    </p>
                </form>
            </Box>
        </section>
    );
};

export default Login;