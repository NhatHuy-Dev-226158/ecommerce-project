import React, { useContext, useEffect, useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../Sidebar/style.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
import { FaAngleUp } from "react-icons/fa6";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { Skeleton } from '@mui/material';

const SideBar = () => {
    const context = useContext(MyContext);

    const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
    const [isOpenAvailabiliyFilter, setIsOpenAvailabiliyFilter] = useState(true);
    const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            const result = await fetchDataFromApi('/api/category/');
            if (result.success) {
                // Lọc ra chỉ các danh mục cha (không có parentId) và được phép hiển thị
                const parentCategories = result.data.filter(cat => cat.isPublished !== false);
                setCategories(parentCategories);
            } else {
                console.error("Không thể tải danh mục cho sidebar.");
            }
            setIsLoadingCategories(false);
        };
        fetchCategories();
    }, []);


    return (
        <aside className='sidebar py-5'>
            <div className="box">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Tất Cả Danh Mục
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}>
                        {
                            isOpenCategoryFilter === true ? <FaAngleDown /> : <FaAngleUp />
                        }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter}>
                    <div className="scroll px-4 relative -left-[13px] flex flex-col">
                        {isLoadingCategories ? (
                            // Hiển thị Skeleton loading
                            Array.from(new Array(5)).map((_, index) => (
                                <Skeleton key={index} variant="text" width="80%" sx={{ marginBottom: '8px' }} />
                            ))
                        ) : (
                            // Render động các danh mục
                            categories.map(category => (
                                <FormControlLabel
                                    key={category._id}
                                    control={<Checkbox size='small' />}
                                    label={category.name}
                                    className='w-full'
                                />
                            ))
                        )}
                    </div>
                </Collapse>
            </div>

            <div className="box mt-3">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Số LượngLượng
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenAvailabiliyFilter(!isOpenAvailabiliyFilter)}>
                        {
                            isOpenAvailabiliyFilter === true ? <FaAngleDown /> : <FaAngleUp />
                        }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenAvailabiliyFilter}>
                    <div className="scroll px-4 relative -left-[13px] flex flex-col">
                        <FormControlLabel control={<Checkbox size='small' />} label="Có sẵn " className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="Trong Kho" className='w-full' />
                        <FormControlLabel control={<Checkbox size='small' />} label="Hết Hàng" className='w-full' />
                    </div>
                </Collapse>
            </div>

            <div className="box mt-3">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Size
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#ff5555]'
                        onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}>
                        {
                            isOpenSizeFilter === true ? <FaAngleDown /> : <FaAngleUp />
                        }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenSizeFilter}>
                    <div className="scroll px-4 relative -left-[13px] flex flex-col">
                        <FormControlLabel control={<Checkbox size='S' />} label="Có sẵn " className='w-full' />
                        <FormControlLabel control={<Checkbox size='M' />} label="Trong Kho" className='w-full' />
                        <FormControlLabel control={<Checkbox size='L' />} label="Hết Hàng" className='w-full' />
                        <FormControlLabel control={<Checkbox size='XL' />} label="Trong Kho" className='w-full' />
                        <FormControlLabel control={<Checkbox size='XXL' />} label="Hết Hàng" className='w-full' />
                    </div>
                </Collapse>
            </div>

            <div className="box mt-4">
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Giá
                </h3>

                <RangeSlider />
                <div className="flex pt-4 pb-2 priceRange">
                    <span className='text-[13px]'>
                        Từ: <strong className='text-black'>0</strong>
                    </span>
                    <span className='ml-auto text-[13px]'>
                        Đến: <strong className='text-black'>1,000,000</strong>
                    </span>
                </div>
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
            </div>
        </aside>
    )
}

export default SideBar;
