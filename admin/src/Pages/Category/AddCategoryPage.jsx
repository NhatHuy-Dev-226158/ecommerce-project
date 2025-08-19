import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData, uploadFiles } from '../../utils/api';

// --- Material-UI & Icon Imports ---
import {
    Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl,
    InputLabel, Switch, IconButton, CircularProgress, InputAdornment
} from '@mui/material';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";


//================================================================================
// SUB-COMPONENTS & STATIC DATA
//================================================================================

// Component con để tạo section cho form, giúp code gọn gàng hơn
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

// Dữ liệu cho breadcrumbs
const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Danh mục', link: '/category-list' },
    { name: 'Thêm mới' }
];

//================================================================================
// MAIN ADD CATEGORY PAGE COMPONENT
//================================================================================

/**
 * @component AddCategoryPage
 * @description Trang cho phép người dùng tạo một danh mục sản phẩm mới.
 */
const AddCategoryPage = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [existingCategories, setExistingCategories] = useState([]); // Dùng cho dropdown danh mục cha
    const [formData, setFormData] = useState({
        name: '', description: '', parentId: '', parentCatName: '',
        isPublished: true, seoTitle: '', seoDescription: '', slug: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // --- Logic & Effects ---

    // Tải danh sách danh mục hiện có để làm danh mục cha
    useEffect(() => {
        fetchDataFromApi('/api/category/')
            .then(res => {
                if (res.success) setExistingCategories(res.data);
            })
            .catch(err => console.error("Lỗi tải danh mục cha:", err));
    }, []);

    // Các hàm xử lý sự kiện cho form inputs
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
            // Bước 1: Tải ảnh lên nếu có
            let imageUrls = [];
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('images', imageFile);
                const uploadResult = await uploadFiles('/api/category/uploadImages', imageFormData);
                if (uploadResult.success) {
                    imageUrls = uploadResult.data.images;
                } else {
                    throw new Error(uploadResult.message || 'Tải ảnh thất bại');
                }
            }

            // Bước 2: Chuẩn bị dữ liệu cuối cùng để gửi đi
            const finalData = { ...formData, images: imageUrls };
            // Xóa các trường không cần thiết trước khi gửi
            delete finalData.parentId;
            delete finalData.parentCatName;
            if (formData.parentId) {
                finalData.parentId = formData.parentId;
                finalData.parentCatName = formData.parentCatName;
            }

            // Bước 3: Gọi API để tạo danh mục
            const createResult = await postData('/api/category/create-category', finalData);
            if (createResult.success) {
                context.openAlerBox("success", "Tạo danh mục thành công!");
                navigate('/category-list');
            } else {
                throw new Error(createResult.message || 'Tạo danh mục thất bại');
            }

        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---
    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header của trang */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Thêm danh mục mới</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/category-list')} sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu danh mục'}
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
                            <TextField fullWidth label="Tiêu đề SEO" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} helperText="Tiêu đề hiển thị trên Google." />
                            <TextField fullWidth label="Mô tả meta" name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} multiline rows={3} helperText="Mô tả ngắn hiển thị dưới tiêu đề." />
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
                                <Typography variant="body1" mt={2}><span className="font-bold text-indigo-600">Chọn ảnh</span> để tải lên</Typography>
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

export default AddCategoryPage;