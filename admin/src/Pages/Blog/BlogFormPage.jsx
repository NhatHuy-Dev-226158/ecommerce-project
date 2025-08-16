// File: src/pages/admin/BlogFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Button, Breadcrumbs, TextField, Paper, CircularProgress, Switch, FormControlLabel, Box } from '@mui/material';
import { FiSave, FiUpload } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { fetchDataFromApi } from '../../utils/api';

// --- CÁC HÀM API ĐỂ XỬ LÝ FORMDATA ---
// Bạn cần đảm bảo 2 hàm này đã có trong file `utils/api.js` của bạn
const postDataWithFile = async (url, formData) => {
    try {
        const token = localStorage.getItem("accesstoken");
        const response = await fetch(import.meta.env.VITE_API_URL + url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: error.message };
    }
};

const updateDataWithFile = async (url, formData) => {
    try {
        const token = localStorage.getItem("accesstoken");
        const response = await fetch(import.meta.env.VITE_API_URL + url, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: error.message };
    }
};

// === COMPONENT CHÍNH ===
const BlogFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        isPublished: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setIsFetching(true);
            // Sửa lại endpoint cho đúng với route của bạn
            fetchDataFromApi(`/api/blogs/${id}`)
                .then(res => {
                    if (res.success) {
                        const blog = res.data;
                        setFormData({
                            title: blog.title,
                            content: blog.content,
                            excerpt: blog.excerpt,
                            category: blog.category,
                            tags: blog.tags.join(', '),
                            isPublished: blog.isPublished,
                        });
                        setImagePreview(blog.featuredImage);
                    } else { toast.error(res.message); }
                })
                .catch(err => toast.error("Không thể tải dữ liệu bài viết."))
                .finally(() => setIsFetching(false));
        }
    }, [id, isEditing]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, content, excerpt, category } = formData;
        if (!title || !content || !excerpt || !category || !imagePreview) {
            return toast.error("Vui lòng điền đầy đủ các trường bắt buộc và tải ảnh đại diện.");
        }
        setIsLoading(true);

        const dataToSubmit = new FormData();
        for (const key in formData) {
            dataToSubmit.append(key, formData[key]);
        }
        if (imageFile) {
            dataToSubmit.append('featuredImage', imageFile);
        }

        try {
            const result = isEditing
                ? await updateDataWithFile(`/api/blogs/${id}`, dataToSubmit)
                : await postDataWithFile('/api/blogs', dataToSubmit);

            if (result.success) {
                toast.success(isEditing ? "Cập nhật thành công!" : "Tạo bài viết thành công!");
                navigate('/admin/blogs');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast.error(`Lỗi: ${error.message || 'Đã có lỗi xảy ra'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;

    return (
        <section className="p-4 md:p-6 bg-gray-50">
            <Typography variant="h5" fontWeight="bold">{isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</Typography>
            <Breadcrumbs separator={<FaAngleRight />} sx={{ my: 2 }}>
                <Link to='/admin/dashboard' className="hover:underline">Dashboard</Link>
                <Link to='/admin/blogs' className="hover:underline">Blog</Link>
                <Typography>{isEditing ? 'Sửa' : 'Tạo mới'}</Typography>
            </Breadcrumbs>

            <form onSubmit={handleSubmit}>
                <Paper sx={{ p: 3, mt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
                    {/* Cột trái: Tiêu đề và Nội dung */}
                    <Box className="space-y-4">
                        <TextField fullWidth name="title" label="Tiêu đề" value={formData.title} onChange={handleInputChange} required />

                        {/* === THAY THẾ TRÌNH SOẠN THẢO BẰNG TEXTFIELD THƯỜNG === */}
                        <TextField
                            fullWidth
                            multiline
                            rows={15} // Tăng số dòng để có không gian viết
                            name="content"
                            label="Nội dung"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                        />
                    </Box>

                    {/* Cột phải: Các thông tin khác */}
                    <Box className="space-y-4">
                        <TextField fullWidth multiline rows={4} name="excerpt" label="Đoạn trích ngắn (Excerpt)" value={formData.excerpt} onChange={handleInputChange} required />
                        <TextField fullWidth name="category" label="Danh mục" value={formData.category} onChange={handleInputChange} required />
                        <TextField fullWidth name="tags" label="Tags (phân cách bởi dấu phẩy)" value={formData.tags} onChange={handleInputChange} />
                        <Box border={1} p={2} borderRadius={1} borderColor="divider">
                            <Typography sx={{ mb: 1, color: 'text.secondary', fontSize: '0.8rem' }}>Ảnh đại diện</Typography>
                            <Button fullWidth variant="outlined" component="label" startIcon={<FiUpload />}> Tải ảnh lên <input type="file" hidden accept="image/*" onChange={handleImageChange} /> </Button>
                            {imagePreview && <img src={imagePreview} alt="preview" className="mt-3 w-full h-48 object-cover rounded-md border" />}
                        </Box>
                        <FormControlLabel control={<Switch name="isPublished" checked={formData.isPublished} onChange={handleInputChange} />} label={formData.isPublished ? "Công khai" : "Lưu nháp"} />
                        <Button fullWidth type="submit" variant="contained" size="large" startIcon={<FiSave />} disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu bài viết')}
                        </Button>
                    </Box>
                </Paper>
            </form>
        </section>
    );
};

export default BlogFormPage;