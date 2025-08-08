import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setIsShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // === HÀM SUBMIT ĐÃ THÊM LOGIC KIỂM TRA ===
    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // 1. Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        // 2. (Tùy chọn) Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        // 3. Nếu mọi thứ hợp lệ, tiếp tục xử lý
        setIsLoading(true);
        setTimeout(() => {
            console.log({ email, password });
            setIsLoading(false);
            // Giả sử thành công, có thể điều hướng người dùng
            navigate('/login');
            alert('Mật khẩu đã được cập nhật!');
        }, 2000);
    }

    // === ANIMATION VARIANTS ===
    const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <section className='section flex items-center justify-center min-h-[80vh] bg-[#f7f8fc] py-10 overflow-hidden'>
            <div className="container">
                <motion.div
                    className="card shadow-lg w-full max-w-sm m-auto rounded-lg bg-white p-8"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h3 variants={itemVariants} className='text-center text-2xl text-gray-800 font-bold mb-6'>
                        Quên Mật Khẩu
                    </motion.h3>

                    <form className='w-full' onSubmit={handleSubmit}>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mb-4"
                                >
                                    <Alert severity="error">{error}</Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField
                                id="email" type='email' name='email' label="Email"
                                variant="outlined" className='w-full' value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-4">
                            <TextField
                                id="password" type={isShowPassword ? 'text' : 'password'}
                                label="Mật khẩu mới" name='password' variant="outlined"
                                className='w-full' value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {isShowPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-4">
                            <TextField
                                id="confirm-password"
                                type={isShowConfirmPassword ? 'text' : 'password'}
                                label="Xác nhận mật khẩu mới"
                                name='confirm-password'
                                variant="outlined"
                                className='w-full'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                error={!!error && password !== confirmPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {isShowConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-full mb-4">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading}
                                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Cập Nhật'}
                            </Button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm">Hoặc</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-full mb-4">
                            <Button
                                variant="outlined"
                                fullWidth
                                disabled={isLoading}
                                startIcon={<FcGoogle />}
                                sx={{ py: 1.5, color: 'text.primary', borderColor: 'grey.400' }}
                            >
                                <span className="font-medium">Tiếp tục với Google</span>
                            </Button>
                        </motion.div>

                        <motion.p variants={itemVariants} className='text-sm text-center text-gray-600'>
                            Nhớ mật khẩu?{' '}
                            <Link to='/login' className='link font-medium text-blue-600 hover:underline'>
                                Đăng nhập
                            </Link>
                        </motion.p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

export default ForgotPassword;