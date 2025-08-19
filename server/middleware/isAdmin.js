const isAdmin = (request, response, next) => {
    if (request.user && request.user.role === 'ADMIN') {
        next();
    } else {
        response.status(403).json({
            message: "Truy cập bị từ chối. Yêu cầu quyền Admin.",
            error: true,
            success: false,
        });
    }
};

export default isAdmin;
