import React, { useContext, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Skeleton } from '@mui/material';

// --- Components & Context ---
import HomeSlider from '../../componets/HomeSlider';
import CategorySlider from '../../componets/CategorySlider';
import { FaShippingFast } from "react-icons/fa";
import AdsBanner from '../../componets/AdsBanner';
import ProductsSlider from '../../componets/ProductsSlider';
import BlogItem from '../../componets/BlogItem';
import SmallSliderHome from '../../componets/SmallSliderHome';
import BannerSmall from '../../componets/BannerSmall';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';

const Home = () => {
    const { openAlerBox } = useContext(MyContext);

    // --- State cho Tabs ---
    const [tabCategories, setTabCategories] = useState([]);
    const [isLoadingTabs, setIsLoadingTabs] = useState(true);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    // === STATE MỚI ĐỂ LƯU CATEGORY ID ĐƯỢC CHỌN ===
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // --- State cho Blogs ---
    const [blogs, setBlogs] = useState([]);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

    // Lấy danh sách danh mục cho Tabs
    useEffect(() => {
        const fetchTabCategories = async () => {
            setIsLoadingTabs(true);
            try {
                const result = await fetchDataFromApi('/api/category/');
                if (result.success && result.data.length > 0) {
                    const parentCategories = result.data.filter(cat => cat.isPublished !== false);
                    setTabCategories(parentCategories);
                    // Lấy danh mục đầu tiên làm danh mục mặc định để tải sản phẩm
                    if (parentCategories.length > 0) {
                        setSelectedCategoryId(parentCategories[0]._id);
                    }
                } else {
                    throw new Error("Không thể tải danh mục.");
                }
            } catch (error) {
                openAlerBox("error", error.message);
            } finally {
                setIsLoadingTabs(false);
            }
        };
        fetchTabCategories();
    }, [openAlerBox]);

    // Lấy danh sách bài viết
    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoadingBlogs(true);
            try {
                // Gọi API lấy các bài viết đã được publish
                const result = await fetchDataFromApi('/api/blogs?publishedOnly=true');
                if (result.success) {
                    // Lấy 6 bài viết mới nhất để hiển thị
                    setBlogs(result.data.slice(0, 6));
                }
            } catch (error) {
                console.error("Lỗi khi tải bài viết cho trang chủ:", error);
            } finally {
                setIsLoadingBlogs(false);
            }
        };
        fetchBlogs();
    }, []);

    // === HÀM XỬ LÝ KHI THAY ĐỔI TAB ===
    const handleTabChange = (event, newIndex) => {
        setSelectedTabIndex(newIndex);
        const selectedCategory = tabCategories[newIndex];
        if (selectedCategory) {
            // Cập nhật ID của danh mục đã chọn
            setSelectedCategoryId(selectedCategory._id);
        }
    };

    return (
        <>
            <HomeSlider />
            <CategorySlider />

            {/* === SECTION SẢN PHẨM PHỔ BIẾN === */}
            <section className='bg-white py-8'>
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                        <div className="section-left text-center md:text-left">
                            <h2 className='text-[20px] font-[600]'>Sản Phẩm Phổ Biến</h2>
                            <p className='text-[14px] font-[400]'>Đừng bỏ lỡ các ưu đãi hiện tại...</p>
                        </div>
                        <div className="section-right w-full md:w-[60%]">
                            {isLoadingTabs ? (
                                <p>Đang tải danh mục...</p>
                            ) : (
                                <Tabs
                                    value={selectedTabIndex}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs"
                                >
                                    {tabCategories.map(category => (
                                        <Tab key={category._id} label={category.name} />
                                    ))}
                                </Tabs>
                            )}
                        </div>
                    </div>
                    <ProductsSlider items={6} categoryId={selectedCategoryId} />
                </div>
            </section>

            {/* === SECTION SLIDER NHỎ & BANNER === */}
            <section className='pb-12 pt-0 bg-white'>
                <div className="container flex flex-col lg:flex-row gap-5">
                    <div className="small-slider-1 w-full lg:w-[70%]">
                        <SmallSliderHome />
                    </div>
                    <div className="small-slider-2 w-full lg:w-[30%] flex flex-col items-center justify-between gap-5">
                        <BannerSmall info='left' image={'/banner/20250618_2251_image.png'} />
                        <BannerSmall info='right' image={'/banner/20250618_2251_image1.png'} />
                    </div>
                </div>
            </section>

            {/* === SECTION FREE SHIPPING === */}
            <section className='py-4 pt-2 bg-white'>
                <div className="container">
                    <div className="free-shipping w-full lg:w-[80%] m-auto py-4 px-4 border-2 border-[#782b2b]
                        flex flex-col md:flex-row items-center justify-between rounded-md mb-7 text-center md:text-left gap-4 md:gap-0">
                        <div className="col1 flex items-center gap-4">
                            <FaShippingFast className='text-[40px] md:text-[50px]' />
                            <span className='text-[20px] md:text-[25px] font-[600] uppercase'>Free Ship</span>
                        </div>
                        <div className="h-12 border-l-2 border-gray-300 mx-4 hidden md:block"></div>
                        <div className="col2">
                            <p className='mb-0 font-[500] text-sm'>Miễn phí vận chuyển cho đơn hàng đầu tiên trên 2,000,000 VND</p>
                        </div>
                        <div className="h-12 border-l-2 border-gray-300 mx-4 hidden md:block"></div>
                        <div className="col3">
                            <p className='font-[600] text-base'>Duy Nhất Chỉ Từ ... Đến ...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === CÁC SECTION SLIDER  === */}
            <section className='py-5 pt-0 bg-white'>
                <div className="container">
                    <h2 className='text-[20px] font-[600]'>Sản Phẩm Mới Nhất</h2>
                    <ProductsSlider items={6} />
                </div>
                <div className="container mt-8">
                    <h2 className='text-[20px] font-[600]'>Sản Phẩm Nổi Bật</h2>
                    <ProductsSlider items={6} />
                </div>
            </section>

            <section className='py-5 pt-0 bg-white'>
                <div className="container">
                    <AdsBanner items={3} />
                </div>
            </section>

            {/* === SECTION BLOG === */}
            <section className='py-5 pt-0 pb-8 bg-white section-blog'>
                <div className="container">
                    <div className="flex items-center justify-center py-4">
                        <h2 className='text-[25px] md:text-[30px] font-[600] mb-4 text-center uppercase w-full max-w-sm border-b-2 border-gray-300'>Blog</h2>
                    </div>
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={30}
                        navigation={true}
                        modules={[Navigation]}
                        className="blogSlider"
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 30 },
                            1280: { slidesPerView: 4, spaceBetween: 30 },
                        }}
                    >
                        {isLoadingBlogs ? (
                            Array.from(new Array(4)).map((_, index) => (
                                <SwiperSlide key={index}>
                                    <Skeleton variant="rectangular" width="100%" height={192} />
                                    <Skeleton variant="text" sx={{ fontSize: '1rem', mt: 2 }} />
                                    <Skeleton variant="text" />
                                </SwiperSlide>
                            ))
                        ) : (
                            blogs.map(blog => (
                                <SwiperSlide key={blog._id}>
                                    <BlogItem blog={blog} />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </div>
            </section>
        </>
    );
};

export default Home;