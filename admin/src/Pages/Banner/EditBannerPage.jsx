import { React, useState, useEffect, useContext } from 'react';
import {
    Typography, Button, Breadcrumbs, TextField, Switch, FormControlLabel, CircularProgress,
    Paper, Box, IconButton, InputAdornment
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiUploadCloud, FiLink, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App'; // Điều chỉnh đường dẫn nếu cần
import { fetchDataFromApi, updateData, uploadImage } from '../../utils/api'; // Giả sử bạn có các hàm này

// --- DỮ LIỆU MẪU ĐỂ GIẢ LẬP API ---
const mockBannerDataToEdit = {
    _id: 'banner1',
    title: 'Khuyến mãi hè rực rỡ',
    subtitle: 'Giảm giá đến 50% cho tất cả các mặt hàng tươi sống.',
    buttonText: 'Xem ngay',
    link: '/khuyen-mai/he-2025',
    desktopImage: 'https://via.placeholder.com/1920x600/e0f2fe/0ea5e9',
    mobileImage: 'https://via.placeholder.com/800x1200/e0f2fe/0ea5e9',
    isPublished: true
};


// --- CÁC COMPONENT CON ---
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
            <Typography variant="body2" mt={1}>
                Kéo thả hoặc <span className="font-bold text-indigo-600">chọn file</span>
            </Typography>
            <Typography variant="caption" color="text.secondary">{recommendation}</Typography>
            <input
                id={`banner-image-${title.replace(/\s/g, '-')}`}
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

// === COMPONENT TRANG CHÍNH ===
const EditBannerPage = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const { bannerId } = useParams();

    const [isLoading, setIsLoading] = useState(false); // Dùng cho lúc submit
    const [isFetchingData, setIsFetchingData] = useState(true); // Dùng cho lúc tải dữ liệu ban đầu

    // State cho ảnh, mỗi state chứa file (nếu có thay đổi) và preview URL
    const [desktopImage, setDesktopImage] = useState({ file: null, preview: '' });
    const [mobileImage, setMobileImage] = useState({ file: null, preview: '' });

    // State cho form
    const [formData, setFormData] = useState({
        title: '', subtitle: '', buttonText: '', link: '', isPublished: true,
    });

    // --- LOGIC FETCH DỮ LIỆU BAN ĐẦU ---
    useEffect(() => {
        const fetchBannerData = async () => {
            setIsFetchingData(true);
            try {
                // const result = await fetchDataFromApi(`/api/banners/${bannerId}`);
                // if (!result.success) throw new Error(result.message);
                const bannerData = mockBannerDataToEdit; // Giả lập API

                setFormData({
                    title: bannerData.title || '',
                    subtitle: bannerData.subtitle || '',
                    buttonText: bannerData.buttonText || '',
                    link: bannerData.link || '',
                    isPublished: bannerData.isPublished,
                });
                setDesktopImage({ file: null, preview: bannerData.desktopImage || '' });
                setMobileImage({ file: null, preview: bannerData.mobileImage || '' });

            } catch (error) {
                context.openAlerBox("error", "Không thể tải dữ liệu banner.");
                navigate('/banner-list');
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchBannerData();
    }, [bannerId, navigate, context]);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSwitchChange = (e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }));

    const handleImageChange = (setter) => (event) => {
        const file = event.target.files[0];
        if (file) {
            setter({ file, preview: URL.createObjectURL(file) });
        }
    };

    const removeImage = (setter) => () => {
        setter({ file: null, preview: '' }); // Xóa cả file và preview
    };

    // --- LOGIC SUBMIT FORM ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Tạo một bản sao của dữ liệu form để gửi đi
            let dataToSubmit = { ...formData };

            // Xử lý upload ảnh nếu có file mới được chọn
            if (desktopImage.file) {
                const formData = new FormData();
                formData.append('image', desktopImage.file);
                // const res = await uploadImage('/api/upload', formData);
                // if (res.success) dataToSubmit.desktopImage = res.imageUrl;
                // else throw new Error('Tải ảnh desktop thất bại');
            } else {
                dataToSubmit.desktopImage = desktopImage.preview; // Giữ lại ảnh cũ nếu không đổi
            }

            if (mobileImage.file) {
                const formData = new FormData();
                formData.append('image', mobileImage.file);
                // const res = await uploadImage('/api/upload', formData);
                // if (res.success) dataToSubmit.mobileImage = res.imageUrl;
                // else throw new Error('Tải ảnh mobile thất bại');
            } else {
                dataToSubmit.mobileImage = mobileImage.preview; // Giữ lại ảnh cũ nếu không đổi
            }

            // Gọi API để cập nhật banner
            // const result = await updateData(`/api/banners/${bannerId}`, dataToSubmit);
            // if (result.success) {
            //     context.openAlerBox("success", "Cập nhật banner thành công!");
            //     navigate('/banner-list');
            // } else {
            //     throw new Error(result.message);
            // }
            console.log("Dữ liệu gửi đi:", dataToSubmit); // Giả lập API
            context.openAlerBox("success", "Cập nhật banner thành công!");
            navigate('/banner-list');


        } catch (error) {
            context.openAlerBox("error", error.message || "Đã có lỗi xảy ra.");
        } finally {
            setIsLoading(false);
        }
    };

    // Breadcrumbs được cập nhật động
    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Banners', link: '/banner-list' },
        { name: isFetchingData ? 'Đang tải...' : `Sửa: ${formData.title}` }
    ];

    // Màn hình loading ban đầu
    if (isFetchingData) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header */}
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

                {/* Layout chính */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="Nội dung Banner">
                            <TextField fullWidth label="Tiêu đề chính" name="title" value={formData.title} onChange={handleInputChange} />
                            <TextField fullWidth label="Tiêu đề phụ / Mô tả" name="subtitle" value={formData.subtitle} onChange={handleInputChange} multiline rows={2} />
                            <TextField fullWidth label="Văn bản trên nút" name="buttonText" value={formData.buttonText} onChange={handleInputChange} />
                            <TextField fullWidth label="Đường dẫn (URL)" name="link" value={formData.link} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><FiLink /></InputAdornment> }} />
                        </FormSection>
                    </div>

                    {/* Cột phải */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Hình ảnh">
                            <ImageUploadBox
                                title="Ảnh cho Desktop"
                                recommendation="Tỷ lệ 16:9, rộng 1920px"
                                imagePreview={desktopImage.preview}
                                onImageChange={handleImageChange(setDesktopImage)}
                                onRemoveImage={removeImage(setDesktopImage)}
                            />
                            <ImageUploadBox
                                title="Ảnh cho Mobile"
                                recommendation="Tỷ lệ 9:16, rộng 800px"
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

export default EditBannerPage;