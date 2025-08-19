import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, CircularProgress, Box, Typography, Container, Paper, Stack
} from '@mui/material';
import { IoMailOutline } from "react-icons/io5";
import OtpInput from '../../componets/OTPBox'; // Import component OtpInput
import { postData } from '../../utils/api';
import { MyContext } from '../../App';

//================================================================================
// HELPER FUNCTION
//================================================================================

/** Che giấu một phần email để bảo mật (ví dụ: test@gmail.com -> te***@gmail.com). */
const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    const maskedName = name.substring(0, 2) + '***';
    return `${maskedName}@${domain}`;
};


//================================================================================
// MAIN VERIFY COMPONENT
//================================================================================

/**
 * @component Verify
 * @description Trang xác thực mã OTP, được sử dụng cho cả việc xác thực đăng ký
 * và xác thực để đặt lại mật khẩu.
 */
const Verify = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const history = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60); // Thời gian đếm ngược để gửi lại mã
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // --- Logic & Effects ---

    // Lấy email từ localStorage khi component được mount
    useEffect(() => {
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setUserEmail(emailFromStorage);
        }
    }, []);

    // Quản lý bộ đếm thời gian
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, [timer]);


    // --- Event Handlers ---

    // Cập nhật state OTP khi người dùng nhập
    const handleOtpChange = (value) => {
        setOtp(value);
    };

    // Xử lý gửi lại mã OTP
    const handleResendOtp = () => {
        setIsResending(true);
        // Ghi chú: Logic thực tế sẽ gọi API để gửi lại mã.
        // Ở đây đang giả lập độ trễ mạng.
        setTimeout(() => {
            setTimer(60); // Reset bộ đếm
            setIsResending(false);
            context.openAlerBox("success", "Mã mới đã được gửi thành công.");
        }, 1500);
    };

    // Xử lý logic khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            context.openAlerBox("error", "Vui lòng nhập đủ 6 chữ số OTP.");
            return;
        }
        setIsLoading(true);

        const email = localStorage.getItem("userEmail");
        const actionType = localStorage.getItem("actionType");

        // Xác định API endpoint dựa trên hành động trước đó (đăng ký hay quên mật khẩu)
        const endpoint = actionType === "forgot-password"
            ? "/api/user/verify-forgot-password-otp"
            : "/api/user/verify";

        postData(endpoint, { email, otp })
            .then((res) => {
                if (res?.error === false) {
                    context.openAlerBox("success", res?.message);
                    // Dọn dẹp localStorage và điều hướng đến trang phù hợp
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("actionType");
                    const destination = actionType === "forgot-password" ? '/forgot-password' : '/login';
                    history(destination);
                } else {
                    context.openAlerBox("error", res?.message);
                }
            })
            .finally(() => setIsLoading(false));
    };


    // --- Render ---
    return (
        <Box
            component="section"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa', p: 2 }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{ p: { xs: 3, sm: 4 }, borderRadius: '12px', textAlign: 'center', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', border: '1px solid #e9ecef' }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3} alignItems="center">
                            <Box sx={{ color: '#1976D2', fontSize: '48px', lineHeight: 1 }}><IoMailOutline /></Box>
                            <Typography variant="h5" component="h1" fontWeight="600" color="#212529">Xác thực OTP</Typography>
                            <Box>
                                <Typography color="text.secondary">Nhập mã đã được gửi đến</Typography>
                                <Typography fontWeight="600" color="#212529">{maskEmail(userEmail)}</Typography>
                            </Box>
                            <Box>
                                <OtpInput length={6} onOtpSubmit={handleOtpChange} />
                            </Box>
                            <Box sx={{ width: '100%', pt: 1 }}>
                                <Button
                                    type="submit" fullWidth variant="contained" size="large"
                                    disabled={isLoading || otp.length < 6}
                                    sx={{ py: 1.5, fontWeight: 'bold', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', backgroundColor: '#1976D2', '&:hover': { backgroundColor: '#1565C0' } }}
                                >
                                    {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Xác thực'}
                                </Button>
                            </Box>
                            <Box>
                                {timer > 0 ? (
                                    <Typography color="text.secondary">
                                        Gửi lại mã sau <Box component="span" fontWeight="bold" color="text.primary">{timer}s</Box>
                                    </Typography>
                                ) : (
                                    <Button variant="text" size="small" onClick={handleResendOtp} disabled={isResending} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                        {isResending ? <CircularProgress size={16} /> : 'Gửi lại mã'}
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