// File: src/pages/BlogDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Breadcrumbs, Link, CircularProgress, Box, Chip, Avatar } from '@mui/material';
import { FiClock, FiUser } from 'react-icons/fi';
import { fetchDataFromApi } from '../../utils/api';

const BlogDetailPage = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!slug) return;

        const fetchBlog = async () => {
            setIsLoading(true);
            try {
                const result = await fetchDataFromApi(`/api/blogs/${slug}`);
                if (result.success) {
                    setBlog(result.data);
                } else {
                    // Xử lý trường hợp không tìm thấy bài viết
                    setBlog(null);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết bài viết:", error);
                setBlog(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    if (!blog) {
        return <div className="text-center py-20"><Typography variant="h5">404 - Không tìm thấy bài viết</Typography></div>;
    }

    return (
        <section className="py-8 bg-white">
            <div className="container max-w-4xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <Link underline="hover" color="inherit" component={RouterLink} to="/">TRANG CHỦ</Link>
                    <Link underline="hover" color="inherit" component={RouterLink} to="/blog">BLOG</Link>
                    <Typography color="text.primary" className="truncate max-w-xs">{blog.title}</Typography>
                </Breadcrumbs>

                {/* Tiêu đề và thông tin meta */}
                <div className="mb-6">
                    <Chip label={blog.category} color="primary" size="small" />
                    <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>{blog.title}</Typography>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Avatar src={blog.author?.avatar || '/user.png'} sx={{ width: 24, height: 24 }} />
                            <span>{blog.author?.name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <FiClock />
                            <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                </div>

                {/* Ảnh đại diện */}
                <img src={blog.featuredImage} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg mb-8" />

                {/* Nội dung bài viết */}
                <div
                    className="prose lg:prose-xl max-w-none"
                    // Sử dụng dangerouslySetInnerHTML để render nội dung HTML từ trình soạn thảo
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-10 pt-6 border-t">
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Tags:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {blog.tags.map(tag => <Chip key={tag} label={tag} variant="outlined" />)}
                        </Box>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogDetailPage;