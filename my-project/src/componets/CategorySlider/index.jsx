import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { Skeleton, Box } from '@mui/material';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';


// Hàm helper để tạo slug (có thể import từ một file chung)
const createSlug = (name) => {
    return name.toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/&/g, 'va');
};


const CategorySlider = () => {

    const context = useContext(MyContext);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchParentCategories = async () => {
            setIsLoading(true);
            const result = await fetchDataFromApi('/api/category/');
            if (result.success) {
                // Lọc ra chỉ các danh mục cha (không có parentId) và được phép hiển thị
                const parentCategories = result.data.filter(cat => cat.isPublished !== false);
                setCategories(parentCategories);
            } else {
                context.openAlerBox("error", "Không thể tải danh mục cho slider.");
            }
            setIsLoading(false);
        };
        fetchParentCategories();
    }, []);

    // Component Skeleton để hiển thị khi đang tải dữ liệu
    const SliderSkeleton = () => (
        <Swiper slidesPerView={8} spaceBetween={10} modules={[Navigation]} className="mySwiper">
            {Array.from(new Array(8)).map((_, index) => (
                <SwiperSlide key={index}>
                    <div className="item py-6 px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                        <Skeleton variant="rectangular" width={128} height={109} />
                        <Skeleton variant="text" width="80%" sx={{ marginTop: '12px' }} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );


    return (
        <div className='categorySlider pt-4 py-8 '>
            <div className="container">
                {isLoading ? <SliderSkeleton /> : (
                    <Swiper
                        slidesPerView={8}
                        spaceBetween={10}
                        navigation={true}
                        modules={[Navigation]}
                        className="mySwiper"
                        // Thêm breakpoints để responsive
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 10 },
                            480: { slidesPerView: 3, spaceBetween: 10 },
                            640: { slidesPerView: 4, spaceBetween: 10 },
                            768: { slidesPerView: 6, spaceBetween: 10 },
                            1024: { slidesPerView: 8, spaceBetween: 10 },
                        }}
                    >
                        {categories.map(category => (
                            <SwiperSlide key={category._id}>
                                <Link to={`/category/${createSlug(category.name)}`}>
                                    <div className="item py-6 px-3 bg-white rounded-lg text-center flex items-center justify-center flex-col group overflow-hidden">
                                        <img
                                            src={category.images && category.images.length > 0 ? category.images[0] : '/placeholder.png'}
                                            alt={category.name}
                                            className='w-[128px] h-[109px] object-contain transition-transform duration-300 group-hover:scale-110'
                                        />
                                        <h3 className='text-[15px] font-semibold mt-3 text-gray-800'>{category.name}</h3>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
}

export default CategorySlider;

