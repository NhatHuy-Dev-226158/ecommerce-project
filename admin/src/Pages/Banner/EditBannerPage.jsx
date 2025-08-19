import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, updateData, uploadFiles } from '../../utils/api';

// --- Material-UI & Icon Imports ---
import {
    Typography, Button, Breadcrumbs, TextField, Switch, FormControlLabel, CircularProgress,
    Paper, Box, IconButton, InputAdornment
} from '@mui/material';
import { FiUploadCloud, FiLink, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";


//================================================================================
// SUB-COMPONENTS (Tái sử dụng từ trang AddBanner)
//================================================================================

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
            htmlFor={`banner-image-${title.replace(/\s/g, '-')}`}
            className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50"
        >
            <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
            <Typography variant="body2" mt={1}>Kéo thả hoặc <span className="font-bold text-indigo-600">chọn file</span></Typography>
            <Typography variant="caption" color="text.secondary">{recommendation}</Typography>
            <input id={`banner-image-${title.replace(/\s/g, '-')}`} type="file" className="hidden" accept="image/*" onChange={onImageChange} />
        </label>
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


//================================================================================
// MAIN EDIT PAGE COMPONENT
//================================================================================

const EditBannerPage = () => {
    // --- Hooks ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const { bannerId } = useParams(); // Lấy ID của banner từ URL

    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi submit form
    const [isFetchingData, setIsFetchingData] = useState(true); // Trạng thái loading khi tải dữ liệu ban đầu
    const [desktopImage, setDesktopImage] = useState({ file: null, preview: '' }); // Quản lý ảnh desktop (file mới & URL preview)
    const [mobileImage, setMobileImage] = useState({ file: null, preview: '' }); // Quản lý ảnh mobile
    const [formData, setFormData] = useState({
        title: '', subtitle: '', buttonText: '', link: '', isPublished: true,
    });

    // --- Logic ---

    // Effect: Tải dữ liệu của banner cần sửa khi component được mount
    useEffect(() => {
        const fetchBannerData = async () => {
            setIsFetchingData(true);
            try {
                const result = await fetchDataFromApi(`/api/banners/${bannerId}`);
                if (!result.success) throw new Error(result.message || "Không thể tải dữ liệu banner.");

                const bannerData = result.data;
                // Điền dữ liệu lấy từ API vào form
                setFormData({
                    title: bannerData.title || '',
                    subtitle: bannerData.subtitle || '',
                    buttonText: bannerData.buttonText || '',
                    link: bannerData.link || '',
                    isPublished: bannerData.isPublished,
                });
                // Hiển thị ảnh cũ từ server
                setDesktopImage({ file: null, preview: bannerData.desktopImage || '' });
                setMobileImage({ file: null, preview: bannerData.mobileImage || '' });

            } catch (error) {
                context.openAlerBox("error", error.message);
                navigate('/banner-list'); // Điều hướng về trang danh sách nếu có lỗi
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchBannerData();
    }, [bannerId, navigate, context]);


    // Các hàm xử lý sự kiện cho form inputs
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSwitchChange = (e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }));
    const handleImageChange = (setter) => (event) => {
        const file = event.target.files[0];
        if (file) setter({ file, preview: URL.createObjectURL(file) });
    };
    const removeImage = (setter) => () => setter({ file: null, preview: '' });

    // Xử lý logic khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            let dataToSubmit = { ...formData };

            // Chỉ upload ảnh mới nếu người dùng chọn file mới
            if (desktopImage.file) {
                const formDataUpload = new FormData();
                formDataUpload.append('images', desktopImage.file);
                const res = await uploadFiles('/api/banners/upload', formDataUpload);
                if (res.success) dataToSubmit.desktopImage = res.data.images[0];
                else throw new Error('Tải ảnh desktop thất bại');
            } else {
                dataToSubmit.desktopImage = desktopImage.preview; // Giữ lại ảnh cũ nếu không thay đổi
            }

            if (mobileImage.file) {
                const formDataUpload = new FormData();
                formDataUpload.append('images', mobileImage.file);
                const res = await uploadFiles('/api/banners/upload', formDataUpload);
                if (res.success) dataToSubmit.mobileImage = res.data.images[0];
                else throw new Error('Tải ảnh mobile thất bại');
            } else {
                dataToSubmit.mobileImage = mobileImage.preview; // Giữ lại ảnh cũ nếu không thay đổi
            }

            // Gọi API để cập nhật dữ liệu
            const result = await updateData(`/api/banners/${bannerId}`, dataToSubmit);
            if (result.success) {
                context.openAlerBox("success", "Cập nhật banner thành công!");
                navigate('/banner-list');
            } else {
                throw new Error(result.message || "Cập nhật banner thất bại.");
            }

        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    // Dữ liệu breadcrumbs động
    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Banners', link: '/banner-list' },
        { name: isFetchingData ? 'Đang tải...' : `Sửa: ${formData.title}` }
    ];

    // Hiển thị màn hình loading toàn trang khi đang fetch dữ liệu
    if (isFetchingData) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header: Tiêu đề, Breadcrumbs và Nút hành động */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Sửa Banner</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/banner-list')} sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </div>

                {/* Layout chính: 2 cột */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái: Nội dung form */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="Nội dung Banner">
                            <TextField fullWidth label="Tiêu đề chính" name="title" value={formData.title} onChange={handleInputChange} />
                            <TextField fullWidth label="Tiêu đề phụ / Mô tả" name="subtitle" value={formData.subtitle} onChange={handleInputChange} multiline rows={2} />
                            <TextField fullWidth label="Văn bản trên nút" name="buttonText" value={formData.buttonText} onChange={handleInputChange} />
                            <TextField fullWidth label="Đường dẫn (URL)" name="link" value={formData.link} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><FiLink /></InputAdornment> }} />
                        </FormSection>
                    </div>

                    {/* Cột phải: Hình ảnh và Trạng thái */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Hình ảnh">
                            <ImageUploadBox title="Ảnh cho Desktop" recommendation="Tỷ lệ 16:9, rộng 1920px" imagePreview={desktopImage.preview} onImageChange={handleImageChange(setDesktopImage)} onRemoveImage={removeImage(setDesktopImage)} />
                            <ImageUploadBox title="Ảnh cho Mobile" recommendation="Tỷ lệ 9:16, rộng 800px" imagePreview={mobileImage.preview} onImageChange={handleImageChange(setMobileImage)} onRemoveImage={removeImage(setMobileImage)} />
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

export default EditBannerPage;