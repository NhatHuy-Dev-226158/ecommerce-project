import React, { useState, useEffect, useContext } from 'react';
import {
    InputAdornment, Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl,
    InputLabel, Divider, IconButton, CircularProgress
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { fetchDataFromApi, updateData, uploadFiles } from '../../utils/api';

//================================================================================
// SUB-COMPONENTS & HELPERS
//================================================================================

// Component con để tạo section cho form
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

// Helper: "Làm phẳng" cấu trúc cây danh mục
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
// MAIN EDIT PRODUCT PAGE COMPONENT
//================================================================================

/**
 * @component EditProductPage
 * @description Trang cho phép người dùng chỉnh sửa thông tin của một sản phẩm đã có.
 */
const EditProductPage = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const { productId } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '', description: '', brand: '', price: '', oldPrice: '',
        category: '', countInStock: '', isFeatured: false, discount: 0,
    });
    // State để quản lý ảnh:
    const [imageFiles, setImageFiles] = useState([]);         // Mảng các file ảnh MỚI người dùng chọn
    const [imagePreviews, setImagePreviews] = useState([]);   // Mảng URL để hiển thị (bao gồm cả ảnh cũ và ảnh mới)
    const [oldImages, setOldImages] = useState([]);           // Mảng URL ảnh cũ từ server

    // --- Logic & Effects ---

    // Tải đồng thời dữ liệu sản phẩm và danh sách danh mục
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsFetchingData(true);
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    fetchDataFromApi(`/api/products/${productId}`),
                    fetchDataFromApi('/api/category/')
                ]);

                // Điền dữ liệu sản phẩm vào form
                if (productRes.success) {
                    const productData = productRes.product;
                    setFormData({
                        name: productData.name || '',
                        description: productData.description || '',
                        brand: productData.brand || '',
                        price: productData.price || '',
                        oldPrice: productData.oldPrice || '',
                        category: productData.category?._id || '',
                        countInStock: productData.countInStock || '',
                        isFeatured: productData.isFeatured || false,
                        discount: productData.discount || 0
                    });
                    if (productData.images && productData.images.length > 0) {
                        setOldImages(productData.images);
                        setImagePreviews(productData.images);
                    }
                } else {
                    throw new Error("Không tìm thấy sản phẩm.");
                }

                // Tải danh sách danh mục
                if (categoriesRes.success) {
                    const flatCategories = flattenCategories(categoriesRes.data);
                    setCategories(flatCategories);
                }

            } catch (error) {
                context.openAlerBox("error", error.message);
                navigate('/product-list');
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchInitialData();
    }, [productId, context, navigate]);

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // Thêm ảnh mới vào danh sách
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // Xóa một ảnh khỏi danh sách (cả ảnh mới và ảnh cũ)
    const removeImage = (indexToRemove) => {
        const removedPreview = imagePreviews[indexToRemove];
        // Xóa khỏi danh sách hiển thị
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));

        // Nếu ảnh bị xóa là ảnh mới (có URL dạng "blob:"), xóa nó khỏi `imageFiles`
        if (removedPreview.startsWith('blob:')) {
            // Tìm file tương ứng với blob URL để xóa
            // Đây là một cách tiếp cận đơn giản, có thể cần tối ưu nếu phức tạp hơn
            const fileIndexToRemove = imageFiles.findIndex(file => URL.createObjectURL(file) === removedPreview);
            if (fileIndexToRemove > -1) {
                setImageFiles(prev => prev.filter((_, index) => index !== fileIndexToRemove));
            }
        } else {
            // Nếu ảnh bị xóa là ảnh cũ (URL từ server), xóa nó khỏi `oldImages`
            setOldImages(prev => prev.filter(url => url !== removedPreview));
        }
    };

    // Xử lý logic khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validation cơ bản
        if (!formData.name || !formData.category || !formData.price || !formData.countInStock) {
            return context.openAlerBox("error", "Vui lòng điền đầy đủ các trường bắt buộc (*).");
        }
        if (imagePreviews.length === 0) {
            return context.openAlerBox("error", "Sản phẩm phải có ít nhất một hình ảnh.");
        }
        setIsLoading(true);
        try {
            // Bước 1: Chỉ tải lên các file ảnh MỚI
            let uploadedImageUrls = [];
            if (imageFiles.length > 0) {
                const imageFormData = new FormData();
                for (const file of imageFiles) {
                    imageFormData.append('images', file);
                }
                const uploadResult = await uploadFiles('/api/products/uploadImages', imageFormData);
                if (uploadResult && uploadResult.success) {
                    uploadedImageUrls = uploadResult.data.images;
                } else {
                    throw new Error(uploadResult.message || 'Tải ảnh mới thất bại');
                }
            }

            // Bước 2: Gộp danh sách ảnh cũ còn lại và ảnh mới đã upload
            const finalImageUrls = [...oldImages, ...uploadedImageUrls];
            const finalData = { ...formData, images: finalImageUrls };

            // Bước 3: Gọi API cập nhật sản phẩm
            const updateResult = await updateData(`/api/products/${productId}`, finalData);
            if (updateResult.success) {
                context.openAlerBox("success", "Cập nhật sản phẩm thành công!");
                navigate('/product-list');
            } else {
                throw new Error(updateResult.message || 'Cập nhật sản phẩm thất bại');
            }
        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Sản phẩm', link: '/product-list' },
        { name: isFetchingData ? 'Đang tải...' : `Sửa: ${formData.name}` }
    ];

    if (isFetchingData) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header của trang */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Sửa sản phẩm</Typography>
                        <Breadcrumbs separator={<FaAngleRight />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link}>{c.name}</Link> : <Typography key={i}>{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/product-list')}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}
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
                                <Typography variant="body1" mt={2}>Thêm ảnh mới</Typography>
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
                    <div className="w-full lg:w-1-3 flex flex-col gap-6">
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

export default EditProductPage;