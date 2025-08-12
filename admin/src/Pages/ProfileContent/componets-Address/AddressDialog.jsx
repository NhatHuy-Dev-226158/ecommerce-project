import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Box,
    IconButton
} from '@mui/material';
import { useContext } from 'react';
import { FiX } from 'react-icons/fi';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { postData, updateData } from '../../../utils/api';
import { MyContext } from '../../../App';


const AddressDialog = ({ open, onClose, addressToEdit, onSaveSuccess }) => {
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        country: 'Vietnam',
        status: true,
    });
    const isEditMode = Boolean(addressToEdit);
    useEffect(() => {
        if (open) {
            if (isEditMode) {
                setFormFields(addressToEdit);
            } else {
                setFormFields({
                    address_line: '', city: '', state: '', pincode: '', country: 'Vietnam', status: true
                });
            }
        }
    }, [addressToEdit, open]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };
    const handleSwitchChange = (event) => {
        setFormFields(prevState => ({ ...prevState, status: event.target.checked }));
    };


    const handleClose = () => {
        setFormFields({
            address_line: '', city: '', state: '', pincode: '', country: 'Vietnam', status: true
        });
        onClose();
    };
    const handleSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();

        // ... validation ...
        if (!formFields.address_line || !formFields.city || !formFields.state) {
            context.openAlerBox("error", "Vui lòng điền các trường bắt buộc.");
            return;
        }

        setIsLoading(true);
        const apiCall = isEditMode
            ? updateData(`/api/address/${addressToEdit._id}`, formFields)
            : postData(`/api/address/add`, formFields);

        apiCall.then((res) => {
            if (res.success) {
                context.openAlerBox("success", res.message);
                onSaveSuccess(); // Gọi hàm onSaveSuccess để báo cho cha
            } else {
                context.openAlerBox("error", res.message);
            }
        }).finally(() => setIsLoading(false));
    };

    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&::after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                }
            }}
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                    {isEditMode ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <FiX />
                    </IconButton>
                </DialogTitle>

                {/* === NỘI DUNG FORM === */}

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            autoFocus
                            name="address_line"
                            label="Địa chỉ cụ thể"
                            placeholder="Ví dụ: 123 Đường ABC, Phường 1"
                            value={formFields.address_line}
                            onChange={handleInputChange}
                            required
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                name="state"
                                label="Quận / Huyện"
                                value={formFields.state}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                name="city"
                                label="Tỉnh / Thành phố"
                                value={formFields.city}
                                onChange={handleInputChange}
                                required
                            />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                name="pincode"
                                label="Mã bưu chính (Tùy chọn)"
                                value={formFields.pincode}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="country"
                                label="Quốc gia"
                                value={formFields.country}
                                onChange={handleInputChange}
                            />
                            <FormControlLabel
                                control={<Android12Switch
                                    checked={formFields.status}
                                    onChange={handleSwitchChange}
                                    color="warning" />}
                                label="Đặt làm địa chỉ mặc định"
                            />
                        </Box>

                    </Box>
                </DialogContent>

                {/* === CÁC NÚT HÀNH ĐỘNG === */}
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button
                        onClick={() => onClose(false)}
                        variant="text"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            color: 'grey.600',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: 'grey.100'
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type='submit'
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            padding: '8px 24px',
                            backgroundColor: '#4f46e5',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            '&:hover': {
                                backgroundColor: '#4338ca',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                            }
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Lưu thay đổi' : 'Thêm địa chỉ')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>

    );
};
export default AddressDialog;