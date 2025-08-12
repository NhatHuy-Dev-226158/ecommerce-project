import React, { useState } from 'react';
import {
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';


const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
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
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'error.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <FiAlertTriangle size={24} className="text-red-600" />
                    </Box>

                    <div>
                        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
                            {title}
                        </Typography>
                        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                            {message}
                        </Typography>
                    </div>
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, padding: '8px 24px 16px' }}>
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
                    onClick={onConfirm}
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
                            boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.4)'
                        }
                    }}
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmationDialog;