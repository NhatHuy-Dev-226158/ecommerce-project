import React, { useState, useEffect, useContext } from 'react';

// --- Component & Icon Imports ---
import AddressCard from './componets-Address/AddressCard';
import AddressDialog from './componets-Address/AddressDialog';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';
import { FiPlus } from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';

// --- Context & API Imports ---
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, updateData } from '../../utils/api';

//================================================================================
// MAIN ADDRESS MANAGEMENT COMPONENT
//================================================================================

/**
 * @component AddressManagementSection
 * @description Component chính để quản lý danh sách địa chỉ của người dùng.
 * Bao gồm hiển thị, thêm, sửa, xóa và đặt làm mặc định.
 */
const AddressManagementSection = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State để quản lý các dialog (popup)
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // State để truyền dữ liệu cho các dialog
    const [addressToEdit, setAddressToEdit] = useState(null);
    const [addressIdToDelete, setAddressIdToDelete] = useState(null);

    // --- Logic & Effects ---

    // Hàm tải danh sách địa chỉ từ server
    const fetchAddresses = async () => {
        setIsLoading(true);
        const result = await fetchDataFromApi('/api/address/all');
        if (result.success) {
            setAddresses(result.data);
        } else {
            context.openAlerBox("error", "Không thể tải danh sách địa chỉ.");
        }
        setIsLoading(false);
    };

    // Tải dữ liệu lần đầu khi component được mount
    useEffect(() => {
        fetchAddresses();
    }, []); // Bỏ `context` khỏi dependency array nếu `fetchAddresses` không thực sự phụ thuộc vào nó

    // --- Event Handlers for Dialogs ---

    // Mở dialog ở chế độ "thêm mới"
    const handleAddClick = () => {
        setAddressToEdit(null); // Không có dữ liệu để sửa
        setIsAddressDialogOpen(true);
    };

    // Mở dialog ở chế độ "sửa"
    const handleEditClick = (address) => {
        setAddressToEdit(address);
        setIsAddressDialogOpen(true);
    };

    // Đóng dialog thêm/sửa
    const handleAddressDialogClose = () => {
        setIsAddressDialogOpen(false);
    };

    // Xử lý sau khi lưu (thêm/sửa) thành công
    const handleAddressSaveSuccess = () => {
        setIsAddressDialogOpen(false);
        fetchAddresses(); // Tải lại danh sách địa chỉ
    };

    // --- Event Handlers for Actions ---

    // Mở dialog xác nhận xóa
    const handleDeleteClick = (addressId) => {
        setAddressIdToDelete(addressId);
        setIsConfirmOpen(true);
    };

    // Xử lý sau khi xác nhận xóa
    const handleConfirmDelete = async () => {
        if (!addressIdToDelete) return;

        const result = await deleteData(`/api/address/${addressIdToDelete}`);
        if (result.success) {
            context.openAlerBox("success", result.message);
            fetchAddresses(); // Tải lại danh sách
        } else {
            context.openAlerBox("error", "Xóa thất bại.");
        }
        setIsConfirmOpen(false);
    };

    // Xử lý đặt địa chỉ làm mặc định
    const handleSetDefault = async (address) => {
        // API yêu cầu gửi toàn bộ object với status đã được cập nhật
        const updatedAddress = { ...address, status: true };

        const result = await updateData(`/api/address/${address._id}`, updatedAddress);
        if (result.success) {
            context.openAlerBox("success", "Đã cập nhật địa chỉ mặc định.");
            fetchAddresses(); // Tải lại danh sách
        } else {
            context.openAlerBox("error", "Cập nhật thất bại.");
        }
    };

    // --- Data Derivation for Rendering ---
    // Tách địa chỉ mặc định và các địa chỉ khác để hiển thị riêng
    const defaultAddress = addresses.find(addr => addr.status === true);
    const otherAddresses = addresses.filter(addr => addr.status !== true);

    // --- Conditional Rendering ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-40"><CircularProgress /></div>;
    }

    // --- Main Render ---
    return (
        <div className="space-y-8">
            {/* Hiển thị địa chỉ mặc định (nếu có) */}
            {defaultAddress && (
                <AddressCard
                    address={defaultAddress}
                    isDefault={true}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* Hiển thị danh sách các địa chỉ khác */}
            {otherAddresses.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Các địa chỉ khác</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherAddresses.map((address) => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                isDefault={false}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                onSetDefault={handleSetDefault}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Nút thêm địa chỉ mới */}
            <button
                onClick={handleAddClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-bold text-sm transition-all duration-200 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md"
            >
                <FiPlus className="text-lg" />
                <span>Thêm địa chỉ mới</span>
            </button>

            {/* Các Dialog được render ở đây nhưng chỉ hiển thị khi state `open` là true */}
            <AddressDialog
                open={isAddressDialogOpen}
                onClose={handleAddressDialogClose}
                onSaveSuccess={handleAddressSaveSuccess}
                addressToEdit={addressToEdit}
            />
            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa địa chỉ này không?"
            />
        </div>
    );
};

export default AddressManagementSection;