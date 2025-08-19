import React, { useState, useEffect, useContext } from 'react';
import { FormControlLabel, Checkbox, Button, Skeleton, Rating, Box, Typography, Divider, Collapse as MuiCollapse } from '@mui/material';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import '../Sidebar/style.css';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const SideBar = ({ filters, onFilterChange }) => {
    // === STATE QUẢN LÝ VIỆC ĐÓNG/MỞ CÁC KHỐI ===
    const [isOpenAvailabiliyFilter, setIsOpenAvailabiliyFilter] = useState(true);
    const { productFilters } = useContext(MyContext);
    // === STATE NỘI BỘ CỦA SIDEBAR ===
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [priceValue, setPriceValue] = useState(filters?.price || [0, 1000000]);
    // State để quản lý đóng/mở của từng danh mục cha
    const [openCategories, setOpenCategories] = useState({});

    // === LOGIC FETCH VÀ XỬ LÝ DỮ LIỆU ===
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const result = await fetchDataFromApi('/api/category/');
                if (result.success) {
                    const publishedCategories = result.data.filter(cat => cat.isPublished !== false);
                    setCategories(publishedCategories);
                    // Mặc định mở tất cả các danh mục cha có con
                    const initialOpenState = {};
                    publishedCategories.forEach(cat => {
                        if (cat._id === productFilters.expandedParentCategory) {
                            initialOpenState[cat._id] = true;
                        } else {
                            // Giữ trạng thái đóng/mở mặc định cho các danh mục khác
                            initialOpenState[cat._id] = cat.children && cat.children.length > 0;
                        }
                    });
                    setOpenCategories(initialOpenState);
                }
            } catch (error) {
                console.error("Không thể tải danh mục cho sidebar.");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [productFilters.expandedParentCategory]);

    // === CÁC HÀM XỬ LÝ SỰ KIỆN ===
    const handleCategoryChange = (categoryId) => (event) => {
        const { checked } = event.target;
        onFilterChange('category', checked ? categoryId : '');
    };

    const handlePriceChange = (newPrice) => {
        onFilterChange('price', newPrice);
    };

    const toggleCategory = (categoryId) => {
        setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
    };

    return (
        <aside className='sidebar py-5 border p-4 rounded-lg bg-white shadow-sm'>
            {/* === KHỐI DANH MỤC ĐA CẤP === */}
            <div className="box">
                <h3 className='!w-full mb-3 text-[16px] font-[600]'>Tất Cả Danh Mục</h3>
                {isLoadingCategories ? (
                    Array.from(new Array(5)).map((_, index) => <Skeleton key={index} variant="text" sx={{ my: 1 }} />)
                ) : (
                    <div className="scroll px-1 relative -left-[13px] flex flex-col">
                        {categories.map(category => {
                            const isParentWithChildren = category.children && category.children.length > 0;
                            // Nếu là danh mục cha và có con
                            if (isParentWithChildren) {
                                return (
                                    <div key={category._id} className="py-1">
                                        <div
                                            className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-gray-100"
                                            onClick={() => toggleCategory(category._id)}
                                        >
                                            <Typography variant="subtitle2" fontWeight="bold">{category.name}</Typography>
                                            <Button size="small" className="!min-w-0 !p-1 !rounded-full">
                                                {openCategories[category._id] ? <FaAngleUp size={12} /> : <FaAngleDown size={12} />}
                                            </Button>
                                        </div>
                                        <MuiCollapse in={openCategories[category._id]} timeout="auto" unmountOnExit>
                                            <div className="pl-3 border-l-2 border-gray-200 ml-1 mt-1 space-y-0">
                                                {category.children.map(child => (
                                                    <FormControlLabel
                                                        key={child._id}
                                                        control={<Checkbox size='small' checked={filters?.category === child._id} onChange={handleCategoryChange(child._id)} />}
                                                        label={<Typography variant="body2">{child.name}</Typography>}
                                                        className='w-full !ml-0'
                                                    />
                                                ))}
                                            </div>
                                        </MuiCollapse>
                                    </div>
                                );
                            }
                            // Nếu là danh mục không có con
                            return (
                                <FormControlLabel
                                    key={category._id}
                                    control={<Checkbox size='small' checked={filters?.category === category._id} onChange={handleCategoryChange(category._id)} />}
                                    label={<Typography variant="body2">{category.name}</Typography>}
                                    className='w-full'
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <Divider sx={{ my: 2 }} />

            {/* === KHỐI GIÁ === */}
            <div className="box">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center'>Giá</h3>
                <RangeSlider
                    min={0}
                    max={5000000}
                    step={50000}
                    value={priceValue}
                    onInput={setPriceValue}
                    onThumbDragEnd={() => handlePriceChange(priceValue)}
                />
                <div className="flex pt-4 pb-2 priceRange">
                    <span className='text-[13px]'>
                        Từ: <strong className='text-black'>{priceValue[0].toLocaleString('vi-VN')} đ</strong>
                    </span>
                    <span className='ml-auto text-[13px]'>
                        Đến: <strong className='text-black'>{priceValue[1].toLocaleString('vi-VN')} đ</strong>
                    </span>
                </div>
            </div>

            <Divider sx={{ my: 2 }} />

            {/* === KHỐI SỐ LƯỢNG === */}
            <div className="box">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center justify-between'>
                    <span>Số Lượng</span>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenAvailabiliyFilter(!isOpenAvailabiliyFilter)}>
                        {isOpenAvailabiliyFilter ? <FaAngleDown /> : <FaAngleUp />}
                    </Button>
                </h3>
                <MuiCollapse in={isOpenAvailabiliyFilter}>
                    <div className="scroll flex flex-col">
                        <FormControlLabel control={<Checkbox size='small' />} label={<Typography variant="body2">Có sẵn</Typography>} className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label={<Typography variant="body2">Hết Hàng</Typography>} className='w-full' />
                    </div>
                </MuiCollapse>
            </div>
        </aside>
    );
};

export default SideBar;