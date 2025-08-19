import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { postData, uploadFiles } from '../../utils/api';

// --- Material-UI & Icon Imports ---
import {
    Typography, InputAdornment, Button, Breadcrumbs, TextField, Switch,
    FormControlLabel, CircularProgress, Paper, Box, IconButton
} from '@mui/material';
import { FiUploadCloud, FiLink, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";


//================================================================================
// UI SUB-COMPONENTS (COMPONENT CON GIAO DIỆN)
//================================================================================

/**
 * @component FormSection
 * @description Một component bao bọc (wrapper) nhất quán cho các phần của form,
 * sử dụng Paper của MUI để tạo giao diện thẻ.
 * @param {{ title: string, subtitle?: string, children: React.ReactNode }} props
 */
const FormSection = ({ title, children, subtitle }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>}
        <div className="space-y-6">{children}</div>
    </Paper>
);

/**
 * @component ImageUploadBox
 * @description Component chuyên dụng cho việc tải lên hình ảnh, hiển thị khu vực kéo thả,
 * xem trước ảnh và nút xóa.
 * @param {{ title: string, recommendation: string, imagePreview: string, onImageChange: Function, onRemoveImage: Function }} props
 */
const ImageUploadBox = ({ title, recommendation, imagePreview, onImageChange, onRemoveImage }) => (
    <div>
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>{title}</Typography>
        {/* Label bao quanh toàn bộ box để làm cho nó có thể click được */}
        <label
            htmlFor={`banner-image-${title}`}
            className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50"
        >
            <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
            <Typography variant="body2" mt={1}>Kéo thả hoặc <span className="font-bold text-indigo-600">chọn file</span></Typography>
            <Typography variant="caption" color="text.secondary">{recommendation}</Typography>
            <input id={`banner-image-${title}`} type="file" className="hidden" accept="image/*" onChange={onImageChange} />
        </label>
        {/* Vùng xem trước ảnh chỉ hiển thị khi có ảnh */}
        {imagePreview && (
            <Box sx={{ position: 'relative', mt: 2, width: '100%', aspectRatio: '16/9' }}>
                <img src={imagePreview} alt="Xem trước" className="w-full h-full rounded-md object-cover border" />
                <IconButton onClick={onRemoveImage} size="small" sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.7)', '&:hover': { backgroundColor: 'white' } }}>
                    <FiX />
                </IconButton>
            </Box>
        )}
    </div>
);

// Dữ liệu cho breadcrumbs để dễ quản lý
const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Banners', link: '/banner-list' },
    { name: 'Thêm mới' }
];

//================================================================================
// MAIN PAGE COMPONENT (COMPONENT TRANG CHÍNH)
//================================================================================

