import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import toast from 'react-hot-toast';

// --- Material-UI & Icon Imports ---
import { Box, Button as MuiButton, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { FiUserPlus } from "react-icons/fi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

//================================================================================
// MAIN REGISTER COMPONENT
//================================================================================

/**
 * @component Register
 * @description Trang đăng ký tài khoản mới cho Admin hoặc Staff.
 */
const Register = () => {
    // --- Hooks & State ---
    const navigate = useNavigate();
    const context = useContext(MyContext);
    const [isShowPassWord, setIsShowPassWord] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '', email: '', password: '', role: ''
    });

    // --- Event Handlers ---

    // Cập nhật state của form khi người dùng nhập liệu
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };

    // Xử lý logic khi submit form đăng ký
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { name, email, password, role } = formFields;

        // Validation cơ bản
        if (!name || !email || !password || !role) {
            return context.openAlerBox("error", "Vui lòng điền đầy đủ các trường bắt buộc.");
        }

        setIsLoading(true);
        try {
            const result = await postData("/api/user/register", formFields);

            if (result.success) {
                toast.success(`Tạo tài khoản ${role} thành công! Vui lòng xác thực email.`);
                // Lưu email để trang xác thực có thể sử dụng
                localStorage.setItem("userEmail", formFields.email);
                navigate('/login'); // Chuyển hướng sau khi đăng ký thành công
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            context.openAlerBox("error", error.message || "Tạo tài khoản thất bại.");
        } finally {
            setIsLoading(false);
        }
    };


    // --- Render ---
    return (
        <section className='w-full min-h-screen flex items-center justify-center p-4 bg-gray-100'>
            {/* Ảnh nền */}
            <img
                src="/pexels-apasaric-325185.jpg"
                alt="Abstract background"
                className='w-full h-full fixed top-0 left-0 object-cover -z-10 opacity-50'
            />

            <Paper
                elevation={4}
                sx={{
                    width: '100%', maxWidth: '500px', borderRadius: 4, p: { xs: 3, sm: 5 },
                    background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
            >
                {/* Header của form */}
                <Box className="text-center mb-6">
                    <div className="py-2 w-full flex items-center justify-center">
                        <Link to='/'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dash_%28cryptocurrency%29_logo.svg/1024px-Dash_%28cryptocurrency%29_logo.svg.png" className='w-[160px]' alt="Logo" /></Link>
                    </div>
                    <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
                        Tạo tài khoản mới
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Thêm nhân viên hoặc quản trị viên vào hệ thống.
                    </Typography>
                </Box>

                {/* Form đăng ký */}
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-800">Họ và tên</label>
                            <input type="text" id="name" name="name" value={formFields.name} onChange={onChangeInput} disabled={isLoading} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition" placeholder="Nguyễn Văn A" required />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">Email</label>
                            <input type="email" id="email" name="email" value={formFields.email} onChange={onChangeInput} disabled={isLoading} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition" placeholder="nhanvien@example.com" required />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">Mật khẩu</label>
                            <div className="relative w-full">
                                <input type={isShowPassWord ? 'text' : 'password'} id="password" name="password" value={formFields.password} onChange={onChangeInput} disabled={isLoading} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition" required />
                                <MuiButton className='!absolute top-1/2 -translate-y-1/2 right-2 !rounded-full !w-9 !h-9 !min-w-0 !text-gray-600' onClick={() => setIsShowPassWord(!isShowPassWord)}>
                                    {isShowPassWord ? <IoIosEye size={22} /> : <IoIosEyeOff size={22} />}
                                </MuiButton>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-800">Vai trò</label>
                            <select id="role" name="role" value={formFields.role} onChange={onChangeInput} disabled={isLoading} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition" required>
                                <option value="">Chọn một vai trò</option>
                                <option value="ADMIN">Quản trị viên (Admin)</option>
                                <option value="STAFF">Nhân viên (Staff)</option>
                            </select>
                        </Grid>
                    </Grid>

                    {/* Nút submit và liên kết */}
                    <Box mt={4}>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-gray-700 to-gray-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200">
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : <><FiUserPlus className='text-[17px]' /><span>Tạo tài khoản</span></>}
                        </button>
                        <p className='text-sm text-center text-gray-600 !mt-3'>
                            Đã có tài khoản?{' '}
                            <Link to='/login' className=' link font-medium text-blue-600 hover:underline'>
                                Đăng nhập
                            </Link>
                        </p>
                    </Box>
                </form>
            </Paper>
        </section>
    );
};

export default Register;