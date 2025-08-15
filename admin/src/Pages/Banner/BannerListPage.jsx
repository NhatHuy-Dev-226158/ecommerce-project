import React, { useContext, useEffect, useState } from 'react';
import {
    Typography, Button, Breadcrumbs, Paper, Card, CardMedia, CardContent,
    CardActions, Switch, IconButton, Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Select,
    MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, updateData } from '../../utils/api';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Banners' }
];

// --- COMPONENT DIALOG XEM CHI TIẾT ẢNH ---
const BannerDetailDialog = ({ open, onClose, banner }) => {
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

// === COMPONENT TRANG CHÍNH ===
const BannerListPage = () => {
    const context = useContext(MyContext);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [bannerIdToDelete, setBannerIdToDelete] = useState(null);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredBanners = banners.filter(banner => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'published') return banner.isPublished;
        if (statusFilter === 'hidden') return !banner.isPublished;
        return true;
    });

    // --- LOGIC FETCH DỮ LIỆU ---
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
    useEffect(() => { fetchBanners(); }, []);


    // Cập nhật trạng thái hiển thị
    const handleStatusChange = async (banner) => {
        // Cập nhật giao diện ngay lập tức để tạo cảm giác phản hồi nhanh
        const originalBanners = banners;
        const updatedBanners = banners.map(b =>
            b._id === banner._id ? { ...b, isPublished: !b.isPublished } : b
        );
        setBanners(updatedBanners);
        try {
            const result = await updateData(`/api/banners/${banner._id}`, { isPublished: !banner.isPublished });
            if (!result.success) {
                setBanners(originalBanners);
                context.openAlerBox("error", result.message || "Cập nhật trạng thái thất bại.");
            }
        } catch (error) {
            setBanners(originalBanners);
            context.openAlerBox("error", "Cập nhật trạng thái thất bại.");
        }
    };

    // Mở dialog xác nhận xóa
    const handleDeleteClick = (id) => {
        setBannerIdToDelete(id);
        setIsConfirmOpen(true);
    };

    // Thực hiện xóa sau khi xác nhận
    const handleConfirmDelete = async () => {
        if (!bannerIdToDelete) return;

        const result = await deleteData(`/api/banners/${bannerIdToDelete}`);
        if (result.success) {
            context.openAlerBox("success", "Xóa banner thành công!");
            setBanners(prev => prev.filter(b => b._id !== bannerIdToDelete));
        } else {
            context.openAlerBox("error", result.message || "Xóa thất bại.");
        }
        setIsConfirmOpen(false);
    };

    const handleOpenDetailView = (banner) => {
        setSelectedBanner(banner);
        setIsDetailViewOpen(true);
    };

    const handleCloseDetailView = () => {
        setIsDetailViewOpen(false);
    };

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            {/* Header của trang */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Quản lý Banners</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        component={Link}
                        to="/add-banner"
                        variant="contained"
                        startIcon={<FiPlus />}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Thêm Banner
                    </Button>
                </div>
            </div>
            <div className="flex justify-end mb-4">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small">
                    <MenuItem value="all">Tất cả trạng thái</MenuItem>
                    <MenuItem value="published">Đang hiển thị</MenuItem>
                    <MenuItem value="hidden">Đã ẩn</MenuItem>
                </Select>
            </div>
            {/* Hiển thị các banner */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><CircularProgress /></div>
            ) : banners.length === 0 ? (
                <Typography className="text-center text-gray-500 py-8">Chưa có banner nào.</Typography>
            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBanners.map(banner => (
                        <Card
                            key={banner._id}
                            elevation={0}
                            sx={{
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: 'grey.200',
                                transition: 'box-shadow 300ms',
                                '&:hover': {
                                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={banner.desktopImage || '/720x840.png'}
                                alt={banner.title}
                                sx={{
                                    aspectRatio: '16/9',
                                    objectFit: 'cover'
                                }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div" fontWeight="bold" noWrap>
                                    {banner.title}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', padding: '0 16px 16px' }}>
                                <Tooltip title={banner.isPublished ? "Đang hiển thị" : "Đã ẩn"}>
                                    <Switch
                                        checked={banner.isPublished}
                                        onChange={() => handleStatusChange(banner)}
                                        color="success"
                                    />
                                </Tooltip>
                                <div>
                                    <Tooltip title="Xem chi tiết">
                                        <IconButton size="small" onClick={() => handleOpenDetailView(banner)}>
                                            <FiEye />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <IconButton component={Link} to={`/edit-banner/${banner._id}`} size="small">
                                            <FiEdit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(banner._id)}>
                                            <FiTrash2 />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa banner này không?"
            />
            <BannerDetailDialog
                open={isDetailViewOpen}
                onClose={handleCloseDetailView}
                banner={selectedBanner}
            />
        </section>
    );
};

export default BannerListPage;