const AddBannerPage = () => {
    // --- HOOKS & CONTEXT ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // --- STATE MANAGEMENT ---
    // State cho hình ảnh, lưu cả file để upload và preview URL để hiển thị
    const [desktopImage, setDesktopImage] = useState({ file: null, preview: '' });
    const [mobileImage, setMobileImage] = useState({ file: null, preview: '' });
    // State cho dữ liệu form
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        link: '',
        isPublished: true,
    });

    // --- EVENT & DATA HANDLERS ---
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSwitchChange = (e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }));

    /**
     * @function handleImageChange
     * @description Higher-order function để xử lý việc thay đổi ảnh.
     * @param {React.Dispatch<React.SetStateAction<{file: File | null, preview: string}>>} setter - Hàm setState cho ảnh tương ứng.
     * @returns {Function} Một event handler cho input file.
     */
    const handleImageChange = (setter) => (event) => {
        const file = event.target.files[0];
        if (file) {
            setter({ file: file, preview: URL.createObjectURL(file) });
        }
    };

    /** Xóa ảnh đã chọn và preview của nó */
    const removeImage = (setter) => () => setter({ file: null, preview: '' });

    /**
     * @function handleSubmit
     * @description Xử lý toàn bộ logic khi submit form: validation, upload ảnh, và gửi dữ liệu banner.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 1. Validation cơ bản phía client
        if (!formData.title || !formData.link || !desktopImage.file) {
            context.openAlerBox("error", "Vui lòng điền Tiêu đề, Đường dẫn và tải lên ít nhất ảnh Desktop.");
            return;
        }

        setIsLoading(true);

        try {
            let desktopImageUrl = '';
            let mobileImageUrl = '';

            // 2. Tải ảnh desktop lên Cloudinary (hoặc dịch vụ lưu trữ khác)
            const desktopFormData = new FormData();
            desktopFormData.append('images', desktopImage.file);
            const desktopUploadRes = await uploadFiles('/api/banners/upload', desktopFormData);

            if (desktopUploadRes.success) {
                desktopImageUrl = desktopUploadRes.data.images[0];
            } else {
                throw new Error(desktopUploadRes.message || 'Tải ảnh desktop thất bại.');
            }

            // 3. Tải ảnh mobile lên (nếu người dùng đã chọn)
            if (mobileImage.file) {
                const mobileFormData = new FormData();
                mobileFormData.append('images', mobileImage.file);
                const mobileUploadRes = await uploadFiles('/api/banners/upload', mobileFormData);
                if (mobileUploadRes.success) {
                    mobileImageUrl = mobileUploadRes.data.images[0];
                } else {
                    context.openAlerBox("error", "Tải ảnh mobile thất bại, banner vẫn sẽ được tạo với ảnh desktop.");
                }
            }

            // 4. Chuẩn bị dữ liệu cuối cùng để gửi đến server
            const finalData = { ...formData, desktopImage: desktopImageUrl, mobileImage: mobileImageUrl };

            // 5. Gọi API để tạo banner mới trong database
            const createResult = await postData('/api/banners/', finalData);
            if (createResult.success) {
                context.openAlerBox("success", "Thêm banner thành công!");
                navigate('/banner-list');
            } else {
                throw new Error(createResult.message || "Thêm banner thất bại.");
            }

        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            // Dù thành công hay thất bại, luôn tắt trạng thái loading
            setIsLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Page Header: Tiêu đề, Breadcrumbs và các nút hành động */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Thêm Banner mới</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((crumb, index) => (
                                crumb.link ?
                                    <Link key={index} to={crumb.link} className="text-sm hover:underline">{crumb.name}</Link> :
                                    <Typography key={index} className="text-sm font-semibold">{crumb.name}</Typography>
                            ))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/banner-list')} sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu Banner'}
                        </Button>
                    </div>
                </div>

                {/* Main Layout: Bố cục 2 cột */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái: Nội dung form */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="Nội dung Banner">
                            <TextField fullWidth required label="Tiêu đề chính" name="title" value={formData.title} onChange={handleInputChange} helperText="Dòng chữ lớn nhất trên banner." />
                            <TextField fullWidth label="Tiêu đề phụ / Mô tả" name="subtitle" value={formData.subtitle} onChange={handleInputChange} multiline rows={2} helperText="Mô tả ngắn gọn, hấp dẫn." />
                            <TextField fullWidth label="Văn bản trên nút" name="buttonText" value={formData.buttonText} onChange={handleInputChange} placeholder="Ví dụ: Mua ngay" />
                            <TextField fullWidth required label="Đường dẫn (URL)" name="link" value={formData.link} onChange={handleInputChange} placeholder="/san-pham/ao-thun-cao-cap" InputProps={{ startAdornment: <InputAdornment position="start"><FiLink /></InputAdornment> }} helperText="Khi người dùng nhấp vào banner, họ sẽ được chuyển đến URL này." />
                        </FormSection>
                    </div>

                    {/* Cột phải: Hình ảnh và Trạng thái */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Hình ảnh">
                            <ImageUploadBox title="Ảnh cho Desktop" recommendation="Tỷ lệ 16:9, rộng 1920px (Bắt buộc)" imagePreview={desktopImage.preview} onImageChange={handleImageChange(setDesktopImage)} onRemoveImage={removeImage(setDesktopImage)} />
                            <ImageUploadBox title="Ảnh cho Mobile" recommendation="Tỷ lệ 9:16, rộng 800px (Tùy chọn)" imagePreview={mobileImage.preview} onImageChange={handleImageChange(setMobileImage)} onRemoveImage={removeImage(setMobileImage)} />
                        </FormSection>
                        <FormSection title="Trạng thái">
                            <FormControlLabel control={<Switch checked={formData.isPublished} onChange={handleSwitchChange} name="isPublished" />} label={formData.isPublished ? "Đang hiển thị" : "Đã ẩn"} />
                        </FormSection>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AddBannerPage;