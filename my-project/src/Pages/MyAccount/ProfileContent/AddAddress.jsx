import React, { useState } from 'react';
import { useContext } from 'react';
import { MyContext } from '../../../App';
import { FiPlus } from 'react-icons/fi';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import ConfirmationDialog from './componets-Address/ConfirmationDialog';
import AddressDialog from './componets-Address/AddressDialog';
import AddressCard from './componets-Address/AddressCard';
import { deleteData, fetchDataFromApi, updateData } from '../../../utils/api';



// === COMPONENT CHA  DIALOG ===
const AddressManagementSection = () => {
    const context = useContext(MyContext);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);
    const [addressIdToDelete, setAddressIdToDelete] = useState(null);

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
    useEffect(() => { fetchAddresses(); }, [context]);

    const handleAddClick = () => {
        setAddressToEdit(null);
        setIsAddressDialogOpen(true);
    };

    // Mở dialog để SỬA
    const handleEditClick = (address) => {
        setAddressToEdit(address);
        setIsAddressDialogOpen(true);
    };

    // Mở dialog để XÓA
    const handleDeleteClick = (addressId) => {
        setAddressIdToDelete(addressId);
        setIsConfirmOpen(true);
    };

    // Đóng dialog Thêm/Sửa và làm mới dữ liệu
    const handleAddressDialogClose = () => {
        setIsAddressDialogOpen(false);
    };

    const handleAddressSaveSuccess = () => {
        setIsAddressDialogOpen(false);
        fetchAddresses();
    };

    const handleConfirmDelete = async () => {
        if (!addressIdToDelete) return;

        const result = await deleteData(`/api/address/${addressIdToDelete}`);
        if (result.success) {
            context.openAlerBox("success", result.message);
            fetchAddresses();
        } else {
            context.openAlerBox("error", "Xóa thất bại.");
        }
        setIsConfirmOpen(false);
    };

    const handleSetDefault = async (address) => {
        const updatedAddress = { ...address, status: true };

        const result = await updateData(`/api/address/${address._id}`, updatedAddress);
        if (result.success) {
            context.openAlerBox("success", "Đã cập nhật địa chỉ mặc định.");
            fetchAddresses();
        } else {
            context.openAlerBox("error", "Cập nhật thất bại.");
        }
    };

    const defaultAddress = addresses.find(addr => addr.status === true);
    const otherAddresses = addresses.filter(addr => addr.status !== true);

    if (isLoading) {
        return <div className="flex justify-center items-center h-40"><CircularProgress /></div>;
    }

    return (
        <div className="space-y-8">
            {defaultAddress && (
                <AddressCard
                    address={defaultAddress}
                    isDefault={true}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            )}
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
            <button
                onClick={handleAddClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3
                            bg-white border-2 border-gray-300 rounded-lg
                            text-gray-700 font-bold text-sm
                            transition-all duration-200
                            hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <FiPlus className="text-lg" />
                <span>Thêm địa chỉ mới</span>
            </button>

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