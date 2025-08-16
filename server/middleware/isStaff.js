const isStaff = (request, response, next) => {
    // Middleware này phải được dùng SAU middleware `auth`
    if (request.user && (request.user.role === 'STAFF' || request.user.role === 'ADMIN')) {
        next(); // Cho phép đi tiếp nếu là Staff hoặc Admin
    } else {
        response.status(403).json({
            message: "Truy cập bị từ chối. Yêu cầu quyền Staff hoặc Admin.",
            error: true,
            success: false,
        });
    }
};

export default isStaff;