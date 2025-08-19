import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, updateData, uploadFiles } from '../../utils/api';

// --- Material-UI & Icon Imports ---
import {
    Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl,
    InputLabel, Switch, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

//================================================================================
// SUB-COMPONENT
//================================================================================

// Tái sử dụng component con để tạo section cho form
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

//================================================================================
// MAIN EDIT CATEGORY PAGE COMPONENT
//================================================================================

/**
 * @component EditCategoryPage
 * @description Trang cho phép người dùng chỉnh sửa thông tin của một danh mục đã có.
 */
const EditCategoryPage = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const { categoryId } = useParams(); // Lấy ID từ URL
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [existingCategories, setExistingCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '', parentId: '', parentCatName: '',
        isPublished: true, seoTitle: '', seoDescription: '', slug: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [oldImages, setOldImages] = useState([]); // Lưu lại URL ảnh cũ

    // --- Logic & Effects ---

    // Effect: Tải đồng thời dữ liệu của danh mục cần sửa và danh sách tất cả danh mục
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Sử dụng Promise.all để gửi 2 request song song, tiết kiệm thời gian
                const [categoryRes, allCategoriesRes] = await Promise.all([
                    fetchDataFromApi(`/api/category/${categoryId}`),
                    fetchDataFromApi('/api/category/')
                ]);

                // Xử lý dữ liệu của danh mục cần sửa
                if (categoryRes.success) {
                    const categoryData = categoryRes.category;
                    setFormData({
                        name: categoryData.name || '',
                        description: categoryData.description || '',
                        parentId: categoryData.parentId || '',
                        parentCatName: categoryData.parentCatName || '',
                        isPublished: categoryData.isPublished !== false, // Đảm bảo là boolean
                        seoTitle: categoryData.seoTitle || '',
                        seoDescription: categoryData.seoDescription || '',
                        slug: categoryData.slug || ''
                    });
                    if (categoryData.images && categoryData.images.length > 0) {
                        setOldImages(categoryData.images);
                        setImagePreview(categoryData.images[0]); // Hiển thị ảnh cũ
                    }
                } else {
                    throw new Error("Không tìm thấy danh mục.");
                }

                // Xử lý danh sách tất cả danh mục (để chọn danh mục cha)
                if (allCategoriesRes.success) {
                    // Loại bỏ chính danh mục đang sửa ra khỏi danh sách cha
                    setExistingCategories(allCategoriesRes.data.filter(cat => cat._id !== categoryId));
                }
            } catch (error) {
                context.openAlerBox("error", error.message);
                navigate('/category-list');
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchInitialData();
    }, [categoryId, context, navigate]);

    // --- Các hàm xử lý sự kiện cho form ---
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    const handleSwitchChange = (event) => {
        setFormData(prevState => ({ ...prevState, isPublished: event.target.checked }));
    };
    const handleParentCategoryChange = (event) => {
        const parentId = event.target.value;
        const parentCategory = existingCategories.find(cat => cat._id === parentId);
        setFormData(prevState => ({
            ...prevState,
            parentId: parentId,
            parentCatName: parentCategory ? parentCategory.name : ''
        }));
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setOldImages([]); // Cũng xóa ảnh cũ nếu người dùng nhấn xóa
    };

    // Xử lý logic khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name) {
            context.openAlerBox("error", "Vui lòng nhập tên danh mục.");
            return;
        }
        setIsLoading(true);

        try {
            let finalImageUrls = oldImages;

            // Nếu người dùng chọn ảnh mới, tải ảnh đó lên
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('images', imageFile);
                const uploadResult = await uploadFiles('/api/category/uploadImages', imageFormData);
                if (uploadResult.success) {
                    finalImageUrls = uploadResult.data.images;
                } else {
                    throw new Error(uploadResult.message || 'Tải ảnh thất bại');
                }
            } else if (imagePreview === '') {
                // Nếu người dùng xóa ảnh mà không chọn ảnh mới
                finalImageUrls = [];
            }


            // Chuẩn bị dữ liệu để gửi đi
            const finalData = { ...formData, images: finalImageUrls };
            delete finalData.parentId;
            delete finalData.parentCatName;
            if (formData.parentId) {
                finalData.parentId = formData.parentId;
                finalData.parentCatName = formData.parentCatName;
            }


            // Gọi API để cập nhật
            const updateResult = await updateData(`/api/category/${categoryId}`, finalData);
            if (updateResult.success) {
                context.openAlerBox("success", "Cập nhật danh mục thành công!");
                navigate('/category-list');
            } else {
                throw new Error(updateResult.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    // Breadcrumbs được cập nhật động
    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Danh mục', link: '/category-list' },
        { name: isFetchingData ? 'Đang tải...' : `Sửa: ${formData.name}` }
    ];

    // Màn hình loading ban đầu
    if (isFetchingData) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header của trang */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Sửa danh mục</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/category-list')}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </div>

                {/* Layout chính của form */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái: Thông tin chính và SEO */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="1. Thông tin danh mục">
                            <TextField fullWidth label="Tên danh mục" name="name" value={formData.name} onChange={handleInputChange} required />
                            <FormControl fullWidth>
                                <InputLabel>Danh mục cha (Không bắt buộc)</InputLabel>
                                <Select label="Danh mục cha" value={formData.parentId} onChange={handleParentCategoryChange}>
                                    <MenuItem value=""><em>Không có (Đây là danh mục chính)</em></MenuItem>
                                    {existingCategories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField fullWidth label="Mô tả" name="description" value={formData.description} onChange={handleInputChange} multiline rows={6} />
                        </FormSection>
                        <FormSection title="2. Tối ưu hóa SEO">
                            <TextField fullWidth label="Tiêu đề SEO" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} />
                            <TextField fullWidth label="Mô tả meta" name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} multiline rows={3} />
                            <TextField fullWidth label="Đường dẫn tĩnh (URL Slug)" name="slug" value={formData.slug} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start">/danh-muc/</InputAdornment> }} />
                        </FormSection>
                    </div>

                    {/* Cột phải: Trạng thái và Ảnh */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Trạng thái">
                            <div className="flex justify-between items-center">
                                <Typography>Hiển thị</Typography>
                                <Switch checked={formData.isPublished} onChange={handleSwitchChange} name="isPublished" />
                            </div>
                            <Typography variant="caption" color="text.secondary">{formData.isPublished ? 'Danh mục sẽ được hiển thị công khai.' : 'Ẩn danh mục này khỏi cửa hàng.'}</Typography>
                        </FormSection>
                        <FormSection title="Ảnh đại diện">
                            <label htmlFor="category-image-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer block">
                                <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                                <Typography variant="body1" mt={2}><span className="font-bold text-indigo-600">Chọn ảnh</span> để thay thế</Typography>
                                <Typography variant="caption" color="text.secondary">(Tỷ lệ 1:1, tối đa 2MB)</Typography>
                                <input id="category-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            {imagePreview && (
                                <div className="relative mt-4 w-40 h-40 mx-auto">
                                    <img src={imagePreview} alt="Xem trước" className="w-full h-full rounded-md object-cover border" />
                                    <IconButton onClick={removeImage} size="small" sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white', '&:hover': { backgroundColor: 'grey.200' } }}><FiX /></IconButton>
                                </div>
                            )}
                        </FormSection>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default EditCategoryPage;