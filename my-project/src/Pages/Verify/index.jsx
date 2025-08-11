import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, CircularProgress, Alert } from '@mui/material';
import OtpInput from '../../componets/OTPBox';
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
    const context = useContext(MyContext);
    const history = useNavigate();
    const [userEmail, setUserEmail] = useState("");         // Email của người dùng, lấy từ localStorage.
    const [otp, setOtp] = useState("");                     // Mã OTP người dùng nhập vào.
    const [timer, setTimer] = useState(60);                 // Bộ đếm thời gian để gửi lại mã.
    const [notification, setNotification] = useState("");   // Nội dung thông báo (success, info).
    const [error, setError] = useState("");                 // Nội dung thông báo lỗi.
    const [success, setSuccess] = useState(false);          // Trạng thái xác thực thành công.
    const [isLoading, setIsLoading] = useState(false);      // Trạng thái loading cho nút "Verify".
    const [isResending, setIsResending] = useState(false);  // Trạng thái loading riêng cho nút "Resend".

    // --- SECTION: SIDE EFFECTS ---
    // Các hiệu ứng chạy sau khi component render
    /**
     * Effect chạy một lần khi component được mount:
     * 1. Lấy email người dùng từ localStorage.
     * 2. Hiển thị thông báo hướng dẫn ban đầu.
     * 3. Thiết lập một timeout để tự động ẩn thông báo sau 5 giây.
     */
    useEffect(() => {
        const emailFromStorage = localStorage.getItem('userEmail');
        if (emailFromStorage) {
            setUserEmail(emailFromStorage);
        }
        setNotification(`A 6-digit code has been sent to your email.`);
        const timeoutId = setTimeout(() => setNotification(""), 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    /**
     * Effect quản lý bộ đếm thời gian (timer):
     * - Nếu timer > 0 và chưa xác thực thành công, giảm timer đi 1 mỗi giây.
     * - Tự động dừng lại khi timer về 0 hoặc khi đã xác thực thành công.
     */
    useEffect(() => {
        let interval;
        if (timer > 0 && !success) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, success]);

    // --- SECTION: EVENT HANDLERS ---
    // Các hàm xử lý sự kiện từ người dùng
    /**
     * Cập nhật state `otp` khi người dùng thay đổi giá trị trong ô input.
     * Đồng thời xóa thông báo lỗi cũ để cải thiện trải nghiệm người dùng.
     * @param {string} value - Giá trị OTP mới.
     */
    const handleOtpChange = (value) => {
        setOtp(value);
        setError("");
    };

    /**
     * Xử lý logic khi người dùng yêu cầu gửi lại mã OTP.
     */
    const handleResendOtp = () => {
        setIsResending(true);
        setNotification("");
        // Giả lập một cuộc gọi API để gửi lại mã OTP
        setTimeout(() => {
            console.log("Resending OTP...");
            setTimer(60); // Reset bộ đếm
            setIsResending(false);
            setNotification("A new code has been sent successfully."); // Hiển thị thông báo thành công
            // Tự động ẩn thông báo sau 5 giây
            setTimeout(() => setNotification(""), 5000);
        }, 1500);
    };

    /**
     * Xử lý sự kiện submit form khi người dùng nhấn nút "Verify".
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const actionType = localStorage.getItem("actionType");

        if (actionType !== "forgot-password") {
            postData("/api/user/verify", {
                email: localStorage.getItem("userEmail"),
                otp: otp
            }).then((res) => {
                if (res?.error === false) {
                    setIsLoading(true);
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
                    setIsLoading(true);
                    context.openAlerBox("success", res?.message);
                    history('/forgot-password');
                } else {
                    setIsLoading(false);
                    context.openAlerBox("error", res?.message);
                }
            });
        }
    };

    // --- SECTION: ANIMATION VARIANTS ---
    // Cấu hình các hiệu ứng chuyển động cho Framer Motion
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // --- SECTION: RENDER COMPONENT ---
    return (
        <section className='section flex items-center justify-center min-h-[80vh] bg-[#f7f8fc] py-10 overflow-hidden'>
            <div className="container">
                <motion.div
                    className="card shadow-lg w-full max-w-sm m-auto rounded-xl bg-white p-8 relative"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Vùng hiển thị thông báo động ở phía trên thẻ */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]"
                            >
                                <Alert severity="success" variant="standard" sx={{ width: '100%' }}>
                                    {notification}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Hiển thị màn hình thành công hoặc form xác thực */}
                    {success ? (
                        <div className="text-center">
                            <img src="/tick.png" alt="Success" className='w-[100px] mx-auto' />
                            <h3 className='text-center text-2xl text-green-600 font-bold mt-4 mb-2'>
                                Verification Successful!
                            </h3>
                            <p className="text-gray-500">Welcome to our platform.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Header của form */}
                            <motion.div variants={itemVariants} className="flex items-center justify-center text-center">
                                <img src="/verify.png" alt="Verify" className='w-[80px]' />
                            </motion.div>
                            <motion.h3 variants={itemVariants} className='text-center text-2xl text-gray-800 font-bold mt-4'>
                                OTP Verification
                            </motion.h3>
                            <motion.p variants={itemVariants} className='text-center text-gray-500 mb-6'>
                                Enter the code sent to <br />
                                <span className="font-medium text-gray-700">
                                    {userEmail ? maskEmail(userEmail) : 'your email'}
                                </span>
                            </motion.p>
                            {/* Vùng nhập mã OTP */}
                            <motion.div variants={itemVariants} className="flex items-center justify-center">
                                <OtpInput length={6} onOtpSubmit={handleOtpChange} />
                            </motion.div>
                            {/* Vùng hiển thị lỗi */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-4"
                                    >
                                        <Alert severity="error">{error}</Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {/* Nút Submit chính */}
                            <motion.div variants={itemVariants} className="mt-6">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading || otp.length < 6}
                                    sx={{ py: 1.5, fontWeight: 'bold' }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                                </Button>
                            </motion.div>
                            {/* Vùng gửi lại mã và đếm ngược */}
                            <motion.div variants={itemVariants} className="text-center mt-6">
                                {timer > 0 ? (
                                    <p className="text-gray-500">
                                        Resend code in <span className="font-bold text-gray-700">{timer}s</span>
                                    </p>
                                ) : (
                                    <p className="text-gray-500">
                                        Didn't receive the code?{' '}
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={handleResendOtp}
                                            disabled={isResending}
                                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                        >
                                            {isResending ? <CircularProgress size={16} /> : 'Resend Code'}
                                        </Button>
                                    </p>
                                )}
                            </motion.div>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Verify;