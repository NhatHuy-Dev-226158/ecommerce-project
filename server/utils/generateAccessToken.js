import jwt from 'jsonwebtoken'

const generateAccessToken = (userId) => {
    const token = jwt.sign({ id: userId },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: '24h' }
    )
    return token
}

export default generateAccessToken;