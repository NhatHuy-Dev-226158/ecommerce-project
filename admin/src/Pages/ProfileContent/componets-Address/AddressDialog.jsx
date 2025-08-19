import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Switch, FormControlLabel, Box, IconButton, CircularProgress
} from '@mui/material';
import { FiX } from 'react-icons/fi';
import { MyContext } from '../../../App';
import { postData, updateData } from '../../../utils/api';

//================================================================================
// STYLED COMPONENT (Thành phần giao diện được tùy chỉnh)
//================================================================================

// Một component Switch được tùy chỉnh giao diện
const Android12Switch = styled(Switch)(({ theme }) => ({
    // ... các style tùy chỉnh ...
}));


//================================================================================
// MAIN ADDRESS DIALOG COMPONENT
//================================================================================

/**
 * @component AddressDialog
 * @description Một Dialog (popup) để thêm mới hoặc chỉnh sửa địa chỉ.
 * @param {object} props
 * @param {boolean} props.open - Cờ để điều khiển việc hiển thị/ẩn Dialog.
 * @param {Function} props.onClose - Callback được gọi khi Dialog đóng lại.
 * @param {object | null} props.addressToEdit - Dữ liệu địa chỉ cần sửa. Nếu là null, Dialog ở chế độ "thêm mới".
 * @param {Function} props.onSaveSuccess - Callback được gọi sau khi lưu thành công để component cha có thể tải lại dữ liệu.
 */
const AddressDialog = ({ open, onClose, addressToEdit, onSaveSuccess }) => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        address_line: '', city: '', state: '', pincode: '',
        country: 'Vietnam', status: true,
    });
    const isEditMode = Boolean(addressToEdit); // Xác định chế độ: true là sửa, false là thêm mới

    // --- Logic & Effects ---

    // Effect: Điền dữ liệu vào form khi mở dialog ở chế độ sửa, hoặc reset form khi thêm mới.
    useEffect(() => {
        if (open) {
            if (isEditMode) {
                setFormFields(addressToEdit);
            } else {
                // Reset về trạng thái mặc định khi thêm mới
                setFormFields({
                    address_line: '', city: '', state: '', pincode: '', country: 'Vietnam', status: true
                });
            }
        }
    }, [addressToEdit, open, isEditMode]);

    // --- Event Handlers ---

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };
    const handleSwitchChange = (event) => {
        setFormFields(prevState => ({ ...prevState, status: event.target.checked }));
    };

    // Đóng dialog và reset form
    const handleClose = () => {
        onClose();
    };

    // Xử lý logic khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formFields.address_line || !formFields.city || !formFields.state) {
            context.openAlerBox("error", "Vui lòng điền các trường bắt buộc.");
            return;
        }
        setIsLoading(true);

        try {
            // Chọn API call tương ứng với chế độ (sửa hoặc thêm mới)
            const apiCall = isEditMode
                ? updateData(`/api/address/${addressToEdit._id}`, formFields)
                : postData(`/api/address/add`, formFields);

            const res = await apiCall;

            if (res.success) {
                context.openAlerBox("success", res.message);
                onSaveSuccess(); // Báo cho component cha để tải lại dữ liệu
                handleClose();   // Tự động đóng dialog sau khi thành công
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            context.openAlerBox("error", error.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsLoading(false);
        }
    };


    // --- Render ---
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                    {isEditMode ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                    <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <FiX />
                    </IconButton>
                </DialogTitle>

                {/* Nội dung form */}
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField autoFocus name="address_line" label="Địa chỉ cụ thể" placeholder="Ví dụ: 123 Đường ABC, Phường 1" value={formFields.address_line} onChange={handleInputChange} required />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField name="state" label="Quận / Huyện" value={formFields.state} onChange={handleInputChange} required />
                            <TextField name="city" label="Tỉnh / Thành phố" value={formFields.city} onChange={handleInputChange} required />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField name="pincode" label="Mã bưu chính (Tùy chọn)" value={formFields.pincode} onChange={handleInputChange} />
                            <TextField name="country" label="Quốc gia" value={formFields.country} onChange={handleInputChange} />
                            <FormControlLabel control={<Android12Switch checked={formFields.status} onChange={handleSwitchChange} />} label="Đặt làm địa chỉ mặc định" />
                        </Box>
                    </Box>
                </DialogContent>

                {/* Các nút hành động */}
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} variant="text" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, color: 'grey.600' }}>
                        Hủy
                    </Button>
                    <Button type='submit' variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, padding: '8px 24px' }}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Lưu thay đổi' : 'Thêm địa chỉ')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default AddressDialog;