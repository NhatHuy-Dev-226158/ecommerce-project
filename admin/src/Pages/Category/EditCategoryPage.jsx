import React, { useState, useEffect } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl, InputLabel, Switch, InputAdornment, CircularProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { FiUploadCloud } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// --- DỮ LIỆU MẪU ---
// Dữ liệu này sẽ được lấy từ API trong thực tế
const existingMainCategories = [
    { id: 'cat1', name: 'Thịt' },
    { id: 'cat2', name: 'Rau củ' },
    { id: 'cat3', name: 'Hải sản' }
];

// Dữ liệu mẫu cho một danh mục cụ thể khi vào trang sửa
const mockCategoryDataToEdit = {
    id: 'subcat1',
    name: 'Thịt heo',
    description: 'Thịt heo tươi sạch từ trang trại VietGAP.',
    parentCategoryId: 'cat1', // Thuộc danh mục 'Thịt'
    isPublished: true,
    imageUrl: 'https://via.placeholder.com/150/ff0000',
    seoTitle: 'Thịt heo sạch | Giá tốt nhất',
    seoDescription: 'Mua thịt heo sạch, đảm bảo chất lượng, giao hàng tận nơi.',
    slug: 'thit-heo'
};


// --- COMPONENT GIAO DIỆN CON ---
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


// === COMPONENT TRANG CHÍNH ===
const EditCategoryPage = () => {
    // Lấy categoryId từ URL, ví dụ: /edit-category/subcat1
    const { categoryId } = useParams();

    // State để quản lý dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentCategoryId: '',
        isPublished: true,
        imageUrl: '',
        seoTitle: '',
        seoDescription: '',
        slug: ''
    });

    const [isLoading, setIsLoading] = useState(true); // State để hiển thị loading khi fetch dữ liệu

    // --- LOGIC MỚI: NẠP DỮ LIỆU KHI VÀO TRANG ---
    useEffect(() => {
        // Trong ứng dụng thực tế, bạn sẽ gọi API ở đây
        // GET /api/categories/{categoryId}
        console.log(`Fetching data for category ID: ${categoryId}`);

        // Giả lập việc gọi API
        setTimeout(() => {
            setFormData({
                name: mockCategoryDataToEdit.name,
                description: mockCategoryDataToEdit.description,
                parentCategoryId: mockCategoryDataToEdit.parentCategoryId,
                isPublished: mockCategoryDataToEdit.isPublished,
                imageUrl: mockCategoryDataToEdit.imageUrl,
                seoTitle: mockCategoryDataToEdit.seoTitle,
                seoDescription: mockCategoryDataToEdit.seoDescription,
                slug: mockCategoryDataToEdit.slug
            });
            setIsLoading(false);
        }, 1000); // Giả lập độ trễ 1 giây

    }, [categoryId]); // Chạy lại khi categoryId thay đổi

    // Hàm xử lý thay đổi cho các trường input
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Hàm xử lý cho Switch
    const handleSwitchChange = (event) => {
        setFormData(prevState => ({ ...prevState, isPublished: event.target.checked }));
    };

    // Breadcrumbs được cập nhật động
    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Danh mục', link: '/category-list' },
        { name: isLoading ? 'Đang tải...' : `Sửa: ${formData.name}` }
    ];

    // --- HIỂN THỊ LOADING ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    return (
        <section className="bg-gray-50">
            {/* Header của trang */}
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
                    <Button variant="outlined" color="error" sx={{ textTransform: 'none', borderRadius: '8px' }}>Xóa danh mục</Button>
                    <Button variant="contained" sx={{ textTransform: 'none', borderRadius: '8px' }}>Lưu thay đổi</Button>
                </div>
            </div>

            {/* Layout chính của form */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    <FormSection title="1. Thông tin danh mục">
                        <TextField fullWidth label="Tên danh mục" name="name" value={formData.name} onChange={handleInputChange} variant="outlined" required />
                        <FormControl fullWidth>
                            <InputLabel>Danh mục cha (Không bắt buộc)</InputLabel>
                            <Select label="Danh mục cha (Không bắt buộc)" name="parentCategoryId" value={formData.parentCategoryId} onChange={handleInputChange}>
                                <MenuItem value=""><em>Không có (Đây là danh mục chính)</em></MenuItem>
                                {existingMainCategories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Mô tả" name="description" value={formData.description} onChange={handleInputChange} variant="outlined" multiline rows={6} />
                    </FormSection>

                    <FormSection title="2. Tối ưu hóa SEO">
                        <TextField fullWidth label="Tiêu đề SEO" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} variant="outlined" />
                        <TextField fullWidth label="Mô tả meta" name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} multiline rows={3} variant="outlined" />
                        <TextField fullWidth label="Đường dẫn tĩnh (URL Slug)" name="slug" value={formData.slug} onChange={handleInputChange} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">/danh-muc/</InputAdornment> }} />
                    </FormSection>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <FormSection title="Trạng thái">
                        <div className="flex justify-between items-center">
                            <Typography>Hiển thị</Typography>
                            <Switch checked={formData.isPublished} onChange={handleSwitchChange} />
                        </div>
                    </FormSection>

                    <FormSection title="Ảnh đại diện">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                            <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                            <Typography variant="body1" mt={2}><span className="font-bold text-indigo-600">Thay đổi ảnh</span></Typography>
                        </div>
                        {formData.imageUrl && (
                            <div className="mt-4 flex justify-center">
                                <img src={formData.imageUrl} alt="category thumbnail" className="w-40 h-40 rounded-md object-cover border" />
                            </div>
                        )}
                    </FormSection>
                </div>
            </div>
        </section>
    );
};

export default EditCategoryPage;