import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, updateData } from '../../utils/api';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';

// --- Material-UI & Icon Imports ---
import {
    Typography, Button, Breadcrumbs, Card, CardMedia, CardContent,
    CardActions, Switch, IconButton, Tooltip, CircularProgress, Dialog,
    DialogTitle, DialogContent, Select, MenuItem
} from '@mui/material';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// Dữ liệu tĩnh cho breadcrumbs
const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Banners' }
];

//================================================================================
// SUB-COMPONENT: BANNER DETAIL DIALOG
//================================================================================

/**
 * @component BannerDetailDialog
 * @description Một Dialog để hiển thị chi tiết ảnh desktop và mobile của một banner.
 * @param {{ open: boolean, onClose: Function, banner: object | null }} props
 */
const BannerDetailDialog = ({ open, onClose, banner }) => {
    // Tránh render nếu không có banner được chọn
    if (!banner) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                Xem trước: {banner.title}
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}><FiX /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>Ảnh Desktop (16:9)</Typography>
                        <img src={banner.desktopImage || '/placeholder-desktop.png'} alt="Desktop version" className="w-full rounded-lg border" />
                    </div>
                    <div>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>Ảnh Mobile (9:16)</Typography>
                        <img src={banner.mobileImage || '/placeholder-mobile.png'} alt="Mobile version" className="w-full rounded-lg border" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

//================================================================================
// MAIN PAGE COMPONENT: BANNER LIST
//================================================================================

/**
 * @component BannerListPage
 * @description Trang quản lý, hiển thị danh sách tất cả các banner. Cho phép người dùng xem,
 * sửa, xóa và thay đổi trạng thái của banner.
 */
