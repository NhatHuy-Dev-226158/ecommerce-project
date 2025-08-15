import React, { useState, useRef, useEffect } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import 'swiper/css';
import 'swiper/css/navigation';

const ZoomdetailPage = ({ images = [] }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSlideBig = useRef(null);
    const zoomSlideSmall = useRef(null);

    useEffect(() => {
        setSlideIndex(0);
        if (zoomSlideBig.current?.swiper) zoomSlideBig.current.swiper.slideTo(0);
        if (zoomSlideSmall.current?.swiper) zoomSlideSmall.current.swiper.slideTo(0);
    }, [images]);

    const goto = (index) => {
        setSlideIndex(index);
        if (zoomSlideSmall.current?.swiper) zoomSlideSmall.current.swiper.slideTo(index);
        if (zoomSlideBig.current?.swiper) zoomSlideBig.current.swiper.slideTo(index);
    };

    // --- XỬ LÝ TRƯỜNG HỢP KHÔNG CÓ ẢNH ---
    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Không có ảnh
            </div>
        );
    }

    // --- TRƯỜNG HỢP CHỈ CÓ MỘT ẢNH ---
    if (images.length === 1) {
        return (
            <div className="w-full h-full max-h-[550px] overflow-hidden rounded-md border aspect-square flex items-center justify-center bg-white">
                <InnerImageZoom zoomType="hover" zoomScale={1.5} src={images[0]} className="w-full h-full object-contain" />
            </div>
        );
    }

    // --- TRƯỜNG HỢP CÓ NHIỀU ẢNH ---
    return (
        // Container chính giờ đây sẽ kiểm soát chiều cao
        <div className="!flex !items-center !justify-center w-[600px]  gap-4">
            {/* Slider ảnh nhỏ (bên trái) */}
            <div className="slider w-[18%] h-full">
                <Swiper
                    ref={zoomSlideSmall}
                    direction='vertical'
                    slidesPerView={6}
                    spaceBetween={90}
                    navigation={true}
                    modules={[Navigation]}
                    className="zoomImgThumbs h-[557px] overflow-hidden"
                >
                    {images.map((imgUrl, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className={`item rounded-lg overflow-hidden cursor-pointer border-2 aspect-square transition-all ${slideIndex === index ? 'border-primary !opacity-30' : '!opacity-100 border-transparent'}`}
                                onClick={() => goto(index)}
                            >
                                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className='w-full h-full object-cover' />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Slider ảnh lớn (bên phải) */}
            <div className="zoom-container  flex items-center justify-center w-[82%] h-full overflow-hidden rounded-md">
                <Swiper
                    ref={zoomSlideBig}
                    slidesPerView={1}
                    spaceBetween={10}
                    allowTouchMove={false}
                    className="h-full"
                >
                    {images.map((imgUrl, index) => (
                        <SwiperSlide key={index}>
                            <div className="w-full h-full flex items-center  justify-center bg-white">
                                <InnerImageZoom
                                    zoomType="hover"
                                    zoomScale={1}
                                    src={imgUrl}
                                    className="w-full h-full rounded-md object-contain "
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ZoomdetailPage;