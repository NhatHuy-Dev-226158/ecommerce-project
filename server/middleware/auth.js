import jwt from 'jsonwebtoken';



const auth = (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")
        [1];

        // if (!token) {
        //     token = request.query.token;
        // }

        if (!token) {
            return response.status(401).json({
                message: "A token is required for authentication.",
                success: false
            });
        }

        console.log("SECRET KEY BEING USED IN AUTH:", process.env.SECRET_KEY_ACCESS_TOKEN);

        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode) {
            return response.status(401).json({
                message: "unauthorized access",
                error: true,
                success: false
            })
        }

        request.userId = decode.id

        next()

    } catch (error) {

        console.error('--- AUTH MIDDLEWARE FAILED ---');
        console.error('ERROR NAME:', error.name);
        console.error('ERROR MESSAGE:', error.message);

        // console.error("ERROR IN AUTH MIDDLEWARE:", error.name, error.message);
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({
                message: "Token has expired.",
                error: true,
                success: false,
                expired: true
            });
        }
        return response.status(401).json({
            message: "Invalid Token.",
            error: true,
            success: false
        });
    }
}

export default auth;