const BannerListPage = () => {
    // --- HOOKS & CONTEXT ---
    const context = useContext(MyContext);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [bannerIdToDelete, setBannerIdToDelete] = useState(null);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    // --- DATA DERIVATION ---
    // Lọc danh sách banner dựa trên bộ lọc `statusFilter`.
    // Việc tính toán này diễn ra trên mỗi lần render, giúp giao diện luôn đồng bộ với state.
    const filteredBanners = banners.filter(banner => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'published') return banner.isPublished;
        if (statusFilter === 'hidden') return !banner.isPublished;
        return true;
    });

    // --- API & DATA LOGIC ---
    /** Lấy danh sách banner từ server */
    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const result = await fetchDataFromApi('/api/banners/');
            if (result.success) {
                setBanners(result.data);
            } else {
                throw new Error(result.message || "Không thể tải danh sách banner.");
            }
        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi hàm fetchBanners một lần khi component được mount
    useEffect(() => {
        fetchBanners();
    }, []);

    // --- EVENT HANDLERS ---

    /**
     * @function handleStatusChange
     * @description Xử lý việc thay đổi trạng thái hiển thị (published/hidden) của banner.
     * Sử dụng kỹ thuật "Optimistic Update" để cải thiện trải nghiệm người dùng.
     */
    const handleStatusChange = async (banner) => {
        const originalBanners = [...banners]; // Sao lưu trạng thái cũ
        // 1. Cập nhật giao diện ngay lập tức để tạo cảm giác phản hồi nhanh
        const updatedBanners = banners.map(b =>
            b._id === banner._id ? { ...b, isPublished: !b.isPublished } : b
        );
        setBanners(updatedBanners);

        try {
            // 2. Gửi yêu cầu cập nhật lên server
            const result = await updateData(`/api/banners/${banner._id}`, { isPublished: !banner.isPublished });
            if (!result.success) {
                // 3. Nếu API thất bại, hoàn tác lại thay đổi trên giao diện
                setBanners(originalBanners);
                context.openAlerBox("error", result.message || "Cập nhật trạng thái thất bại.");
            }
        } catch (error) {
            // 3. Nếu có lỗi mạng, cũng hoàn tác lại
            setBanners(originalBanners);
            context.openAlerBox("error", "Lỗi mạng: Cập nhật trạng thái thất bại.");
        }
    };

    /** Mở dialog xác nhận và lưu ID của banner cần xóa */
    const handleDeleteClick = (id) => {
        setBannerIdToDelete(id);
        setIsConfirmOpen(true);
    };

    /** Thực hiện xóa banner sau khi người dùng xác nhận trong dialog */
    const handleConfirmDelete = async () => {
        if (!bannerIdToDelete) return;
        setIsConfirmOpen(false); // Đóng dialog trước khi gọi API

        const result = await deleteData(`/api/banners/${bannerIdToDelete}`);
        if (result.success) {
            context.openAlerBox("success", "Xóa banner thành công!");
            // Cập nhật lại danh sách banner trên giao diện
            setBanners(prev => prev.filter(b => b._id !== bannerIdToDelete));
        } else {
            context.openAlerBox("error", result.message || "Xóa thất bại.");
        }
    };

    /** Mở dialog xem chi tiết banner */
    const handleOpenDetailView = (banner) => {
        setSelectedBanner(banner);
        setIsDetailViewOpen(true);
    };

    /** Đóng dialog xem chi tiết banner */
    const handleCloseDetailView = () => setIsDetailViewOpen(false);

    // --- RENDER ---
    return (
        <section className="bg-gray-50 p-4 md:p-6">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Quản lý Banners</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        {breadcrumbsData.map((crumb, index) => (crumb.link ? <Link key={index} to={crumb.link} className="text-sm hover:underline">{crumb.name}</Link> : <Typography key={index} className="text-sm font-semibold">{crumb.name}</Typography>))}
                    </Breadcrumbs>
                </div>
                <Button component={Link} to="/add-banner" variant="contained" startIcon={<FiPlus />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                    Thêm Banner
                </Button>
            </div>

            {/* Filter Dropdown */}
            <div className="flex justify-end mb-4">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 200, backgroundColor: 'white' }}>
                    <MenuItem value="all">Tất cả trạng thái</MenuItem>
                    <MenuItem value="published">Đang hiển thị</MenuItem>
                    <MenuItem value="hidden">Đã ẩn</MenuItem>
                </Select>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><CircularProgress /></div>
            ) : banners.length === 0 ? (
                <Typography className="text-center text-gray-500 py-8">Chưa có banner nào.</Typography>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBanners.map(banner => (
                        <Card key={banner._id} elevation={0} sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'grey.200', transition: 'box-shadow 300ms', '&:hover': { boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' } }}>
                            <CardMedia component="img" height="140" image={banner.desktopImage || '/720x840.png'} alt={banner.title} sx={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                            <CardContent><Typography gutterBottom variant="h6" component="div" fontWeight="bold" noWrap>{banner.title}</Typography></CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', padding: '0 16px 16px' }}>
                                <Tooltip title={banner.isPublished ? "Đang hiển thị" : "Đã ẩn"}><Switch checked={banner.isPublished} onChange={() => handleStatusChange(banner)} color="success" /></Tooltip>
                                <div>
                                    <Tooltip title="Xem chi tiết"><IconButton size="small" onClick={() => handleOpenDetailView(banner)}><FiEye /></IconButton></Tooltip>
                                    <Tooltip title="Sửa"><IconButton component={Link} to={`/edit-banner/${banner._id}`} size="small"><FiEdit /></IconButton></Tooltip>
                                    <Tooltip title="Xóa"><IconButton size="small" color="error" onClick={() => handleDeleteClick(banner._id)}><FiTrash2 /></IconButton></Tooltip>
                                </div>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialogs: Chúng được render ở đây nhưng chỉ hiển thị khi state tương ứng là true */}
            <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Xác nhận xóa" message="Bạn có chắc chắn muốn xóa banner này không?" />
            <BannerDetailDialog open={isDetailViewOpen} onClose={handleCloseDetailView} banner={selectedBanner} />
        </section>
    );
};

export default BannerListPage;