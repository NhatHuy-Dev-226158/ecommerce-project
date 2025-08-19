import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';

// --- Material-UI & Icon Imports ---
import { TextField, Button, IconButton, InputAdornment, CircularProgress, Alert } from '@mui/material';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

//================================================================================
// MAIN FORGOT PASSWORD COMPONENT
//================================================================================

/**
 * @component ForgotPassword
 * @description Trang cho phép người dùng đặt lại mật khẩu sau khi đã xác thực email.
 */
const ForgotPassword = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // State này chưa được dùng, nhưng có thể hữu ích sau này
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const [formFields, setFormFields] = useState({
        email: '', // Sẽ được lấy từ localStorage
        newPassword: '',
        confirmPassword: ''
    });

    // --- Logic & Effects ---

    // Effect: Lấy email đã được lưu từ bước trước khi component được mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setFormFields(prevState => ({ ...prevState, email: storedEmail }));
        } else {
            // Cảnh báo và có thể điều hướng người dùng nếu không có email
            console.warn("Không tìm thấy email để đặt lại mật khẩu.");
            navigate('/login'); // Chuyển về trang login nếu không hợp lệ
        }
    }, [navigate]);

    // Xử lý ẩn/hiện mật khẩu
    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setIsShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    // Cập nhật state của form khi người dùng nhập liệu
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };

    // Xử lý logic khi submit form
    const handleSubmit = (event) => {
        event.preventDefault();
        const { newPassword, confirmPassword } = formFields;

        // Validation phía client
        if (!newPassword || !confirmPassword) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ mật khẩu mới.");
            return;
        }
        if (newPassword !== confirmPassword) {
            context.openAlerBox("error", "Mật khẩu không khớp.");
            return;
        }

        setIsLoading(true);

        // Gọi API để reset mật khẩu
        postData(`/api/user/reset-password`, formFields)
            .then((res) => {
                if (res?.error === false) {
                    // Dọn dẹp localStorage và điều hướng khi thành công
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("actionType");
                    context.openAlerBox("success", res?.message);
                    navigate('/login');
                } else {
                    context.openAlerBox("error", res?.message);
                }
            })
            .catch(err => {
                context.openAlerBox("error", "Đã có lỗi xảy ra. Vui lòng thử lại.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    // --- Animation Variants (Framer Motion) ---
    const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    // --- Render ---
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
                        Đặt lại Mật Khẩu
                    </motion.h3>

                    <form className='w-full' onSubmit={handleSubmit} noValidate>
                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField id="email" type='email' name='email' label="Email" variant="outlined" className='w-full' value={formFields.email} disabled={true} required />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-4">
                            <TextField
                                id="newPassword" type={isShowPassword ? 'text' : 'password'}
                                label="Mật khẩu mới" name='newPassword' variant="outlined"
                                className='w-full'
                                value={formFields.newPassword}
                                onChange={onChangeInput}
                                disabled={isLoading}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                                {isShowPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-4">
                            <TextField
                                id="confirm-password" type={isShowConfirmPassword ? 'text' : 'password'}
                                label="Xác nhận mật khẩu mới" name='confirmPassword' variant="outlined"
                                className='w-full'
                                value={formFields.confirmPassword}
                                onChange={onChangeInput}
                                disabled={isLoading}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                                {isShowConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-full mb-4">
                            <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}>
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Cập Nhật'}
                            </Button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm">Hoặc</span>
                            <div className="flex-grow border-t border-gray-300"></div>
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