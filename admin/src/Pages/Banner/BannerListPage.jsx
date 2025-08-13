import React, { useState } from 'react';
import {
    Typography, Button, Breadcrumbs, Paper, Card, CardMedia, CardContent,
    CardActions, Switch, IconButton, Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// --- DỮ LIỆU MẪU ---
// Trong ứng dụng thực tế, dữ liệu này sẽ được fetch từ API
const mockBanners = [
    { id: 'banner1', title: 'Khuyến mãi hè rực rỡ', desktopImage: 'https://via.placeholder.com/1920x600/e0f2fe/0ea5e9', isPublished: true },
    { id: 'banner2', title: 'Thịt sạch giao nhanh', desktopImage: 'https://via.placeholder.com/1920x600/fefce8/ca8a04', isPublished: true },
    { id: 'banner3', title: 'Rau củ hữu cơ', desktopImage: 'https://via.placeholder.com/1920x600/dcfce7/166534', isPublished: false },
    { id: 'banner4', title: 'Món ngon mỗi ngày', desktopImage: 'https://via.placeholder.com/1920x600/fee2e2/ef4444', isPublished: true },
];

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Banners' }
];

// === COMPONENT TRANG CHÍNH ===
const BannerListPage = () => {
    // State quản lý danh sách banner
    const [banners, setBanners] = useState(mockBanners);

    // Hàm xử lý khi thay đổi trạng thái hiển thị của banner
    const handleStatusChange = (bannerId) => {
        setBanners(
            banners.map(banner =>
                banner.id === bannerId ? { ...banner, isPublished: !banner.isPublished } : banner
            )
        );
        // TODO: Gọi API để cập nhật trạng thái
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

            {/* Lưới hiển thị các banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map(banner => (
                    <Card
                        key={banner.id}
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
                            image={banner.desktopImage}
                            alt={banner.title}
                            sx={{
                                aspectRatio: '16/9', // Đảm bảo ảnh luôn có tỷ lệ đúng
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
                                    onChange={() => handleStatusChange(banner.id)}
                                    color="success"
                                />
                            </Tooltip>
                            <div>
                                <Tooltip title="Sửa">
                                    <IconButton component={Link} to={`/edit-banner/${banner.id}`} size="small">
                                        <FiEdit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                    <IconButton size="small" color="error">
                                        <FiTrash2 />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default BannerListPage;