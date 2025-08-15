import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';
import { keyframes } from '@emotion/react';
const COUNTDOWN_SECONDS = 5;

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

    useEffect(() => {
        let timerId;
        let intervalId;
        if (isCountingDown) {
            intervalId = setInterval(() => setCountdown(prev => prev - 1), 1000);
            timerId = setTimeout(() => {
                onConfirm();
                resetState();
            }, COUNTDOWN_SECONDS * 1000);
        }
        return () => {
            clearTimeout(timerId);
            clearInterval(intervalId);
        };
    }, [isCountingDown, onConfirm]);

    useEffect(() => { if (!open) resetState(); }, [open]);

    const resetState = () => {
        setIsCountingDown(false);
        setCountdown(COUNTDOWN_SECONDS);
    };

    // Khi nhấn nút "Xác nhận"
    const handleConfirmClick = () => {
        setIsCountingDown(true);
    };

    // Khi đang đếm ngược và nhấn nút "Hủy"
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
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <FiAlertTriangle size={24} className="text-red-600" />
                    </Box>

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
                {!isCountingDown ? (
                    <>
                        <Button
                            onClick={onClose}
                            variant="text"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                color: 'grey.700',
                                padding: '8px 16px',
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
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                padding: '8px 16px',
                                boxShadow: 'none',
                                '&:hover': {
                                    // Hiệu ứng đổ bóng màu đỏ khi hover
                                    boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.4)'
                                }
                            }}
                        >
                            Xác nhận
                        </Button>
                    </>
                ) : (

                    // <Button
                    //     onClick={handleCancelCountdown}
                    //     variant="contained"
                    //     color="inherit"
                    //     sx={{
                    //         textTransform: 'none',
                    //         borderRadius: '8px',
                    //         fontWeight: 600,
                    //         padding: '8px 16px',
                    //         position: 'relative'
                    //     }}
                    // >
                    //     Hủy ({countdown})

                    //     <CircularProgress
                    //         variant="determinate"
                    //         value={(countdown / COUNTDOWN_SECONDS) * 100}
                    //         size={32}
                    //         sx={{
                    //             color: 'error.main',
                    //             position: 'absolute',
                    //             top: '50%',
                    //             left: '50%',
                    //             marginTop: '-16px',
                    //             marginLeft: '-16px',
                    //         }}
                    //     />
                    // </Button>

                    //=============================================================

                    <Button
                        onClick={handleCancelCountdown}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            padding: '8px 16px',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0, left: 0,
                                width: '100%', height: '100%',
                                zIndex: -1,
                                background: `conic-gradient(
                                #ef4444 ${(countdown / COUNTDOWN_SECONDS) * 360}deg, 
                                transparent 0deg
                            )`,
                                mask: 'radial-gradient(transparent, transparent 92%, black 92%)',
                                transition: 'background 1s linear', // Hiệu ứng chuyển động mượt mà
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