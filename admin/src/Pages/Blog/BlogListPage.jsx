import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchDataFromApi, deleteData } from '../../utils/api';

// --- Material-UI & Icon Imports ---
import {
    Typography, Button, Breadcrumbs, CircularProgress, IconButton, Tooltip, Chip
} from '@mui/material';
import { FiEdit, FiTrash2, FiPlus, FiAlertCircle, FiPackage } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

//================================================================================
// MAIN BLOG LIST PAGE COMPONENT
//================================================================================

/**
 * @component BlogListPage
 * @description Trang hiển thị danh sách tất cả bài viết blog, cho phép sửa và xóa.
 */
const BlogListPage = () => {
    // --- State Management ---
    const [blogs, setBlogs] = useState([]);                 // Lưu danh sách bài viết
    const [isLoading, setIsLoading] = useState(true);       // Trạng thái loading
    const [error, setError] = useState(null);               // Lưu thông báo lỗi nếu có
    const navigate = useNavigate();

    // --- Logic & Effects ---

    // Hàm tải danh sách bài viết, sử dụng useCallback để tránh tạo lại hàm mỗi lần render.
    const fetchBlogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchDataFromApi(`/api/blogs`);
            if (response.success) {
                setBlogs(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err.message);
            toast.error(`Lỗi khi tải bài viết: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependency rỗng vì hàm không phụ thuộc vào props hay state nào

    // Tải dữ liệu lần đầu khi component được mount
    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Xử lý xóa bài viết: hiển thị xác nhận, gọi API, và tải lại danh sách
    const handleDelete = async (blogId) => {
        // Sử dụng window.confirm đơn giản để xác nhận
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) {
            try {
                const result = await deleteData(`/api/blogs/${blogId}`);
                if (result.success) {
                    toast.success("Xóa bài viết thành công!");
                    fetchBlogs(); // Tải lại danh sách để cập nhật giao diện
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                toast.error(`Lỗi khi xóa: ${err.message}`);
            }
        }
    };

    /**
     * @function renderContent
     * @description Helper function để render nội dung chính của trang
     * dựa trên các trạng thái: loading, error, empty, hoặc success.
     */
    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center py-16"><CircularProgress /></div>;
        if (error) return <div className="text-center py-16 text-red-600"><FiAlertCircle className="mx-auto text-4xl mb-2" /><p>Đã xảy ra lỗi: {error}</p></div>;
        if (blogs.length === 0) return <div className="text-center py-16 text-gray-500"><FiPackage className="mx-auto text-4xl mb-2" /><p>Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p></div>;

        // Render bảng dữ liệu khi có dữ liệu
        return (
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th className="p-4">Ảnh đại diện</th>
                        <th className="p-4">Tiêu đề</th>
                        <th className="p-4">Tác giả</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4">Ngày tạo</th>
                        <th className="p-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog._id} className="border-b hover:bg-gray-50">
                            <td className="p-4"><img src={blog.featuredImage} alt={blog.title} className="w-24 h-14 object-cover rounded-md" /></td>
                            <td className="p-4 font-semibold text-gray-800">{blog.title}</td>
                            <td className="p-4">{blog.author?.name || 'N/A'}</td>
                            <td className="p-4">
                                {blog.isPublished
                                    ? <Chip label="Đã xuất bản" color="success" size="small" variant="outlined" />
                                    : <Chip label="Bản nháp" color="warning" size="small" variant="outlined" />
                                }
                            </td>
                            <td className="p-4">{new Date(blog.createdAt).toLocaleString('vi-VN')}</td>
                            <td className="p-4 text-center">
                                <Tooltip title="Sửa bài viết">
                                    <IconButton onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}><FiEdit /></IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa bài viết">
                                    <IconButton onClick={() => handleDelete(blog._id)}><FiTrash2 className="text-red-500" /></IconButton>
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // --- Render ---
    return (
        <section className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header của trang */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Quản lý Blog</Typography>
                    <Breadcrumbs separator={<FaAngleRight />}>
                        <Link to='/admin/dashboard' className="hover:underline">Dashboard</Link>
                        <Typography>Blog</Typography>
                    </Breadcrumbs>
                </div>
                <Button variant="contained" startIcon={<FiPlus />} onClick={() => navigate('/admin/blogs/new')}>
                    Thêm bài viết
                </Button>
            </div>

            {/* Phần thân trang chứa bảng dữ liệu */}
            <div className="bg-white rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default BlogListPage;