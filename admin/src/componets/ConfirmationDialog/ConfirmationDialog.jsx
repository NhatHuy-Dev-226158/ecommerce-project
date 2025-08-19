import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

// Hằng số cho thời gian đếm ngược (tính bằng giây)
const COUNTDOWN_SECONDS = 5;

/**
 * @component ConfirmationDialog
 * @description Một hộp thoại xác nhận hành động nguy hiểm, yêu cầu người dùng chờ một khoảng thời gian đếm ngược
 * trước khi hành động được thực thi để tránh nhấn nhầm.
 * @param {object} props - Props cho component.
 * @param {boolean} props.open - Cờ để điều khiển việc hiển thị/ẩn hộp thoại.
 * @param {Function} props.onClose - Callback được gọi khi người dùng đóng hộp thoại mà không xác nhận.
 * @param {Function} props.onConfirm - Callback được gọi khi quá trình đếm ngược hoàn tất.
 * @param {string} props.title - Tiêu đề của hộp thoại.
 * @param {string} props.message - Thông điệp chi tiết giải thích hành động.
 * @example
 * <ConfirmationDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Xóa sản phẩm?"
 *   message="Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn."
 * />
 */
const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    // State để theo dõi trạng thái đếm ngược
    const [isCountingDown, setIsCountingDown] = useState(false);
    // State để lưu trữ số giây đếm ngược còn lại
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

    // Effect này quản lý logic đếm ngược
    useEffect(() => {
        let timerId;
        let intervalId;

        // Chỉ chạy khi isCountingDown là true
        if (isCountingDown) {
            // Cập nhật số giây hiển thị mỗi giây
            intervalId = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            // Sau khi hết thời gian đếm ngược, thực thi hành động onConfirm
            timerId = setTimeout(() => {
                onConfirm();
                resetState(); // Đặt lại trạng thái sau khi hoàn tất
            }, COUNTDOWN_SECONDS * 1000);
        }

        // Hàm dọn dẹp (cleanup function): Rất quan trọng!
        // Nó sẽ được gọi khi component unmount hoặc khi isCountingDown thay đổi.
        // Giúp ngăn chặn memory leak và các lỗi không mong muốn.
        return () => {
            clearTimeout(timerId);
            clearInterval(intervalId);
        };
    }, [isCountingDown, onConfirm]);

    // Effect để reset trạng thái mỗi khi hộp thoại được đóng từ bên ngoài
    useEffect(() => {
        if (!open) {
            resetState();
        }
    }, [open]);

    // Hàm tiện ích để đưa các state về giá trị ban đầu
    const resetState = () => {
        setIsCountingDown(false);
        setCountdown(COUNTDOWN_SECONDS);
    };

    // Bắt đầu quá trình đếm ngược khi người dùng nhấn "Xác nhận"
    const handleConfirmClick = () => {
        setIsCountingDown(true);
    };

    // Hủy quá trình đếm ngược và reset lại state
    const handleCancelCountdown = () => {
        resetState();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    padding: '16px'
                }
            }}
        >
            <DialogContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    {/* Icon cảnh báo */}
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: '#fee2e2', // Màu nền đỏ nhạt
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <FiAlertTriangle size={24} className="text-red-600" />
                    </Box>

                    {/* Tiêu đề và nội dung */}
                    <div>
                        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
                            {title}
                        </Typography>
                        <Typography sx={{ mt: 0.5, color: 'text.secondary' }}>
                            {message}
                        </Typography>
                    </div>
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, padding: '16px 8px 8px' }}>
                {/* Hiển thị các nút dựa trên trạng thái đếm ngược */}
                {!isCountingDown ? (
                    // Trạng thái ban đầu: Hiển thị nút Hủy và Xác nhận
                    <>
                        <Button
                            onClick={onClose}
                            variant="text"
                            sx={{
                                textTransform: 'none', borderRadius: '8px', fontWeight: 600,
                                color: 'grey.700', padding: '8px 16px',
                                '&:hover': { backgroundColor: 'grey.100' }
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirmClick}
                            variant="contained"
                            color="error"
                            autoFocus
                            sx={{
                                textTransform: 'none', borderRadius: '8px', fontWeight: 600,
                                padding: '8px 16px', boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.4)'
                                }
                            }}
                        >
                            Xác nhận
                        </Button>
                    </>
                ) : (
                    // Trạng thái đang đếm ngược: Hiển thị nút Hủy với hiệu ứng timer
                    <Button
                        onClick={handleCancelCountdown}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            textTransform: 'none', borderRadius: '8px', fontWeight: 600,
                            padding: '8px 16px', position: 'relative', overflow: 'hidden',
                            // Sử dụng pseudo-element ::before để tạo hiệu ứng vòng tròn đếm ngược
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0, left: 0,
                                width: '100%', height: '100%',
                                zIndex: -1,
                                // `conic-gradient` tạo ra một dải màu hình nón.
                                // Góc của màu đỏ được tính toán dựa trên thời gian đếm ngược,
                                // tạo hiệu ứng lấp đầy vòng tròn.
                                background: `conic-gradient(#ef4444 ${(countdown / COUNTDOWN_SECONDS) * 360}deg, transparent 0deg)`,
                                // `mask` được dùng để tạo hình dạng vòng tròn (donut shape)
                                mask: 'radial-gradient(transparent, transparent 92%, black 92%)',
                                transition: 'background 1s linear', // Đảm bảo hiệu ứng mượt mà
                            }
                        }}
                    >
                        Hủy ({countdown})
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;