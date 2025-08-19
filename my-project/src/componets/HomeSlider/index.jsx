import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import { Skeleton } from '@mui/material';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';

const HomeSlider = () => {
    const context = useContext(MyContext);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            setIsLoading(true);
            try {
                const result = await fetchDataFromApi('/api/banners');
                if (result.success) {
                    setBanners(result.data);
                } else {
                    throw new Error("Không thể tải banners.");
                }
            } catch (error) {
                console.error("Failed to fetch banners:", error);
                context.openAlerBox("error", "Lỗi khi tải banners.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, [context]);
    const SliderSkeleton = () => (
        <Skeleton
            variant="rectangular"
            width="100%"
            sx={{

                paddingTop: '43.62%',
                height: 0,
                borderRadius: '15px'
            }}
        />
    );

    if (isLoading) {
        return (
            <div className="homeSlider py-4 mt-2">
                <div className="container">
                    <SliderSkeleton />
                </div>
            </div>
        );
    }

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="homeSlider py-4 mt-2">
            <div className="container">
                <Swiper
                    loop={true}
                    slidesPerView={2}
                    spaceBetween={10}
                    navigation={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Autoplay]}
                    className="sliderHome"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner._id}>
                            <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer">
                                <div
                                    className="item rounded-[15px] overflow-hidden bg-gray-200"
                                    style={{
                                        width: '100%',
                                        height: '460px',
                                        backgroundImage: `url(${banner.desktopImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <img
                                        src={banner.desktopImage}
                                        alt={banner.title || 'Banner'}
                                        className="w-full h-full object-cover invisible"
                                    />
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default HomeSlider;