import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
const auth = async (request, response, next) => {
    try {
        const token = request.headers?.authorization?.split(" ")[1];
        if (!token) {
            return response.status(401).json({ message: "Yêu cầu token để xác thực.", success: false });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decode) {
            return response.status(401).json({ message: "Token không hợp lệ.", error: true, success: false });
        }

        // Từ ID trong token, tìm người dùng trong database để lấy thông tin 
        const user = await UserModel.findById(decode.id).select('-password');
        if (!user) {
            return response.status(401).json({ message: "Không tìm thấy người dùng.", error: true, success: false });
        }

        // Gán toàn bộ đối tượng user cả role vào request
        request.user = user;
        request.userId = user._id;

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({ message: "Token đã hết hạn.", error: true, success: false, expired: true });
        }
        return response.status(401).json({ message: "Token không hợp lệ hoặc lỗi xác thực.", error: true, success: false });
    }
};

export default auth;