import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import BoxBanner from '../BoxBanner';

const AdsBanner = (props) => {
    return (
        <div className='py-5 w-full'>
            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="smlBtn"
            >
                <SwiperSlide>
                    <BoxBanner img={'/banner/adsbanner1.png'} link={'/'}></BoxBanner>
                </SwiperSlide>

                <SwiperSlide>
                    <BoxBanner img={'/banner/adsbanner2.png'} link={'/'}></BoxBanner>
                </SwiperSlide>

                <SwiperSlide>
                    <BoxBanner img={'/banner/adsbanner5.png'} link={'/'}></BoxBanner>
                </SwiperSlide>

                <SwiperSlide>
                    <BoxBanner img={'/banner/adsbanner6.png'} link={'/'}></BoxBanner>
                </SwiperSlide>

                <SwiperSlide>
                    <BoxBanner img={'/banner/adsbanner8.png'} link={'/'}></BoxBanner>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default AdsBanner;
