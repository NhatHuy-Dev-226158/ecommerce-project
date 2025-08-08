import React, { useState } from 'react';
import {
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {
    FiPlus,
    FiTrash2,
    FiEdit2,
    FiX,
    FiCheckCircle,
    FiMapPin
} from 'react-icons/fi';

// --- DỮ LIỆU TĨNH ---
const initialAddresses = [
    { id: 1, name: 'Nguyễn Nhật Huy', phone: '0339 656 885', street: '123 Đường Lê Văn Sỹ', ward: 'Phường 1', district: 'Quận Tân Bình', city: 'TP. Hồ Chí Minh', isDefault: true },
    { id: 2, name: 'Nguyễn Nhật Huy', phone: '0909 123 456', street: 'Tòa nhà A, KTX Khu B, ĐHQG', ward: 'Phường Đông Hòa', district: 'Thành phố Dĩ An', city: 'Tỉnh Bình Dương', isDefault: false },
    { id: 3, name: 'Văn phòng Công ty', phone: '028 1234 5678', street: 'Lầu 5, Tòa nhà Bitexco, Số 2 Hải Triều', ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP. Hồ Chí Minh', isDefault: false },
];

// --- COMPONENT CON CHO CARD ĐỊA CHỈ (Đã làm lại) ---
const AddressCard = ({ address, onSetDefault, onEdit, onDelete }) => (
    <div className={`relative p-5 border-2 rounded-2xl transition-all duration-300 ${address.isDefault ? 'border-indigo-600 bg-indigo-50' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
        {address.isDefault && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                <FiCheckCircle size={14} /> Mặc định
            </div>
        )}
        <p className="font-bold text-lg text-gray-800 mb-3">{address.name}</p>
        <div className="space-y-1.5 text-sm text-gray-700">
            <p><span className="text-gray-500">Địa chỉ:</span> {address.street}, {address.ward}, {address.district}, {address.city}</p>
            <p><span className="text-gray-500">Điện thoại:</span> {address.phone}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed">
            <Button size="small" variant="outlined" startIcon={<FiEdit2 />} onClick={() => onEdit(address)}>Sửa</Button>
            <Button size="small" variant="outlined" color="error" startIcon={<FiTrash2 />} onClick={() => onDelete(address.id)}>Xóa</Button>
            {!address.isDefault && (
                <Button size="small" variant="outlined" onClick={() => onSetDefault(address.id)} sx={{ ml: 'auto' }}>
                    Đặt làm mặc định
                </Button>
            )}
        </div>
    </div>
);


// === COMPONENT CHÍNH ---
const AddressesContent = () => {
    // Logic cơ bản để quản lý UI
    const [addresses, setAddresses] = useState(initialAddresses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleOpenModal = (address = null) => {
        setEditingAddress(address); // Nếu là null -> thêm mới, ngược lại -> sửa
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSetDefault = (idToSet) => {
        setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === idToSet })));
    };

    const handleDelete = (idToDelete) => {
        setAddresses(addresses.filter(addr => addr.id !== idToDelete));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sổ địa chỉ</h2>
                    <p className="text-gray-500 mt-1">Quản lý và cập nhật các địa chỉ nhận hàng của bạn.</p>
                </div>
                <Button variant="contained" startIcon={<FiPlus />} onClick={() => handleOpenModal()}>
                    Thêm địa chỉ mới
                </Button>
            </div>

            {addresses.length > 0 ? (
                <div className="space-y-6">
                    {/* Phần địa chỉ mặc định */}
                    {addresses.filter(addr => addr.isDefault).map(addr => (
                        <AddressCard key={addr.id} address={addr} onEdit={handleOpenModal} onDelete={handleDelete} />
                    ))}
                    {/* Phần các địa chỉ khác */}
                    {addresses.some(addr => !addr.isDefault) && (
                        <div className="pt-4">
                            <h3 className="text-lg font-semibold mb-4">Các địa chỉ khác</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.filter(addr => !addr.isDefault).map(addr => (
                                    <AddressCard key={addr.id} address={addr} onSetDefault={handleSetDefault} onEdit={handleOpenModal} onDelete={handleDelete} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 flex flex-col items-center border-2 border-dashed border-gray-300 rounded-xl">
                    <FiMapPin className="text-6xl text-gray-300 mb-4" />
                    <h3 className="font-bold text-xl">Chưa có địa chỉ nào</h3>
                    <p className="text-gray-500 mt-2 mb-4">Hãy thêm địa chỉ nhận hàng để việc mua sắm nhanh hơn.</p>
                    <Button variant="contained" startIcon={<FiPlus />} onClick={() => handleOpenModal()}>
                        Thêm địa chỉ đầu tiên
                    </Button>
                </div>
            )}


            {/* Modal để thêm/sửa địa chỉ (đã nâng cấp) */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}><FiX /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Họ và tên" defaultValue={editingAddress?.name} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Số điện thoại" defaultValue={editingAddress?.phone} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Tỉnh/Thành phố" defaultValue={editingAddress?.city} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Quận/Huyện" defaultValue={editingAddress?.district} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Phường/Xã" defaultValue={editingAddress?.ward} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Địa chỉ chi tiết (số nhà, tên đường...)" defaultValue={editingAddress?.street} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox defaultChecked={editingAddress?.isDefault || false} />}
                                label="Đặt làm địa chỉ mặc định"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="contained">Lưu địa chỉ</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddressesContent;