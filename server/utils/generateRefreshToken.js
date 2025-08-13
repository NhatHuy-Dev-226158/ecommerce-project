import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"


const generateRefreshToken = (userId) => {
    const token = jwt.sign({ id: userId },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: '30d' }
    )
    const updateRefreshTokenUser = UserModel.updateOne(
        { _id: userId },
        { refresh_token: token }
    )
    return token
}
export default generateRefreshToken
