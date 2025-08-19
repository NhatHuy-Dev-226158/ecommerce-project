import React, { useState, useEffect, useContext } from 'react';
import {
    InputAdornment, Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl,
    InputLabel, Divider, IconButton, CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { fetchDataFromApi, postData, uploadFiles } from '../../utils/api';

//================================================================================
// SUB-COMPONENTS & HELPERS
//================================================================================

// Component con để tạo section cho form, giúp code gọn gàng
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

// Dữ liệu tĩnh cho breadcrumbs
const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Sản phẩm', link: '/product-list' },
    { name: 'Thêm mới' }
];

// Helper: "Làm phẳng" cấu trúc cây danh mục để hiển thị trong dropdown
const flattenCategories = (categories) => {
    let flatList = [];
    const traverse = (nodes, depth = 0) => {
        nodes.forEach(node => {
            flatList.push({ ...node, name: '— '.repeat(depth) + node.name });
            if (node.children && node.children.length > 0) {
                traverse(node.children, depth + 1);
            }
        });
    };
    traverse(categories);
    return flatList;
};

//================================================================================
// MAIN ADD PRODUCT PAGE COMPONENT
//================================================================================

/**
 * @component AddProductPage
 * @description Trang cho phép người dùng tạo một sản phẩm mới.
 */
const AddProductPage = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]); // Danh sách danh mục để chọn

    const [formData, setFormData] = useState({
        name: '', description: '', brand: '', price: '', oldPrice: '',
        category: '', countInStock: '', isFeatured: false, discount: 0,
    });
    const [imageFiles, setImageFiles] = useState([]);         // Mảng các file ảnh đã chọn
    const [imagePreviews, setImagePreviews] = useState([]);   // Mảng URL preview tương ứng

    // --- Logic & Effects ---

    // Tải danh sách danh mục khi component được mount
    useEffect(() => {
        fetchDataFromApi('/api/category/')
            .then(res => {
                if (res.success) {
                    const flatCategories = flattenCategories(res.data);
                    setCategories(flatCategories);
                }
            });
    }, []);

    // Cập nhật state của form khi người dùng nhập liệu
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // Xử lý khi người dùng chọn nhiều file ảnh
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // Xóa một ảnh khỏi danh sách đã chọn
    const removeImage = (indexToRemove) => {
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Xử lý logic khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation cơ bản
        if (!formData.name || !formData.category || !formData.price || !formData.countInStock) {
            return context.openAlerBox("error", "Vui lòng điền đầy đủ các trường bắt buộc (*).");
        }
        if (imageFiles.length === 0) {
            return context.openAlerBox("error", "Vui lòng tải lên ít nhất một hình ảnh.");
        }
        setIsLoading(true);

        try {
            // Bước 1: Tải tất cả ảnh lên server
            let imageUrls = [];
            if (imageFiles.length > 0) {
                const imageFormData = new FormData();
                for (const file of imageFiles) {
                    imageFormData.append('images', file);
                }
                const uploadResult = await uploadFiles('/api/products/uploadImages', imageFormData);
                if (uploadResult.success) {
                    imageUrls = uploadResult.data.images;
                } else {
                    throw new Error(uploadResult.message || 'Tải ảnh thất bại');
                }
            }

            // Bước 2: Chuẩn bị dữ liệu và gọi API tạo sản phẩm
            const finalData = { ...formData, images: imageUrls };
            const createResult = await postData('/api/products/', finalData);

            if (createResult.success) {
                context.openAlerBox("success", "Thêm sản phẩm thành công!");
                navigate('/product-list');
            } else {
                throw new Error(createResult.message || 'Thêm sản phẩm thất bại');
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
                        <Typography variant="h5" component="h1" fontWeight="bold">Thêm sản phẩm mới</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" sx={{ textTransform: 'none', borderRadius: '8px' }}>Lưu bản nháp</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng sản phẩm'}
                        </Button>
                    </div>
                </div>

                {/* Layout chính của form */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái: Thông tin và Hình ảnh */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="Thông tin cơ bản">
                            <TextField fullWidth label="Tên sản phẩm (*)" name="name" value={formData.name} onChange={handleInputChange} required />
                            <TextField fullWidth label="Thương hiệu (Brand)" name="brand" value={formData.brand} onChange={handleInputChange} />
                            <TextField fullWidth label="Mô tả" name="description" value={formData.description} onChange={handleInputChange} multiline rows={8} />
                        </FormSection>

                        <FormSection title="Hình ảnh sản phẩm (*)">
                            <label htmlFor="product-images-upload" className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                                <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                                <Typography variant="body1" mt={2}>Kéo thả file hoặc <span className="font-bold text-indigo-600">chọn file</span></Typography>
                                <input id="product-images-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 mt-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <img src={preview} alt={`Xem trước ${index + 1}`} className="w-full h-full rounded-md object-cover" />
                                        <IconButton size="small" onClick={() => removeImage(index)} sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white', '&:hover': { backgroundColor: 'grey.200' } }}><FiX /></IconButton>
                                    </div>
                                ))}
                            </div>
                        </FormSection>
                    </div>

                    {/* Cột phải: Phân loại, Giá & Kho hàng */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Phân loại">
                            <FormControl fullWidth>
                                <InputLabel>Danh mục (*)</InputLabel>
                                <Select label="Danh mục (*)" name="category" value={formData.category} onChange={handleInputChange} required>
                                    {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </FormSection>

                        <FormSection title="Giá & Kho hàng">
                            <TextField fullWidth type="number" label="Giá bán lẻ (*)" name="price" value={formData.price} onChange={handleInputChange} required InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }} />
                            <TextField fullWidth type="number" label="Giá gốc (để so sánh)" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }} />
                            <Divider />
                            <TextField fullWidth type="number" label="Số lượng tồn kho (*)" name="countInStock" value={formData.countInStock} onChange={handleInputChange} required />
                        </FormSection>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AddProductPage;