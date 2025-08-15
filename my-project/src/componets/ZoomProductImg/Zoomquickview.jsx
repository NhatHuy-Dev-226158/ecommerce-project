import React, { useState, useRef, useEffect } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import 'swiper/css';
import 'swiper/css/navigation';


// --- HÀM HELPER ĐỂ BIẾN ĐỔI URL CLOUDINARY ---
const transformCloudinaryImage = (url, transformations) => {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }
    return url.replace('/upload/', `/upload/${transformations}/`);
};

const ZoomProductImg = ({ images = [] }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSlideBig = useRef(null);
    const zoomSlideSmall = useRef(null);

    useEffect(() => {
        setSlideIndex(0);
        if (zoomSlideBig.current?.swiper) {
            zoomSlideBig.current.swiper.slideTo(0);
        }
        if (zoomSlideSmall.current?.swiper) {
            zoomSlideSmall.current.swiper.slideTo(0);
        }
    }, [images]);

    const goto = (index) => {
        setSlideIndex(index);
        if (zoomSlideSmall.current?.swiper) zoomSlideSmall.current.swiper.slideTo(index);
        if (zoomSlideBig.current?.swiper) zoomSlideBig.current.swiper.slideTo(index);
    };

    // --- XỬ LÝ TRƯỜNG HỢP KHÔNG CÓ ẢNH ---
    if (!images || images.length === 0) {
        return (
            // SỬA LẠI TỶ LỆ Ở ĐÂY CHO ĐÚNG
            <div className="w-full aspect-[6/7] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Không có ảnh
            </div>
        );
    }

    // --- TRƯỜNG HỢP CHỈ CÓ MỘT ẢNH ---
    if (images.length === 1) {
        const bigImageUrl = transformCloudinaryImage(images[0], 'w_600,q_auto,f_auto');
        return (
            <div className="w-full h-full max-h-[550px] overflow-hidden rounded-md border aspect-square">
                <InnerImageZoom zoomType="hover" zoomScale={1} src={bigImageUrl} />
            </div>
        );
    }

    // --- TRƯỜNG HỢP CÓ NHIỀU ẢNH ---
    return (
        <div className="flex gap-3 !items-center !justify-center">
            {/* Slider ảnh nhỏ (bên trái) */}
            <div className="slider w-[18%]">
                <Swiper
                    ref={zoomSlideSmall}
                    direction='vertical'
                    slidesPerView={5}
                    spaceBetween={10}
                    navigation={true}
                    watchSlidesProgress={true}
                    centeredSlides={true}
                    centeredSlidesBounds={true}
                    modules={[Navigation]}
                    className="zoomImgThumbs h-[420px] overflow-hidden"
                >
                    {images.map((imgUrl, index) => {
                        // Tối ưu ảnh nhỏ: cắt thành hình vuông 150x150
                        const thumbUrl = transformCloudinaryImage(imgUrl, 'c_fill,ar_1:1,w_150,q_auto,f_auto'); return (
                            <SwiperSlide key={index}>
                                <div className={`item rounded-md overflow-hidden cursor-pointer group
                            ${slideIndex === index ? '!opacity-30' : '!opacity-100'
                                    }`}
                                    onClick={() => goto(index)}>

                                    <img src={thumbUrl} alt={`Thumbnail ${index + 1}`} className='w-full transition-all group-hover:scale-105 duration-200' />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    <SwiperSlide></SwiperSlide>
                </Swiper>
            </div>
            <div className="zoom-container  w-[82%]  overflow-hidden rounded-md">
                <Swiper
                    ref={zoomSlideBig}
                    slidesPerView={1}
                    spaceBetween={10}
                    allowTouchMove={false}
                >
                    {images.map((imgUrl, index) => {
                        const bigImageUrl = transformCloudinaryImage(imgUrl, 'w_600,q_auto,f_auto');
                        return (
                            <SwiperSlide key={index}>
                                <InnerImageZoom
                                    zoomType="hover"
                                    zoomScale={1}
                                    src={bigImageUrl}
                                    className="w-full h-full rounded-md object-contain"
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
};

export default ZoomProductImg;