const isAdmin = (request, response, next) => {
    // `request.user` được cung cấp bởi middleware `auth` đã nâng cấp
    if (request.user && request.user.role === 'ADMIN') {
        next(); // Cho phép đi tiếp
    } else {
        response.status(403).json({
            message: "Truy cập bị từ chối. Yêu cầu quyền Admin.",
            error: true,
            success: false,
        });
    }
};

export default isAdmin;
