import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '@mui/material/Button';

const SmallSliderHome = () => {
    return (
        <Swiper
            loop={true}
            spaceBetween={30}
            effect={'fade'}
            navigation={true}
            pagination={{
                clickable: true,
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            className="small-sliderHome"
        >
            <SwiperSlide>
                <div className="item w-full rounded-md overflow-hidden relative">
                    <img src="/banner/smallbanner(1).jpg" className='w-full' />

                    <div className="font-serif info absolute top-0 -right-[100%] w-[50%] h-[100%] z-50 p-8 
                    flex items-center justify-center flex-col opacity-0 transition-all duration-700">
                        <h4 className='text-[18px] font-[500] w-full text-left mb-3 -right-[100%] relative opacity-0'>
                            Đại Hạ Giá Trong Ngày
                        </h4>
                        <h2 className='font-serif text-[35px] font-[700] w-full -right-[100%] relative opacity-0'>
                            Name Product
                        </h2>
                        <h3 className='font-serif flex items-baseline gap-3 text-left mt-3 mb-3 text-[18px] font-[500] w-full -right-[100%] relative opacity-0'>
                            Giá Chỉ Từ <span className='text-[#ff0606] text-[26px] font-sans'>1,999,999</span>
                        </h3>

                        <div className="animation w-full -right-[100%] relative opacity-0">
                            <Button className='org-btn hover:!bg-[#4649ff] '>Mua Ngay</Button>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="item w-full rounded-md overflow-hidden">
                    <img src="/banner/smallbanner(2).jpg" className='w-full' />
                    <div className="font-serif info absolute top-0 -right-[100%] w-[50%] h-[100%] z-50 p-8 
                    flex items-center justify-center flex-col opacity-0 transition-all duration-700">
                        <h4 className='text-[18px] font-[500] w-full text-left mb-3 -right-[100%] relative opacity-0'>
                            Đại Hạ Giá Trong Ngày
                        </h4>
                        <h2 className='font-serif text-[35px] font-[700] w-full -right-[100%] relative opacity-0'>
                            Name Product
                        </h2>
                        <h3 className='font-serif flex items-baseline gap-3 text-left mt-3 mb-3 text-[18px] font-[500] w-full -right-[100%] relative opacity-0'>
                            Giá Chỉ Từ <span className='text-[#ff0606] text-[26px] font-sans'>1,999,999</span>
                        </h3>

                        <div className="animation w-full -right-[100%] relative opacity-0">
                            <Button className='org-btn hover:!bg-[#4649ff]'>Mua Ngay</Button>
                        </div>
                    </div>
                </div>
            </SwiperSlide>

        </Swiper>
    )
}

export default SmallSliderHome;
