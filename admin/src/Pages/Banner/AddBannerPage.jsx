import React, { useContext, useState } from 'react';
import {
    Typography, InputAdornment, Button, Breadcrumbs, TextField, Switch, FormControlLabel, CircularProgress,
    Paper, Box,
    IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiLink, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { postData, uploadFiles } from '../../utils/api';

// --- COMPONENT GIAO DIỆN CON ---
const FormSection = ({ title, children, subtitle }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>}
        <div className="space-y-6">{children}</div>
    </Paper>
);

const ImageUploadBox = ({ title, recommendation, imagePreview, onImageChange, onRemoveImage }) => (
    <div>
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>{title}</Typography>
        <label
            htmlFor={`banner-image-${title}`}
            className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50"
        >
            <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
            <Typography variant="body2" mt={1}>
                Kéo thả hoặc <span className="font-bold text-indigo-600">chọn file</span>
            </Typography>
            <Typography variant="caption" color="text.secondary">{recommendation}</Typography>
            <input
                id={`banner-image-${title}`}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageChange}
            />
        </label>
        {imagePreview && (
            <Box sx={{ position: 'relative', mt: 2, width: '100%', aspectRatio: '16/9' }}>
                <img src={imagePreview} alt="Xem trước" className="w-full h-full rounded-md object-cover border" />
                <IconButton
                    onClick={onRemoveImage}
                    size="small"
                    sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.7)', '&:hover': { backgroundColor: 'white' } }}
                >
                    <FiX />
                </IconButton>
            </Box>
        )}
    </div>
);

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Banners', link: '/banner-list' },
    { name: 'Thêm mới' }
];

// === COMPONENT TRANG CHÍNH ===
const AddBannerPage = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // State cho ảnh
    const [desktopImage, setDesktopImage] = useState({ file: null, preview: '' });
    const [mobileImage, setMobileImage] = useState({ file: null, preview: '' });

    // State cho form
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        link: '',
        isPublished: true,
    });

    // Hàm xử lý chung
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSwitchChange = (e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }));

    // Hàm xử lý ảnh
    const handleImageChange = (setter) => (event) => {
        const file = event.target.files[0];
        if (file) {
            setter({ file: file, preview: URL.createObjectURL(file) });
        }
    };
    const removeImage = (setter) => () => setter({ file: null, preview: '' });

    // Hàm submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!formData.title || !formData.link || !desktopImage.file) {
            context.openAlerBox("error", "Vui lòng điền Tiêu đề, Đường dẫn và tải lên ít nhất ảnh Desktop.");
            return;
        }

        setIsLoading(true);

        try {
            let desktopImageUrl = '';
            let mobileImageUrl = '';

            // 1. Tải ảnh desktop lên
            const desktopFormData = new FormData();
            desktopFormData.append('images', desktopImage.file);
            const desktopUploadRes = await uploadFiles('/api/banners/upload', desktopFormData, true); // `true` để chỉ đây là form data

            if (desktopUploadRes.success) {
                desktopImageUrl = desktopUploadRes.data.images[0];
            } else {
                throw new Error(desktopUploadRes.message || 'Tải ảnh desktop thất bại.');
            }

            // 2. Tải ảnh mobile lên (nếu có)
            if (mobileImage.file) {
                const mobileFormData = new FormData();
                mobileFormData.append('images', mobileImage.file);
                const mobileUploadRes = await uploadFiles('/api/banners/upload', mobileFormData, true);
                if (mobileUploadRes.success) {
                    mobileImageUrl = mobileUploadRes.data.images[0];
                } else {
                    // Không ném lỗi ở đây để người dùng vẫn có thể lưu banner dù ảnh mobile lỗi
                    context.openAlerBox("error", "Tải ảnh mobile thất bại, banner vẫn sẽ được tạo với ảnh desktop.");
                }
            }

            // 3. Tạo đối tượng dữ liệu cuối cùng để gửi đi
            const finalData = {
                ...formData,
                desktopImage: desktopImageUrl,
                mobileImage: mobileImageUrl,
            };

            // 4. Gọi API để tạo banner
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
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Thêm Banner mới</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/banner-list')} sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu Banner'}
                        </Button>
                    </div>
                </div>

                {/* Layout chính */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="Nội dung Banner">
                            <TextField fullWidth label="Tiêu đề chính" name="title" value={formData.title} onChange={handleInputChange} helperText="Dòng chữ lớn nhất trên banner." />
                            <TextField fullWidth label="Tiêu đề phụ / Mô tả" name="subtitle" value={formData.subtitle} onChange={handleInputChange} multiline rows={2} helperText="Mô tả ngắn gọn, hấp dẫn." />
                            <TextField fullWidth label="Văn bản trên nút" name="buttonText" value={formData.buttonText} onChange={handleInputChange} placeholder="Ví dụ: Mua ngay" />
                            <TextField
                                fullWidth
                                label="Đường dẫn (URL)"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                placeholder="/san-pham/ao-thun-cao-cap"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><FiLink /></InputAdornment>,
                                }}
                                helperText="Khi người dùng nhấp vào banner, họ sẽ được chuyển đến URL này."
                            />
                        </FormSection>
                    </div>

                    {/* Cột phải */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Hình ảnh">
                            <ImageUploadBox
                                title="Ảnh cho Desktop"
                                recommendation="Tỷ lệ 16:9, rộng 1920px (Bắt buộc)"
                                imagePreview={desktopImage.preview}
                                onImageChange={handleImageChange(setDesktopImage)}
                                onRemoveImage={removeImage(setDesktopImage)}
                            />
                            <ImageUploadBox
                                title="Ảnh cho Mobile"
                                recommendation="Tỷ lệ 9:16, rộng 800px (Tùy chọn)"
                                imagePreview={mobileImage.preview}
                                onImageChange={handleImageChange(setMobileImage)}
                                onRemoveImage={removeImage(setMobileImage)}
                            />
                        </FormSection>

                        <FormSection title="Trạng thái">
                            <FormControlLabel
                                control={<Switch checked={formData.isPublished} onChange={handleSwitchChange} name="isPublished" />}
                                label={formData.isPublished ? "Đang hiển thị" : "Đã ẩn"}
                            />
                        </FormSection>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AddBannerPage;