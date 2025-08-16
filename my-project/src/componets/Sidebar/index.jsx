import React, { useState, useEffect } from 'react';
import { FormControlLabel, Checkbox, Button, Skeleton, Rating, Box, Typography, Divider, FormGroup } from '@mui/material';
import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import '../Sidebar/style.css';
import { fetchDataFromApi } from '../../utils/api';

const SideBar = ({ filters, onFilterChange }) => {
    // === STATE QUẢN LÝ VIỆC ĐÓNG/MỞ CÁC KHỐI ===
    const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
    const [isOpenAvailabiliyFilter, setIsOpenAvailabiliyFilter] = useState(true);

    // === STATE NỘI BỘ CỦA SIDEBAR ===
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [priceValue, setPriceValue] = useState(filters?.price || [0, 1000000]);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const result = await fetchDataFromApi('/api/category/');
                if (result.success) {
                    setCategories(result.data.filter(cat => cat.isPublished !== false));
                }
            } catch (error) {
                console.error("Không thể tải danh mục cho sidebar.");
            }
            setIsLoadingCategories(false);
        };
        fetchCategories();
    }, []);

    // === CÁC HÀM XỬ LÝ SỰ KIỆN ===
    // Hàm này được gọi khi tick/bỏ tick một checkbox danh mục
    const handleCategoryChange = (categoryId) => (event) => {
        const { checked } = event.target;
        const newCategoryId = checked ? categoryId : '';
        onFilterChange('category', newCategoryId);
    };
    // Hàm này được gọi khi người dùng nhả chuột khỏi thanh trượt giá
    const handlePriceChange = (newPrice) => {
        onFilterChange('price', newPrice);
    };
    return (
        <aside className='sidebar py-5'>
            {/* === KHỐI DANH MỤC === */}
            <div className="box">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Tất Cả Danh Mục
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}>
                        {isOpenCategoryFilter ? <FaAngleDown /> : <FaAngleUp />}
                    </Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter}>
                    <div className="scroll px-4 relative -left-[13px] flex flex-col">
                        {isLoadingCategories ? (
                            Array.from(new Array(5)).map((_, index) => (
                                <Skeleton key={index} variant="text" width="80%" sx={{ marginBottom: '8px' }} />
                            ))
                        ) : (
                            categories.map(category => (
                                <FormControlLabel
                                    key={category._id}
                                    control={
                                        <Checkbox
                                            size='small'
                                            checked={filters?.category === category._id}
                                            onChange={handleCategoryChange(category._id)}
                                        />
                                    }
                                    label={category.name}
                                    className='w-full'
                                />
                            ))
                        )}
                    </div>
                </Collapse>
            </div>

            {/* === KHỐI GIÁ === */}
            <div className="w-[88%] box mt-4">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Giá
                </h3>
                <RangeSlider
                    min={0}
                    max={5000000000}
                    step={50000}
                    value={priceValue}
                    onInput={setPriceValue}
                    onThumbDragEnd={() => handlePriceChange(priceValue)}
                />
                <div className="flex pt-4 pb-2 priceRange">
                    <span className='text-[13px]'>
                        Từ: <strong className='text-black'>{priceValue[0].toLocaleString('vi-VN')}</strong>
                    </span>
                    <span className='ml-auto text-[13px]'>
                        Đến: <strong className='text-black'>{priceValue[1].toLocaleString('vi-VN')}</strong>
                    </span>
                </div>
            </div>

            {/* === CÁC KHỐI KHÁC === */}
            <div className="box mt-3">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Số Lượng
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenAvailabiliyFilter(!isOpenAvailabiliyFilter)}>
                        {isOpenAvailabiliyFilter ? <FaAngleDown /> : <FaAngleUp />}
                    </Button>
                </h3>
                <Collapse isOpened={isOpenAvailabiliyFilter}>
                    <div className="scroll px-4 relative -left-[13px] flex flex-col">
                        <FormControlLabel control={<Checkbox size='small' />} label="Có sẵn" className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="Hết Hàng" className='w-full' />
                    </div>
                </Collapse>
            </div>
            {/* <div className="box mt-3">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Size
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}>
                        {isOpenSizeFilter ? <FaAngleDown /> : <FaAngleUp />}
                    </Button>
                </h3>
                <Collapse isOpened={isOpenSizeFilter}>
                    <div className="scroll px-4 relative -left-[13px] flex flex-col">
                        <FormControlLabel control={<Checkbox size='small' />} label="S" className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="M" className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="L" className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="XL" className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="XXL" className='w-full' />
                    </div>
                </Collapse>
            </div>

            <div className="box mt-4">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Xếp Hạng
                </h3>
                <div className="flex flex-col gap-2">
                    <Rating name="size-small" defaultValue={5} size="small" readOnly />
                    <Rating name="size-small" defaultValue={4} size="small" readOnly />
                    <Rating name="size-small" defaultValue={3} size="small" readOnly />
                    <Rating name="size-small" defaultValue={2} size="small" readOnly />
                    <Rating name="size-small" defaultValue={1} size="small" readOnly />
                </div>
            </div> */}
        </aside>
    );
};

export default SideBar;