import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from '../../App';
import { useContext } from 'react';
import { postData } from '../../utils/api';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({ email: '', password: '' });
    const handleClickShowPassword = () => setIsShowPassword((show) => !show);

    const context = useContext(MyContext);
    const history = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(false);
        const { email, password } = formFields;
        if (!email && !password) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin để đăng ký.");
            return;
        }
        if (!email) {
            context.openAlerBox("error", "Bạn chưa nhập địa chỉ email.");
            return;
        }
        if (!password) {
            context.openAlerBox("error", "Bạn chưa nhập mật khẩu.");
            return;
        }


        postData("/api/user/login", formFields, { withCredentials: true }).then((res) => {
            console.log(res);
            if (res?.error !== true) {
                setIsLoading(true);
                context.openAlerBox("success", res?.message);
                localStorage.setItem("accesstoken", res?.data?.accesstoken)
                localStorage.setItem("refreshtoken", res?.data?.refreshtoken)
                setFormFields({
                    email: '',
                    password: ''
                })
                context.setIsLogin(true);
                history("/")
            } else {
                context.openAlerBox("error", res?.message);
                setIsLoading(false);
            }
        });
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

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
                        Đăng Nhập
                    </motion.h3>

                    <form className='w-full' onSubmit={handleSubmit} noValidate>
                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField
                                id="email"
                                type='email'
                                name='email'
                                label="Email"
                                variant="outlined"
                                className='w-full'
                                value={formFields.name}
                                onChange={onChangeInput}
                                disabled={isLoading === true ? true : false}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-4">
                            <TextField
                                id="password"
                                type={isShowPassword ? 'text' : 'password'}
                                label="Mật khẩu"
                                name='password'
                                variant="outlined"
                                className='w-full'
                                value={formFields.password}
                                onChange={onChangeInput}
                                disabled={isLoading === true ? true : false}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {formFields.password && (
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {isShowPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex justify-end w-full mb-5">
                            <Link to='/forgot-password'>
                                <a className='link cursor-pointer text-sm text-blue-600 hover:underline'
                                >
                                    Quên mật khẩu?
                                </a>
                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-full mb-4">
                            <Button
                                type="submit"
                                className='org-btn w-full !py-3 !text-base hover:!bg-red-700'
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
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
                                className='flex items-center justify-center gap-3 w-full !py-3 !text-gray-700 !border-gray-300 hover:!bg-gray-50'
                                disabled={isLoading}
                            >
                                <FcGoogle className='text-2xl' />
                                <span className="font-medium">Tiếp tục với Google</span>
                            </Button>
                        </motion.div>

                        <motion.p variants={itemVariants} className='text-sm text-center text-gray-600'>
                            Bạn chưa có tài khoản?{' '}
                            <Link to='/register' className='link font-medium text-blue-600 hover:underline'>
                                Đăng ký ngay
                            </Link>
                        </motion.p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

export default Login;