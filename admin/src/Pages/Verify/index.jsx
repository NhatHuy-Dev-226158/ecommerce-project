import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Button,
    CircularProgress,
    Alert,
    Box,
    Typography,
    Container,
    Paper,
    Stack
} from '@mui/material';
import { IoMailOutline } from "react-icons/io5"; // Sử dụng icon từ react-icons
import OtpInput from '../../componets/OTPBox'; // Giữ nguyên component của bạn
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

/** Che giấu email người dùng (ví dụ: test@gmail.com -> te***@gmail.com). */
const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (name.length <= 2) {
        return email;
    }
    const maskedName = name.substring(0, 2) + '***';
    return `${maskedName}@${domain}`;
};

const Verify = () => {
    // Toàn bộ logic state, effects, và handlers được giữ nguyên
    const context = useContext(MyContext);
    const history = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [notification, setNotification] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setUserEmail(emailFromStorage);
        }
        // Thông báo sẽ được xử lý bởi context.openAlerBox thay vì hiển thị inline
    }, []);

    useEffect(() => {
        let interval;
        if (timer > 0 && !success) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, success]);

    const handleOtpChange = (value) => {
        setOtp(value);
        setError("");
    };

    const handleResendOtp = () => {
        setIsResending(true);
        setTimeout(() => {
            setTimer(60);
            setIsResending(false);
            context.openAlerBox("success", "A new code has been sent successfully.");
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!otp == '') {
            const actionType = localStorage.getItem("actionType");

            if (actionType !== "forgot-password") {
                postData("/api/user/verify", {
                    email: localStorage.getItem("userEmail"),
                    otp: otp
                }).then((res) => {
                    if (res?.error === false) {
                        setIsLoading(false);
                        context.openAlerBox("success", res?.message);
                        localStorage.removeItem("userEmail");
                        history('/login');
                    } else {
                        setIsLoading(false);
                        context.openAlerBox("error", res?.message);
                    }
                });
            } else {
                postData("/api/user/verify-forgot-password-otp", {
                    email: localStorage.getItem("userEmail"),
                    otp: otp
                }).then((res) => {
                    if (res?.error === false) {
                        setIsLoading(false);
                        context.openAlerBox("success", res?.message);
                        history('/forgot-password');
                    } else {
                        setIsLoading(false);
                        context.openAlerBox("error", res?.message);
                    }
                });
            }
        } else {
            context.openAlerBox("error", "Vui lòng nhập mã OTP");

        }

    };

    // --- SECTION: RENDER COMPONENT ---
    return (
        <Box
            component="section"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa', // Màu nền xám nhạt như trong ảnh
                p: 2,
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0} // Tắt đổ bóng mặc định để dùng custom shadow
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Đổ bóng nhẹ nhàng
                        border: '1px solid #e9ecef' // Thêm đường viền mỏng
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3} alignItems="center">
                            {/* Biểu tượng Email */}
                            <Box
                                sx={{
                                    color: '#1976D2', // Màu xanh dương cho biểu tượng
                                    fontSize: '48px',
                                    lineHeight: 1, // Đảm bảo không có khoảng trắng thừa
                                }}
                            >
                                <IoMailOutline />
                            </Box>

                            {/* Tiêu đề */}
                            <Typography variant="h5" component="h1" fontWeight="600" color="#212529">
                                OTP Verification
                            </Typography>

                            {/* Hướng dẫn và Email */}
                            <Box>
                                <Typography color="text.secondary">
                                    Enter the code sent to
                                </Typography>
                                <Typography fontWeight="600" color="#212529">
                                    {userEmail ? maskEmail(userEmail) : 'your email'}
                                </Typography>
                            </Box>

                            {/* Vùng nhập mã OTP */}
                            {/* Giả định OtpInput render các input con */}
                            <Box
                                sx={{
                                    '& .otp-container': {
                                        display: 'flex',
                                        gap: '5px !important',
                                    },
                                    '& .otp-input': {
                                        width: '45px !important',
                                        height: '50px',
                                        gap: '5px !important',
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        border: '1px solid #ced4da',
                                        borderRadius: '8px',
                                        '&:focus': {
                                            borderColor: '#1976D2',
                                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.25)',
                                            outline: 'none',
                                        },
                                    },
                                }}
                            >
                                <OtpInput length={6} onOtpSubmit={handleOtpChange} />
                            </Box>

                            {/* Nút Submit */}
                            <Box sx={{ width: '100%', pt: 1 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading || otp.length < 6}
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        backgroundColor: '#1976D2', // Màu nền xanh dương
                                        '&:hover': {
                                            backgroundColor: '#1565C0', // Màu khi hover
                                        },
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Verify Account'}
                                </Button>
                            </Box>

                            {/* Vùng gửi lại mã */}
                            <Box>
                                {timer > 0 ? (
                                    <Typography color="text.secondary">
                                        Resend code in <Box component="span" fontWeight="bold" color="text.primary">{timer}s</Box>
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={handleResendOtp}
                                        disabled={isResending}
                                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                    >
                                        {isResending ? <CircularProgress size={16} /> : 'Resend Code'}
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Verify;