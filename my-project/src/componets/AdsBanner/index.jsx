import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import BoxBanner from '../BoxBanner';
import { Skeleton } from '@mui/material';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AdsBanner = (props) => {
    const context = useContext(MyContext);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            setIsLoading(true);
            try {
                const result = await fetchDataFromApi('/api/banners/');

                if (result.success) {
                    setBanners(result.data);
                } else {
                    context.openAlerBox("error", "Không thể tải banners.");
                }
            } catch (error) {
                console.error("Failed to fetch banners:", error);
                context.openAlerBox("error", "Lỗi khi tải banners.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // if (isLoading) {
    //     return (
    //         <div className='py-5 w-full'>
    //             <Swiper
    //                 slidesPerView={props.items}
    //                 spaceBetween={10}
    //                 className="smlBtn"
    //             >
    //                 {[...Array(props.items || 3)].map((_, index) => (
    //                     <SwiperSlide key={index}>
    //                         <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '2 / 1', borderRadius: '12px' }} />
    //                     </SwiperSlide>
    //                 ))}
    //             </Swiper>
    //         </div>
    //     );
    // }
    if (banners.length === 0) {
        return null;
    }

    return (
        <div className='py-5 w-full relative group'>
            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                className="mySwiper"
                preventClicksPropagation={true}

                modules={[Navigation]}
                loop={true}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                        <BoxBanner img={banner.desktopImage} link={banner.link} />
                    </SwiperSlide>
                ))}
                <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-2 z-50 cursor-pointer p-2 bg-white/50 rounded-full text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <FiChevronLeft size={24} />
                </div>
                <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-2 z-50 cursor-pointer p-2 bg-white/50 rounded-full text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <FiChevronRight size={24} />
                </div>
            </Swiper>
        </div>
    );
};

export default AdsBanner;
