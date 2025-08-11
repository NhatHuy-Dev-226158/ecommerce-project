import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { MyContext } from '../../App';
import { postData } from '../../utils/api';


const ForgotPassword = () => {
    const context = useContext(MyContext);
    const history = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setIsShowConfirmPassword((show) => !show);

    const [formFields, setFormFields] = useState({
        email: localStorage.getItem("userEmail"),
        newPassword: '',
        confirmPassword: ''
    });

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
        const { newPassword, confirmPassword } = formFields;
        if (!newPassword && !confirmPassword) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin để đăng ký.");
            setIsLoading(false);
            return;
        }
        if (!newPassword) {
            context.openAlerBox("error", "Bạn chưa nhập mật khẩu mới.");
            setIsLoading(false);
            return;
        }
        if (!confirmPassword) {
            context.openAlerBox("error", "Bạn chưa nhập mật khẩu.");
            setIsLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            context.openAlerBox("error", "Mật khẩu không khớp.");
            setIsLoading(false);
            return;
        }

        postData(`/api/user/reset-password`, formFields).then((res) => {
            console.log(res)
            if (res?.error === false) {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("actionType");
                context.openAlerBox("success", res?.message);
                setIsLoading(true)
                history('/login')
            } else {
                context.openAlerBox("error", res?.message);
                setIsLoading(false);

            }
        });
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {

            setFormFields(prevState => ({ ...prevState, email: storedEmail }));
        } else {
            console.warn("Không tìm thấy email để đặt lại mật khẩu.");
        }
    }, []);


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

                    <form className='w-full' onSubmit={handleSubmit} noValidate>
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
                                id="email"
                                type='email'
                                name='email'
                                label="Email"
                                variant="outlined"
                                className='w-full'
                                value={formFields.email}
                                disabled={true}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-4">
                            <TextField
                                id="newPassword" type={isShowPassword ? 'text' : 'password'}
                                label="Mật khẩu mới" name='newPassword' variant="outlined"
                                className='w-full'
                                value={formFields.newPassword}
                                onChange={onChangeInput}
                                disabled={isLoading === true ? true : false}
                                error={!!error}
                                required
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
                                name='confirmPassword'
                                variant="outlined"
                                className='w-full'
                                value={formFields.confirmPassword}
                                onChange={onChangeInput}
                                disabled={isLoading === true ? true : false}
                                error={!!error}
                                required
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