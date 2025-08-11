import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Box, Button as MuiButton, Grid, Paper, Typography } from '@mui/material';
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import { useContext } from 'react';
import { MyContext } from '../../App';

const Register = () => {
    const history = useNavigate();
    const context = useContext(MyContext);

    const [isShowPassWord, setIsShowPassWord] = useState(false);
    const [isShowConfirmPassWord, setIsShowConfirmPassWord] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        birthday: '',
        gender: ''
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const { name, email, mobile, password } = formFields;
        if (!name && !email && !mobile && !password) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin để đăng ký.");
            setIsLoading(false);
            return;
        }
        if (!name) {
            context.openAlerBox("error", "Bạn chưa nhập họ và tên.");
            setIsLoading(false);
            return;
        }
        if (!email) {
            context.openAlerBox("error", "Bạn chưa nhập địa chỉ email.");
            setIsLoading(false);
            return;
        }
        if (!mobile) {
            context.openAlerBox("error", "Bạn chưa nhập số điện thoại.");
            setIsLoading(false);
            return;
        }
        if (!password) {
            context.openAlerBox("error", "Bạn chưa nhập mật khẩu.");
            setIsLoading(false);
            return;
        }


        postData("/api/user/register", formFields).then((res) => {
            console.log(res);
            if (res?.error !== true) {
                setIsLoading(false);
                context.openAlerBox("success", res?.message);
                localStorage.setItem("userEmail", formFields.email)
                setFormFields({
                    name: '',
                    mobile: '',
                    email: '',
                    password: '',
                    birthday: '',
                    gender: ''
                })
                history("/verify")
            } else {
                context.openAlerBox("error", res?.message);
                setIsLoading(false);
            }
        });
    };
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


            <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    maxWidth: '900px',
                    borderRadius: 4,
                    p: { xs: 3, sm: 5 },
                    mt: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <Box className="text-center mb-6">
                    <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">Tạo tài khoản Nhân viên / Quản trị</Typography>
                </Box>

                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5}>
                        {/* Dòng 1: Họ tên & Email */}
                        <Grid item xs={12} sm={6}>
                            <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-800">Họ và tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="name"
                                value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition"
                                placeholder="Nguyễn Văn A"
                                required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formFields.email}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition"
                                placeholder="nhanvien@example.com"
                                required />
                        </Grid>

                        {/* Dòng 2: Số điện thoại & Ngày sinh*/}
                        <Grid item xs={12} sm={6}>
                            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-800">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phone"
                                name="mobile"
                                value={formFields.mobile}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition"
                                placeholder="09xxxxxxxx"
                                required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <label htmlFor="dob" className="block mb-1 text-sm font-medium text-gray-800">Ngày sinh</label>
                            <input
                                type="date"
                                id="dob"
                                name="birthday"
                                value={formFields.birthday}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition"
                                required />
                        </Grid>

                        {/* Dòng 3: Giới tính & Vai trò */}
                        <Grid item xs={12} sm={6}>
                            <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-800">Giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formFields.gender}
                                onChange={onChangeInput}
                                disabled={isLoading}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition"
                                required>
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option></select>
                        </Grid>
                        <Grid item xs={12} sm={6}><label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-800">Vai trò</label><select id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition" required><option value="">Chọn một vai trò để phân quyền</option><option value="admin">Quản trị viên (Admin)</option><option value="editor">Biên tập viên (Editor)</option><option value="staff">Nhân viên (Staff)</option></select></Grid>

                        {/* Dòng 4: Mật khẩu & Xác nhận */}
                        <Grid item xs={12} sm={6}>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">Mật khẩu</label>
                            <div className="relative w-full">
                                <input type={isShowPassWord ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formFields.password}
                                    disabled={isLoading === true ? true : false}
                                    onChange={onChangeInput}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition"
                                    required />
                                <MuiButton className='!absolute top-1/2 -translate-y-1/2 right-1 !rounded-full !w-9 !h-9 !min-w-0 !text-gray-600' onClick={() => setIsShowPassWord(!isShowPassWord)}>{isShowPassWord ? <IoIosEye size={22} /> : <IoIosEyeOff size={22} />}
                                </MuiButton>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6}><label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-800">Địa chỉ</label><input type="text" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition" placeholder="Tên đường, phường/xã, quận/huyện, tỉnh/thành phố" required /></Grid>
                    </Grid>

                    <Box mt={4}>
                        <button
                            type="submit"
                            disabled={isLoading === true ? true : false}
                            className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200">
                            <FiUserPlus className='text-[17px]' />
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : ' Tạo tài khoản'}
                        </button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
                        Quay lại trang {' '}
                        <Link to="/login" className="font-medium text-purple-600 hover:underline">
                            Đăng nhập
                        </Link>
                    </Typography>
                </form>
            </Paper>
        </section>
    );
};

export default Register;