import MyListModel from "../models/mylist.model.js";

// Thêm sản phẩm vào My List
export const addToMyListController = async (request, response) => {
    try {
        const userId = request.userId;
        const {
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount
        } = request.body;

        // Kiểm tra xem sản phẩm đã có trong danh sách của người dùng chưa
        const item = await MyListModel.findOne({
            userId: userId,
            productId: productId
        });

        if (item) {
            return response.status(400).json({
                message: "Item already in my list"
            });
        }

        // Tạo một mục mới trong danh sách yêu thích
        const mylist = new MyListModel({
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount,
            userId
        });

        const save = await mylist.save();

        return response.status(200).json({
            error: false,
            success: true,
            message: "The product saved in the my list"
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Xóa sản phẩm khỏi My List
export const deleteToMyListController = async (request, response) => {
    try {
        const myListItem = await MyListModel.findById(request.params.id);

        if (!myListItem) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "The item with this given id was not found"
            });
        }

        const deletedItem = await MyListModel.findByIdAndDelete(request.params.id);

        if (!deletedItem) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "The item is not deleted"
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            message: "The item removed from My List"
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


// Lấy tất cả sản phẩm trong My List của người dùng hiện tại
export const getMyListController = async (request, response) => {
    try {
        const userId = request.userId;
        const mylistItems = await MyListModel.find({
            userId: userId
        });

        return response.status(200).json({
            error: false,
            success: true,
            data: mylistItems
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};