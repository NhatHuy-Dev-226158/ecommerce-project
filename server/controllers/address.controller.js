import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
    try {
        const { address_line, city, state, pincode, country, status } = request.body;

        const userId = request.userId;

        if (!address_line || !city || !state || !country) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }

        // Kiểm tra xem userId có tồn tại không
        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized. User not found.",
                error: true,
                success: false
            });
        }

        if (status) {
            // Tìm và cập nhật tất cả các địa chỉ cũ của người dùng này thành không mặc định
            await AddressModel.updateMany({ userId: userId }, { $set: { status: false } });
        }

        const address = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            status,
            userId: userId
        });

        const savedAddress = await address.save();

        await UserModel.updateOne({ _id: userId }, {
            $push: { address_details: savedAddress._id }
        });

        return response.status(200).json({
            data: savedAddress,
            message: "Thêm địa chỉ thành công!",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getAddressesController = async (request, response) => {
    try {
        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({ message: "Unauthorized." });
        }

        const userWithAddresses = await UserModel.findById(userId).populate({
            path: 'address_details',
            model: 'address'
        });

        if (!userWithAddresses) {
            return response.status(404).json({ message: "User not found." });
        }

        return response.status(200).json({
            data: userWithAddresses.address_details,
            message: "Addresses fetched successfully.",
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Failed to fetch addresses.",
            error: true,
            success: false
        });
    }
};

export const updateAddressController = async (request, response) => {
    try {
        const { addressId } = request.params;
        const userId = request.userId;
        const updatedData = request.body;

        if (updatedData.status) {
            await AddressModel.updateMany(
                { userId: userId, _id: { $ne: addressId } },
                { $set: { status: false } }
            );
        }

        const address = await AddressModel.findOneAndUpdate(
            { _id: addressId, userId: userId },
            updatedData,
            { new: true }
        );

        if (!address) {
            return response.status(404).json({ message: "Address not found or you don't have permission to edit it." });
        }

        return response.status(200).json({
            data: address,
            message: "Address updated successfully!",
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

export const deleteAddressController = async (request, response) => {
    try {
        const { addressId } = request.params;
        const userId = request.userId;

        // 1. Xóa địa chỉ, đảm bảo nó thuộc về người dùng
        const addressToDelete = await AddressModel.findOneAndDelete({ _id: addressId, userId: userId });

        if (!addressToDelete) {
            return response.status(404).json({ message: "Address not found or you don't have permission to delete it." });
        }
        await AddressModel.deleteOne({ _id: addressId });
        // 2. Xóa tham chiếu đến địa chỉ này khỏi mảng address_details của người dùng
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { address_details: addressId } }
        );

        if (addressToDelete.status === true) {
            const newDefaultAddress = await AddressModel.findOne({ userId: userId }).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo giảm dần

            if (newDefaultAddress) {
                newDefaultAddress.status = true;
                await newDefaultAddress.save();
            }
        }
        return response.status(200).json({
            message: "Address deleted successfully!",
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};