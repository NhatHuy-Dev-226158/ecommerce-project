import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl, InputLabel, Switch, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { fetchDataFromApi, updateData, uploadFiles } from '../../utils/api';


// --- COMPONENT GIAO DIỆN CON ---
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

// === COMPONENT TRANG CHÍNH ===
const EditCategoryPage = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [existingCategories, setExistingCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: '',
        parentCatName: '',
        isPublished: true,
        seoTitle: '',
        seoDescription: '',
        slug: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [oldImages, setOldImages] = useState([]);

    // --- LOGIC FETCH DỮ LIỆU ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoryRes, allCategoriesRes] = await Promise.all([
                    fetchDataFromApi(`/api/category/${categoryId}`),
                    fetchDataFromApi('/api/category/')
                ]);

                if (categoryRes.success) {
                    const categoryData = categoryRes.category;
                    setFormData({
                        name: categoryData.name || '',
                        description: categoryData.description || '',
                        parentId: categoryData.parentId || '',
                        parentCatName: categoryData.parentCatName || '',
                        isPublished: categoryData.isPublished !== false,
                        seoTitle: categoryData.seoTitle || '',
                        seoDescription: categoryData.seoDescription || '',
                        slug: categoryData.slug || ''
                    });
                    if (categoryData.images && categoryData.images.length > 0) {
                        setOldImages(categoryData.images);
                        setImagePreview(categoryData.images[0]);
                    }
                } else {
                    throw new Error("Không tìm thấy danh mục.");
                }

                if (allCategoriesRes.success) {
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
    }, [categoryId]);

    // --- CÁC HÀM XỬ LÝ ---
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

    // Breadcrumbs được cập nhật động
    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Danh mục', link: '/category-list' },
        { name: isLoading ? 'Đang tải...' : `Sửa: ${formData.name}` }
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name) {
            context.openAlerBox("error", "Vui lòng nhập tên danh mục.");
            return;
        }

        setIsLoading(true);

        try {
            let finalImageUrls = oldImages;

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('images', imageFile);
                const uploadResult = await uploadFiles('/api/category/uploadImages', imageFormData);
                if (uploadResult.success) {
                    finalImageUrls = uploadResult.data.images;
                } else {
                    throw new Error(uploadResult.message || 'Tải ảnh thất bại');
                }
            }

            const finalData = {
                name: formData.name,
                description: formData.description,
                isPublished: formData.isPublished,
                images: finalImageUrls,
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
                slug: formData.slug
            };
            // -----------------------
            if (formData.parentId) {
                finalData.parentId = formData.parentId;
                finalData.parentCatName = formData.parentCatName;
            }

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

    // --- HIỂN THỊ LOADING ---
    if (isFetchingData) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }


    return (
        <section className="bg-gray-50">
            <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Sửa danh mục</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (
                                c.link ?
                                    <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> :
                                    <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>
                            ))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/category-list')}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading}> {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}</Button>
                    </div>
                </div>

                {/* Layout chính của form */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="1. Thông tin danh mục">
                            <TextField fullWidth label="Tên danh mục" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ví dụ: Thịt heo sạch" variant="outlined" required />
                            <FormControl fullWidth>
                                <InputLabel>Danh mục cha (Không bắt buộc)</InputLabel>
                                <Select label="Danh mục cha" value={formData.parentId} onChange={handleParentCategoryChange}>
                                    <MenuItem value=""><em>Không có (Đây là danh mục chính)</em></MenuItem>
                                    {existingCategories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField fullWidth label="Mô tả" name="description" value={formData.description} onChange={handleInputChange} variant="outlined" multiline rows={6} placeholder="Mô tả ngắn về danh mục này..." />
                        </FormSection>

                        <FormSection title="2. Tối ưu hóa SEO">
                            <TextField fullWidth label="Tiêu đề SEO" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} />
                            <TextField fullWidth label="Mô tả meta" name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} multiline rows={3} />
                            <TextField fullWidth label="Đường dẫn tĩnh (URL Slug)" name="slug" value={formData.slug} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start">/danh-muc/</InputAdornment> }} />
                        </FormSection>
                    </div>

                    {/* Cột phải */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Trạng thái">
                            <div className="flex justify-between items-center">
                                <Typography>Hiển thị</Typography>
                                <Switch checked={formData.isPublished} onChange={handleSwitchChange} name="isPublished" />
                            </div>
                            <Typography variant="caption" color="text.secondary">
                                {formData.isPublished ? 'Danh mục sẽ được hiển thị công khai.' : 'Ẩn danh mục này khỏi cửa hàng.'}
                            </Typography>
                        </FormSection>

                        <FormSection title="Ảnh đại diện">
                            <label htmlFor="category-image-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer block">
                                <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                                <Typography variant="body1" mt={2}>
                                    <span className="font-bold text-indigo-600">Chọn ảnh</span> để tải lên
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    (Tỷ lệ 1:1, tối đa 2MB)
                                </Typography>
                                <input id="category-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            {imagePreview && (
                                <div className="relative mt-4 w-40 h-40 mx-auto">
                                    <img src={imagePreview} alt="Xem trước" className="w-full h-full rounded-md object-cover border" />
                                    <IconButton onClick={removeImage} size="small" sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white', '&:hover': { backgroundColor: 'grey.200' } }}>
                                        <FiX />
                                    </IconButton>
                                </div>
                            )}
                        </FormSection>
                    </div>
                </div>
            </form>
        </section >
    );
};

export default EditCategoryPage;