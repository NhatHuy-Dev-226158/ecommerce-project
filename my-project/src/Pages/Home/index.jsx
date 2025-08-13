import React, { useContext, useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

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
    const context = useContext(MyContext);

    // State cho Tabs
    const [tabCategories, setTabCategories] = useState([]);
    const [isLoadingTabs, setIsLoadingTabs] = useState(true);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newIndex) => {
        setSelectedTabIndex(newIndex);
        // Tạm thời, chúng ta có thể log ra để xem ID của category được chọn
        const selectedCategory = tabCategories[newIndex];
        if (selectedCategory) {
            console.log("Selected Category ID:", selectedCategory._id);
        }
    };
    useEffect(() => {
        const fetchTabCategories = async () => {
            setIsLoadingTabs(true);
            const result = await fetchDataFromApi('/api/category/');
            if (result.success && result.data.length > 0) {
                const parentCategories = result.data.filter(cat => cat.isPublished !== false);
                setTabCategories(parentCategories);
            } else {
                context.openAlerBox("error", "Không thể tải danh mục.");
            }
            setIsLoadingTabs(false);
        };
        fetchTabCategories();
    }, []);

    return (
        <>
            <HomeSlider></HomeSlider>
            <CategorySlider></CategorySlider>
            <section className='bg-white py-8'>
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className="section-left">
                            <h2 className='text-[20px] font-[600]'> Sản Phẩm Phổ Biến</h2>
                            <p className='text-[14px] font-[400]'> Do not miss current offers until the end of ......</p>
                        </div>


                        <div className="section-right w-[60%]">
                            {isLoadingTabs ? (
                                <p>Đang tải danh mục...</p> // Hoặc một Skeleton component
                            ) : (
                                <Tabs
                                    value={selectedTabIndex}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    {tabCategories.map(category => (
                                        <Tab key={category._id} label={category.name} />
                                    ))}
                                </Tabs>
                            )}
                        </div>
                    </div>


                    <ProductsSlider items={6}></ProductsSlider>
                </div>
            </section>
            <section className='pb-12 pt-0 bg-white'>
                <div className="container flex gap-5">
                    <div className="small-slider-1 w-[70%]">
                        <SmallSliderHome></SmallSliderHome>
                    </div>

                    <div className="small-slider-2 w-[30%] flex flex-col items-center justify-between gap-5">
                        <BannerSmall info='left' image={'/banner/20250618_2251_image.png'}></BannerSmall>
                        <BannerSmall info='right' image={'/banner/20250618_2251_image1.png'}></BannerSmall>
                    </div>
                </div>
            </section>
            <section className='py-4 pt-2 bg-white'>
                <div className="container">
                    <div className="free-shipping w-[80%] m-auto py-4 p-4 border-2 border-[#782b2b]
                    flex items-center justify-between rounded-md mb-7">
                        <div className="col1 flex items-center gap-4">
                            <FaShippingFast className='text-[50px]' />
                            <span className='text-[25px] font-[600] uppercase'>Free Ship</span>
                        </div>
                        <div className="h-12 border-l-2 border-gray-300 mx-4"></div>
                        <div className="col2">
                            <p className='mb-0 font-[500]'>Miễn phí vẫn chuyển cho đơn hàng đâu tiên trên 2,000,000 VND của bạn</p>
                        </div>
                        <div className="h-12 border-l-2 border-gray-300 mx-4"></div>
                        <div className="col3">
                            <p className='font-[600] text-[18px]'>Duy Nhất Chỉ Từ ... Đến ...</p>
                        </div>
                    </div>
                    <AdsBanner items={4}></AdsBanner>
                </div>
            </section>

            <section className='py-5 pt-0 bg-white'>
                <div className="container">
                    <h2 className='text-[20px] font-[600]'> Sản Phẩm Mới Nhất</h2>
                    <ProductsSlider items={6}></ProductsSlider>
                    <AdsBanner items={4}></AdsBanner>
                </div>
            </section>

            <section className='py-5 pt-0 bg-white'>
                <div className="container">
                    <h2 className='text-[20px] font-[600]'> Sản Phẩm Nổi Bật</h2>
                    <ProductsSlider items={6}></ProductsSlider>
                    <AdsBanner items={3}></AdsBanner>
                </div>
            </section>

            <section className='py-5 pt-0 pb-8 bg-white section-blog'>
                <div className="container">
                    <div className="flex items-center justify-center py-4">
                        <h2 className='text-[30px] font-[600] mb-4 flex items-center justify-center uppercase
                    w-96 border-b-2 border-gray-300 '> Blog</h2>
                    </div>
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={30}
                        navigation={true}
                        modules={[Navigation]}
                        className="blogSlider"
                    >
                        <SwiperSlide>
                            <BlogItem></BlogItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <BlogItem></BlogItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <BlogItem></BlogItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <BlogItem></BlogItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <BlogItem></BlogItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <BlogItem></BlogItem>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>
        </>
    )
}

export default Home;
