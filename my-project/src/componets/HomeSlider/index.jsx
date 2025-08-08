import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

const HomeSlider = () => {
    return (
        <div className="homeSlider py-4 mt-2">
            <div className="container">
                <Swiper loop={true}
                    spaceBetween={10}
                    navigation={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Autoplay]} className="sliderHome">
                    <SwiperSlide>
                        <div className="item rounded-[15px] overflow-hidden"><img src="/banner/banner1.jpg" alt="" className='w-full' /></div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="item rounded-[15px] overflow-hidden"><img src="/banner/banner2.jpg" alt="" className='w-full' /></div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="item rounded-[15px] overflow-hidden"><img src="/banner/banner3.jpg" alt="" className='w-full' /></div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default HomeSlider;
