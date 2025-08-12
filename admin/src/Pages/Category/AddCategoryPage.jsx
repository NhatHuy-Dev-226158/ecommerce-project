import React, { useState, useEffect, useContext } from 'react';
import {
    Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl,
    InputLabel, Switch, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App'; // Điều chỉnh đường dẫn nếu cần
import { fetchDataFromApi, postData, uploadCategoryImages } from '../../utils/api'; // Điều chỉnh đường dẫn nếu cần

// --- COMPONENT GIAO DIỆN CON ---
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Danh mục', link: '/list-category' },
    { name: 'Thêm mới' }
];

// === COMPONENT TRANG CHÍNH ===
const AddCategoryPage = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [existingCategories, setExistingCategories] = useState([]);

    // State duy nhất để quản lý toàn bộ dữ liệu form
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

    // State riêng để quản lý file ảnh và ảnh xem trước
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // --- LẤY DANH SÁCH DANH MỤC CHA ---
    useEffect(() => {
        // Sử dụng URL đã thống nhất theo router của bạn: /api/category/
        fetchDataFromApi('/api/category/')
            .then(res => {
                if (res.success) {
                    // Backend trả về cấu trúc cây, chúng ta chỉ cần các danh mục gốc
                    // Bạn có thể cần lọc lại ở đây nếu API trả về cả danh mục con
                    setExistingCategories(res.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name) {
            context.openAlerBox("error", "Vui lòng nhập tên danh mục.");
            return;
        }

        setIsLoading(true);

        try {
            let imageUrls = [];
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('images', imageFile);

                // Sử dụng URL đã thống nhất: /api/category/uploadImages /api/category
                const uploadResult = await uploadCategoryImages('/api/category/uploadImages', imageFormData);
                if (uploadResult.success) {
                    imageUrls = uploadResult.data.images;
                } else {
                    throw new Error(uploadResult.message || 'Tải ảnh thất bại');
                }
            }

            // Tạo đối tượng dữ liệu cuối cùng để gửi đi
            const finalData = {
                name: formData.name,
                description: formData.description,
                isPublished: formData.isPublished,
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
                slug: formData.slug,
                images: imageUrls,
            };

            // Chỉ thêm parentId và parentCatName nếu nó có giá trị
            if (formData.parentId) {
                finalData.parentId = formData.parentId;
                finalData.parentCatName = formData.parentCatName;
            }

            // Sử dụng URL đã thống nhất: /api/category/create-category
            const createResult = await postData('/api/category/create-category', finalData);

            if (createResult.success) {
                context.openAlerBox("success", "Tạo danh mục thành công!");
                navigate('/list-category'); // Điều hướng về trang danh sách
            } else {
                throw new Error(createResult.message || 'Tạo danh mục thất bại');
            }

        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header và Breadcrumbs */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Thêm danh mục mới</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (
                                c.link ?
                                    <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> :
                                    <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>
                            ))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/list-category')} sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu danh mục'}
                        </Button>
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
        </section>
    );
};

export default AddCategoryPage;