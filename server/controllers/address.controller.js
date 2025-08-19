import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

/**
 * @route   POST /api/address/add
 * @desc    Thêm địa chỉ mới cho người dùng.
 * @access  Private
 */
export const addAddressController = async (request, response) => {
    try {
        const { address_line, city, state, pincode, country, status } = request.body;
        const userId = request.userId;

        // --- Validation ---
        if (!address_line || !city || !state || !country) {
            return response.status(400).json({
                message: "Vui lòng cung cấp đầy đủ các trường bắt buộc.",
                error: true,
                success: false
            });
        }

        if (!userId) {
            return response.status(401).json({
                message: "Không được phép. Người dùng không tồn tại.",
                error: true,
                success: false
            });
        }

        // Nếu địa chỉ mới được đặt làm mặc định, đảm bảo chỉ có một địa chỉ mặc định duy nhất.
        if (status) {
            await AddressModel.updateMany({ userId: userId }, { $set: { status: false } });
        }

        // --- Tạo và lưu địa chỉ mới ---
        const address = new AddressModel({
            address_line, city, state, pincode, country, status,
            userId: userId
        });
        const savedAddress = await address.save();

        // Thêm ID của địa chỉ mới vào danh sách tham chiếu của người dùng.
        await UserModel.updateOne(
            { _id: userId },
            { $push: { address_details: savedAddress._id } }
        );

        return response.status(201).json({ // 201 Created
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

/**
 * @route   GET /api/address/
 * @desc    Lấy tất cả địa chỉ của người dùng hiện tại.
 * @access  Private
 */
export const getAddressesController = async (request, response) => {
    try {
        const userId = request.userId;
        if (!userId) {
            return response.status(401).json({ message: "Unauthorized." });
        }

        // Dùng `populate` để lấy thông tin chi tiết của các địa chỉ.
        const userWithAddresses = await UserModel.findById(userId).populate({
            path: 'address_details',
            model: 'address'
        });

        if (!userWithAddresses) {
            return response.status(404).json({ message: "User not found." });
        }

        return response.status(200).json({
            data: userWithAddresses.address_details,
            message: "Lấy danh sách địa chỉ thành công.",
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Lấy danh sách địa chỉ thất bại.",
            error: true,
            success: false
        });
    }
};

/**
 * @route   PUT /api/address/update/:addressId
 * @desc    Cập nhật một địa chỉ của người dùng.
 * @access  Private
 */
export const updateAddressController = async (request, response) => {
    try {
        const { addressId } = request.params;
        const userId = request.userId;
        const updatedData = request.body;

        // Nếu địa chỉ đang cập nhật được set làm mặc định, các địa chỉ khác sẽ bị bỏ mặc định.
        if (updatedData.status) {
            await AddressModel.updateMany(
                { userId: userId, _id: { $ne: addressId } }, // $ne: not equal
                { $set: { status: false } }
            );
        }

        // Điều kiện `userId` đảm bảo người dùng chỉ có thể cập nhật địa chỉ của chính họ.
        const address = await AddressModel.findOneAndUpdate(
            { _id: addressId, userId: userId },
            updatedData,
            { new: true } // Trả về document sau khi đã cập nhật.
        );

        if (!address) {
            return response.status(404).json({ message: "Địa chỉ không tồn tại hoặc bạn không có quyền chỉnh sửa." });
        }

        return response.status(200).json({
            data: address,
            message: "Cập nhật địa chỉ thành công!",
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};

/**
 * @route   DELETE /api/address/delete/:addressId
 * @desc    Xóa một địa chỉ của người dùng.
 * @access  Private
 */
export const deleteAddressController = async (request, response) => {
    try {
        const { addressId } = request.params;
        const userId = request.userId;

        // Xóa địa chỉ, đồng thời xác thực quyền sở hữu qua `userId`.
        const addressToDelete = await AddressModel.findOneAndDelete({ _id: addressId, userId: userId });

        if (!addressToDelete) {
            return response.status(404).json({ message: "Địa chỉ không tồn tại hoặc bạn không có quyền xóa." });
        }

        // Xóa tham chiếu đến địa chỉ này khỏi document của người dùng.
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { address_details: addressId } }
        );

        // Nếu địa chỉ vừa xóa là mặc định, cần đặt một địa chỉ khác làm mặc định mới.
        if (addressToDelete.status === true) {
            // Lấy địa chỉ mới nhất để làm mặc định.
            const newDefaultAddress = await AddressModel.findOne({ userId: userId }).sort({ createdAt: -1 });

            if (newDefaultAddress) {
                newDefaultAddress.status = true;
                await newDefaultAddress.save();
            }
        }
        return response.status(200).json({
            message: "Xóa địa chỉ thành công!",
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true });
    }
};