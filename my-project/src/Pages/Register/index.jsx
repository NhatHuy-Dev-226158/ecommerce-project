import React, { useContext, useState } from 'react';
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
import { postData } from '../../utils/api';

const Register = () => {
    const context = useContext(MyContext);
    const history = useNavigate();
    const [formFields, setFormFields] = useState({
        name: '',
        mobile: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
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
                setIsLoading(true);
                context.openAlerBox("success", res?.message);
                localStorage.setItem("userEmail", formFields.email)
                setFormFields({
                    name: '',
                    mobile: '',
                    email: '',
                    password: ''
                })
                history("/verify")
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
                    className="card shadow-lg w-full max-w-md m-auto rounded-lg bg-white p-8"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h3 variants={itemVariants} className='text-center text-2xl text-gray-800 font-bold mb-6'>
                        Đăng Ký Tài Khoản
                    </motion.h3>
                    <form className='w-full' onSubmit={handleSubmit} noValidate>

                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField
                                id="name"
                                name="name"
                                type='text'
                                label="Họ và Tên"
                                variant="outlined"
                                className='w-full'
                                value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField
                                id="phone"
                                name="mobile"
                                type='tel'
                                label="Số điện thoại"
                                variant="outlined"
                                className='w-full'
                                value={formFields.mobile}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField
                                id="email"
                                name="email"
                                type='email'
                                label="Email"
                                variant="outlined"
                                className='w-full'
                                value={formFields.email}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="form-group w-full mb-5">
                            <TextField
                                id="password"
                                name="password"
                                type={isShowPassword ? 'text' : 'password'}
                                label="Mật khẩu"
                                variant="outlined"
                                className='w-full'
                                value={formFields.password}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
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

                        <motion.div variants={itemVariants} className="w-full mb-4">
                            <Button
                                type="submit"
                                className='org-btn w-full !py-3 !text-base hover:!bg-red-700'
                                disabled={isLoading === true ? true : false}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
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

                        <motion.p variants={itemVariants} className='text-center text-sm text-gray-600'>
                            Bạn đã có tài khoản?{' '}
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

export default Register;