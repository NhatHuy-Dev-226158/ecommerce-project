import React, { useRef, useState } from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import 'swiper/css';
import 'swiper/css/navigation';

const ZoomProductImg = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSlideBig = useRef();
    const zoomSlideSmall = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSlideSmall.current.swiper.slideTo(index);
        zoomSlideBig.current.swiper.slideTo(index);
    }

    return (
        <>
            <div className="flex gap-3">
                <div className="slider w-[15%]">
                    <Swiper
                        ref={zoomSlideSmall}
                        direction='vertical'
                        slidesPerView={6}
                        spaceBetween={48}
                        navigation={true}
                        watchSlidesProgress={true}
                        centeredSlides={true}
                        centeredSlidesBounds={true}
                        modules={[Navigation]}
                        className="zoomImgThumbs h-[420px] overflow-hidden"
                    >
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 0 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(0)}>
                                <img src="/product/download(1).png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 1 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(1)}>
                                <img src="/product/720x840.png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 2 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(2)}>
                                <img src="/product/download(1).png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 3 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(3)}>
                                <img src="/product/720x840.png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 4 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(4)}>
                                <img src="/product/download(1).png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 5 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(5)}>
                                <img src="/product/720x840.png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === 6 ? '!opacity-30' : '!opacity-100'
                                }`}
                                onClick={() => goto(6)}>
                                <img src="/product/download(1).png" className='w-full transition-all group-hover:scale-105 duration-200' />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide></SwiperSlide>

                    </Swiper>
                </div>
                <div className="zoom-container w-[85%] h-[420px] overflow-hidden rounded-md">
                    <Swiper
                        ref={zoomSlideBig}
                        slidesPerView={1}
                        spaceBetween={0}
                        navigation={false}
                    >
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/download(1).png'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/720x840.png'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/download(1).png'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/720x840.png'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/download(1).png'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/720x840.png'} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={'/product/download(1).png'} />
                        </SwiperSlide>

                    </Swiper>
                </div>
            </div >
        </>
    )
}

export default ZoomProductImg;
