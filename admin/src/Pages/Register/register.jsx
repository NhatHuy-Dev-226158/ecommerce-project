// File: src/pages/admin/CreateUserPage.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button as MuiButton, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { FiUserPlus } from "react-icons/fi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { postData } from '../../utils/api';
import { MyContext } from '../../App'; // Đảm bảo đường dẫn đúng
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [isShowPassWord, setIsShowPassWord] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        password: '',
        role: '' // Bắt đầu với role rỗng
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { name, email, password, role } = formFields;

        if (!name || !email || !password || !role) {
            return context.openAlerBox("error", "Vui lòng điền đầy đủ các trường bắt buộc.");
        }

        setIsLoading(true);
        try {
            // API endpoint vẫn là register, backend sẽ xử lý việc gán role
            const result = await postData("/api/user/register", formFields);

            if (result.success) {
                toast.success(`Tạo tài khoản ${role} thành công!`);
                // Thay vì chuyển đến trang verify, Admin sẽ được chuyển về trang quản lý người dùng
                navigate('/admin/user-management'); // Giả sử bạn có trang này
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            context.openAlerBox("error", error.message || "Tạo tài khoản thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className='w-full min-h-screen flex items-center justify-center p-4 bg-gray-100'>
            <img
                src="/pexels-apasaric-325185.jpg"
                alt="Abstract background"
                className='w-full h-full fixed top-0 left-0 object-cover -z-10 opacity-50'
            />

            <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    maxWidth: '500px', // Thu nhỏ lại cho phù hợp
                    borderRadius: 4,
                    p: { xs: 3, sm: 5 },
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
            >
                <Box className="text-center mb-6">
                    <Link to='/'>
                        <img src="/logo.jpg" alt="Logo" className='mx-auto w-32 h-auto mb-2' />
                    </Link>
                    <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
                        Tạo tài khoản mới
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Thêm nhân viên hoặc quản trị viên vào hệ thống.
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-800">Họ và tên</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formFields.name}
                                onChange={onChangeInput}
                                disabled={isLoading}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formFields.email}
                                onChange={onChangeInput}
                                disabled={isLoading}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
                                placeholder="nhanvien@example.com"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">Mật khẩu</label>
                            <div className="relative w-full">
                                <input
                                    type={isShowPassWord ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formFields.password}
                                    onChange={onChangeInput}
                                    disabled={isLoading}
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
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-800">Vai trò</label>
                            <select
                                id="role"
                                name="role"
                                value={formFields.role}
                                onChange={onChangeInput}
                                disabled={isLoading}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition"
                                required
                            >
                                <option value="">Chọn một vai trò</option>
                                <option value="ADMIN">Quản trị viên (Admin)</option>
                                <option value="STAFF">Nhân viên (Staff)</option>
                            </select>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-gray-700 to-gray-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200"
                        >
                            <FiUserPlus className='text-[17px]' />
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Tạo tài khoản'}
                        </button>
                    </Box>
                </form>
            </Paper>
        </section>
    );
};

export default Register;