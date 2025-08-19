import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Skeleton } from '@mui/material';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';


const CategorySlider = () => {
    // === LẤY HÀM LỌC SẢN PHẨM TỪ CONTEXT ===
    const { applyFilterAndNavigate, openAlerBox } = useContext(MyContext);

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchParentCategories = async () => {
            setIsLoading(true);
            try {
                const result = await fetchDataFromApi('/api/category/');
                if (result.success) {
                    const parentCategories = result.data.filter(cat => cat.isPublished !== false);
                    setCategories(parentCategories);
                } else {
                    throw new Error("Không thể tải danh mục cho slider.");
                }
            } catch (error) {
                openAlerBox("error", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchParentCategories();
    }, [openAlerBox]);

    // === HÀM XỬ LÝ KHI CLICK VÀO MỘT DANH MỤC ===
    const handleCategoryClick = (category) => {
        // Kiểm tra xem danh mục được click có con hay không
        const hasChildren = category.children && category.children.length > 0;

        // Gọi hàm từ context, truyền thêm thông tin `expandParent`
        applyFilterAndNavigate('category', category._id, { expandParent: hasChildren });
    };

    // Component Skeleton để hiển thị khi đang tải
    const SliderSkeleton = () => (
        <Swiper slidesPerView={8} spaceBetween={10} className="mySwiper">
            {Array.from(new Array(8)).map((_, index) => (
                <SwiperSlide key={index}>
                    <div className="h-[200px] item py-6 px-3 bg-white rounded-lg text-center flex items-center justify-center flex-col">
                        <Skeleton variant="rectangular" width={128} height={109} />
                        <Skeleton variant="text" width="80%" sx={{ marginTop: '12px' }} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );

    return (
        <div className='categorySlider pt-4 py-8 bg-gray-50'>
            <div className="container">
                {isLoading ? <SliderSkeleton /> : (
                    <Swiper
                        slidesPerView={8}
                        spaceBetween={10}
                        navigation={true}
                        modules={[Navigation]}
                        className="mySwiper"
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
                                <div
                                    onClick={() => handleCategoryClick(category)}
                                    className="cursor-pointer"
                                >
                                    <div className="h-[200px] item py-6 px-3 bg-white rounded-lg text-center flex items-center justify-center flex-col group overflow-hidden">
                                        <img
                                            src={category.images && category.images.length > 0 ? category.images[0] : '/placeholder.png'}
                                            alt={category.name}
                                            className='w-[128px] h-[109px] object-contain transition-transform duration-300 group-hover:scale-110'
                                        />
                                        <h3 className='text-[15px] font-semibold mt-3 text-gray-800'>{category.name}</h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default CategorySlider;