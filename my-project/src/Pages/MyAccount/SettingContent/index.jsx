import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton, Typography } from '@mui/material';
import {
    FiBell,
    FiDownload,
    FiAlertTriangle,
    FiUserX,
    FiTrash2,
    FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- COMPONENT CON TÙY CHỈNH ---
const ToggleSwitch = ({ enabled, onChange }) => (
    <button type="button" onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const SettingCard = ({ icon, title, description, children }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-start gap-4">
            <div className="text-xl text-gray-500 mt-1">{icon}</div>
            <div>
                <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    </div>
);


// === COMPONENT CHÍNH CỦA TRANG CÀI ĐẶT ===
const SettingsContent = () => {
    // State để quản lý các cài đặt và modal
    const [notifications, setNotifications] = useState({
        promotions: true,
        orderUpdates: true,
        reviews: false
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'deactivate' hoặc 'delete'

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const openConfirmationModal = (type) => {
        setActionType(type);
        setIsModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsModalOpen(false);
        setActionType(null);
    };

    const handleConfirmAction = () => {
        toast.success(`Hành động "${actionType}" đã được xác nhận (giả lập).`);
        closeConfirmationModal();
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">**Chức năng chưa phát triển**</h2>
                <p className="text-gray-500 mt-1">Quản lý thông báo, dữ liệu và các tùy chọn khác.</p>
            </div>

            {/* Phần Cài đặt thông báo */}
            <SettingCard
                icon={<FiBell />}
                title="Thông báo"
                description="Chọn những cập nhật bạn muốn nhận."
            >
                <div className="space-y-4">
                    <div className="flex justify-between items-center"><p>Nhận email về chương trình khuyến mãi</p> <ToggleSwitch enabled={notifications.promotions} onChange={() => handleToggle('promotions')} /></div>
                    <div className="flex justify-between items-center"><p>Nhận email cập nhật trạng thái đơn hàng</p> <ToggleSwitch enabled={notifications.orderUpdates} onChange={() => handleToggle('orderUpdates')} /></div>
                    <div className="flex justify-between items-center"><p>Nhận email khi có bình luận về nhận xét của bạn</p> <ToggleSwitch enabled={notifications.reviews} onChange={() => handleToggle('reviews')} /></div>
                </div>
            </SettingCard>

            {/* Phần Quản lý dữ liệu */}
            <SettingCard
                icon={<FiDownload />}
                title="Quản lý dữ liệu"
                description="Tải xuống hoặc quản lý dữ liệu cá nhân của bạn."
            >
                <Button variant="outlined">Tải xuống dữ liệu</Button>
            </SettingCard>

            {/* Khu vực nguy hiểm */}
            <div className="border-2 border-red-300 bg-red-50 p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="text-xl text-red-500 mt-1"><FiAlertTriangle /></div>
                    <div>
                        <h3 className="font-bold text-lg text-red-800">Khu vực nguy hiểm</h3>
                        <p className="text-sm text-red-700 mt-1 mb-4">Các hành động dưới đây không thể hoàn tác. Vui lòng cân nhắc kỹ.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outlined" color="error" startIcon={<FiUserX />} onClick={() => openConfirmationModal('deactivate')}>
                                Vô hiệu hóa tài khoản
                            </Button>
                            <Button variant="contained" color="error" startIcon={<FiTrash2 />} onClick={() => openConfirmationModal('delete')}>
                                Xóa tài khoản vĩnh viễn
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Xác nhận */}
            <Dialog open={isModalOpen} onClose={closeConfirmationModal} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Bạn có chắc chắn?
                    <IconButton onClick={closeConfirmationModal} sx={{ position: 'absolute', right: 8, top: 8 }}><FiX /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Hành động này không thể hoàn tác.
                    </Alert>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Để xác nhận, vui lòng nhập mật khẩu của bạn vào ô bên dưới.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password-confirm"
                        label="Nhập mật khẩu của bạn"
                        type="password"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={closeConfirmationModal}>Hủy bỏ</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmAction}>
                        {actionType === 'deactivate' ? 'Tôi hiểu, Vô hiệu hóa' : 'Tôi hiểu, Xóa tài khoản'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SettingsContent;