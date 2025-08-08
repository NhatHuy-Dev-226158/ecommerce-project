import React, { useState } from 'react';
import { Typography, Button, Breadcrumbs, MenuItem, Checkbox, TextField, Select, FormControl, InputLabel, Switch, Autocomplete, InputAdornment, Divider, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiUploadCloud, FiTag, FiDollarSign, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// Dữ liệu mẫu
const mainCategories = { 'Thịt': ['Thịt heo', 'Thịt bò', 'Thịt gà'], 'Rau củ': ['Rau ăn lá', 'Củ quả'] };
const tagOptions = ['thịt nướng', 'lẩu', 'hữu cơ', 'vietgap', 'đông lạnh'];
const breadcrumbsData = [{ name: 'Dashboard', link: '/' }, { name: 'Sản phẩm', link: '/product-list' }, { name: 'Thêm mới' }];

const allProductsStore = [
    { name: 'Gia vị ướp bò Knorr' }, { name: 'Xốt lẩu Thái Tomyum' }, { name: 'Rau muống VietGAP' }, { name: 'Nước chấm hải sản' }
];

// --- CÁC COMPONENT GIAO DIỆN CON  ---
// Card chung cho mỗi khối form, giúp code gọn gàng
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// === COMPONENT TRANG CHÍNH ===
const AddProductPage = () => {
    // State đơn giản để minh họa tính năng menu phụ thuộc
    const [mainCategory, setMainCategory] = useState('');
    const [customFields, setCustomFields] = useState([{ id: 1, key: '', value: '' }]);

    // Hàm thêm một trường tùy chỉnh mới
    const addCustomField = () => {
        setCustomFields([...customFields, { id: Date.now(), key: '', value: '' }]);
    };
    // Hàm xóa một trường tùy chỉnh
    const removeCustomField = (id) => {
        setCustomFields(customFields.filter(field => field.id !== id));
    };
    // Hàm cập nhật giá trị của trường tùy chỉnh
    const handleCustomFieldChange = (id, fieldName, value) => {
        const updatedFields = customFields.map(field =>
            field.id === id ? { ...field, [fieldName]: value } : field
        );
        setCustomFields(updatedFields);
    };

    return (
        <section className=" bg-gray-50">
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
                    <Button variant="contained" sx={{ textTransform: 'none', borderRadius: '8px' }}>Đăng sản phẩm</Button>
                </div>
            </div>

            {/* Layout chính của form */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Cột bên trái */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">

                    {/* Thông tin cơ bản */}
                    <FormSection title="1. Thông tin cơ bản">
                        <TextField fullWidth label="Tên sản phẩm" placeholder="Ví dụ: Thịt ba rọi heo rút sườn" variant="outlined" required />
                        <div className="flex gap-4">
                            <TextField fullWidth label="Mã sản phẩm (SKU)" placeholder="TH-BAROI-01" variant="outlined" helperText="Để trống để tự động tạo mã." />
                        </div>
                        <TextField fullWidth label="Mô tả đầy đủ" variant="outlined" multiline rows={8} placeholder="Mô tả chi tiết nguồn gốc, đặc điểm, cách chế biến..." />
                    </FormSection>

                    {/* Hình ảnh sản phẩm */}
                    <FormSection title="2. Hình ảnh sản phẩm">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                            <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                            <Typography variant="body1" mt={2}>Kéo thả file hoặc <span className="font-bold text-indigo-600 cursor-pointer">chọn file</span> để tải lên</Typography>
                            <Typography variant="caption" color="text.secondary">Hỗ trợ JPG, PNG (tối đa 5MB)</Typography>
                        </div>
                        {/* Đây là nơi hiển thị các ảnh đã tải lên */}
                        <div className="grid items-center justify-start grid-cols-9 md:grid-cols-9  !gap-2 !pt-2">
                            <img src="https://via.placeholder.com/80" alt="thumbnail" className="w-20 h-20 rounded-md object-cover border-2 border-indigo-500" />
                            <img src="https://via.placeholder.com/80" alt="thumbnail" className="w-20 h-20 rounded-md object-cover border-2 border-indigo-500" />
                            <img src="https://via.placeholder.com/80" alt="thumbnail" className="w-20 h-20 rounded-md object-cover border" />
                        </div>
                    </FormSection>

                    {/* Thuộc tính & Biến thể */}
                    <FormSection title="3. Thuộc tính & Biến thể">
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Thêm các biến thể như kích cỡ, trọng lượng cho sản phẩm. Ví dụ: Size 20 con/kg.</Typography>
                        <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span>Size: 20 con/kg</span>
                            <span>Giá: 550,000 đ</span>
                        </div>
                        <Button variant="text" startIcon={<FiPlus />}>Thêm biến thể</Button>
                    </FormSection>

                    {/* Tối ưu hóa SEO */}
                    <FormSection title="4. Tối ưu hóa SEO">
                        <TextField fullWidth label="Tiêu đề SEO" variant="outlined" helperText="Tiêu đề hiển thị trên Google, nên dưới 60 ký tự." />
                        <TextField fullWidth label="Mô tả meta" variant="outlined" multiline rows={3} helperText="Mô tả ngắn hiển thị dưới tiêu đề, nên dưới 160 ký tự." />
                        <TextField fullWidth label="Đường dẫn tĩnh (URL Slug)" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">/san-pham/</InputAdornment> }} />
                    </FormSection>

                    {/* Trường tùy chỉnh */}
                    <FormSection title="5. Trường tùy chỉnh">
                        <div className="space-y-3">
                            {customFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <TextField size="small" label={`Thuộc tính ${index + 1}`} placeholder="Ví dụ: Hướng dẫn sử dụng" className="flex-1" value={field.key} onChange={(e) => handleCustomFieldChange(field.id, 'key', e.target.value)} />
                                    <TextField size="small" label={`Giá trị ${index + 1}`} placeholder="Ví dụ: Dùng trực tiếp" className="flex-1" value={field.value} onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)} />
                                    <IconButton onClick={() => removeCustomField(field.id)} size="small" color="error"><FiX /></IconButton>
                                </div>
                            ))}
                        </div>
                        <Button variant="text" startIcon={<FiPlus />} onClick={addCustomField}>Thêm trường</Button>
                    </FormSection>
                </div>

                {/* Cột bên phải */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">

                    {/* Phân loại */}
                    <FormSection title="Phân loại">
                        <FormControl fullWidth>
                            <InputLabel>Danh mục chính</InputLabel>
                            <Select label="Danh mục chính" value={mainCategory} onChange={(e) => setMainCategory(e.target.value)}>
                                {Object.keys(mainCategories).map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {mainCategory && (
                            <FormControl fullWidth>
                                <InputLabel>Danh mục phụ</InputLabel>
                                <Select label="Danh mục phụ" defaultValue="">
                                    {mainCategories[mainCategory].map(subCat => <MenuItem key={subCat} value={subCat}>{subCat}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}
                        <TextField fullWidth label="Nhà cung cấp" variant="outlined" />
                        <Autocomplete multiple freeSolo options={tagOptions} renderInput={(params) => <TextField {...params} label="Thẻ (Tags) " />} />
                    </FormSection>

                    {/* Giá & Kho hàng */}
                    <FormSection title="Giá & Kho hàng">
                        <TextField fullWidth type="number" label="Giá bán lẻ" variant="outlined" required InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }} />
                        <TextField fullWidth type="number" label="Giá khuyến mãi" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">đ</InputAdornment> }} />
                        <Divider sx={{ my: 1 }} />
                        <TextField fullWidth type="number" label="Số lượng tồn kho" variant="outlined" />
                        <FormControl fullWidth>
                            <InputLabel>Tình trạng kho</InputLabel>
                            <Select label="Tình trạng kho" defaultValue="in_stock">
                                <MenuItem value="in_stock">Còn hàng</MenuItem>
                                <MenuItem value="out_of_stock">Hết hàng</MenuItem>
                                <MenuItem value="pre_order">Sắp có hàng</MenuItem>
                            </Select>
                        </FormControl>
                    </FormSection>

                    {/* Vận chuyển */}
                    <FormSection title="Vận chuyển">
                        <TextField fullWidth type="number" label="Trọng lượng (gram)" variant="outlined" />
                        <TextField fullWidth label="Kích thước (D x R x C)" variant="outlined" />
                    </FormSection>

                    {/* Sản phẩm đi kèm / Bán chéo */}
                    <FormSection title="Sản phẩm đi kèm / Bán chéo">
                        <Autocomplete
                            multiple
                            options={allProductsStore}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField {...params} label="Tìm & chọn sản phẩm" placeholder="Sản phẩm..." />
                            )}
                        />
                    </FormSection>
                </div>
            </div>
        </section>
    );
};

export default AddProductPage;