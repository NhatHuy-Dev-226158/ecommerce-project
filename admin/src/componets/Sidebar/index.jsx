import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import {
    RxDashboard,
    RxImage,
} from "react-icons/rx";
import {
    FiUsers,
    FiBarChart2,
    FiVolume2,
    FiSettings,
} from "react-icons/fi";
import { FaShopify } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from 'react-collapse';
import { MyContext } from '../../App';

const Sidebar = () => {
    const [OpenSubMenu, setOpenSubMenu] = useState(null);
    const context = useContext(MyContext);
    const { isSidebarOpen } = useContext(MyContext);
    const isOpenSubMenu = (index) => {
        if (OpenSubMenu === index) {
            setOpenSubMenu(null);
        } else {
            setOpenSubMenu(index);
        }
    }



    return (
        <>
            <div className={`sidebar fixed top-0 left-0 bg-slate-50 transition-transform duration-300 ease-in-out
            h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4 !w-72 z-50
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className="py-2 w-full flex items-center justify-center">
                    <Link to='/'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dash_%28cryptocurrency%29_logo.svg/1024px-Dash_%28cryptocurrency%29_logo.svg.png" className='w-[160px]' />
                    </Link>
                </div>

                <ul className='mt-4 overflow-y-auto h-[calc(100%-80px)]'>
                    <li>
                        <Link to='/'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <RxDashboard className='text-[20px] group-hover:text-indigo-600' />
                                <span>Tổng Quan</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(1)}>
                            <RxImage className='text-[20px] group-hover:text-indigo-600' />
                            <span>
                                Home  slides
                            </span>
                            <span className='ml-auto flex items-center justify-end'>
                                <FaAngleDown className={`transition-all ${OpenSubMenu === 1 ? 'rotate-180' : ''}`} />
                            </span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 1 ? true : false}>
                            <ul className='w-full'>
                                <li className='w-full'>
                                    <Link to='/home-banner'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Home banner list
                                        </Button>
                                    </Link>
                                </li>
                                <li className='w-full'>
                                    <Link to='/add-home-banner'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Add home banner slide
                                        </Button>
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                    <li>
                        <Link to='/users'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <FiUsers className='text-[20px] group-hover:text-indigo-600' />
                                <span>
                                    Người dùng
                                </span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(2)}>
                            <FaShopify className='text-[20px] group-hover:text-indigo-600' />
                            <span>
                                Sản phẩm
                            </span>
                            <span className='ml-auto flex items-center justify-end'>
                                <FaAngleDown className={`transition-all ${OpenSubMenu === 2 ? 'rotate-180' : ''}`} />
                            </span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 2 ? true : false}>
                            <ul className='w-full'>
                                <li className='w-full'>
                                    <Link to='/product-list'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Danh sách sản phẩm
                                        </Button>
                                    </Link>
                                </li>
                                <li className='w-full'>
                                    <Link to='/product-upload'>
                                        <Button className='!text-[rgba(48,28,28,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Thêm sản phẩm mới
                                        </Button>
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(3)}>
                            <TbCategoryPlus className='text-[20px] group-hover:text-indigo-600' />
                            <span>
                                Danh mục
                            </span>
                            <span className='ml-auto flex items-center justify-end'>
                                <FaAngleDown className={`transition-all ${OpenSubMenu === 3 ? 'rotate-180' : ''}`} />
                            </span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 3 ? true : false}>
                            <ul className='w-full'>
                                <li className='w-full'>
                                    <Link to='/list-category'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Danh sách danh mục
                                        </Button>
                                    </Link>
                                </li>
                                <li className='w-full'>
                                    <Link to='/add-category'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Thêm danh mục
                                        </Button>
                                    </Link>
                                </li>
                                <li className='w-full'>
                                    <Link to='/edit-category'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Sửa danh mục
                                        </Button>
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                    <li>
                        <Link to='/orders'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <IoBagCheckOutline className='text-[20px] group-hover:text-indigo-600' />
                                <span>Các đơn hàng</span>
                            </Button>
                        </Link>
                    </li>
                    <div className='py-2'>
                        <hr />
                    </div>

                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(4)}>
                            <FiBarChart2 className='text-[20px] group-hover:text-indigo-600' />
                            <span>Báo cáo & Thống kê</span>
                            <span className='ml-auto items-center justify-end'><FaAngleDown className={`transition-transform ${OpenSubMenu === 4 ? 'rotate-180' : ''}`} /></span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 4}>
                            <ul className='w-full pl-6 mt-1 space-y-1'>
                                <li><Link to='/reports/sales'><Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px]'>- Báo cáo doanh thu</Button></Link></li>
                                <li><Link to='/reports/users'><Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px]'>- Phân tích người dùng</Button></Link></li>
                            </ul>
                        </Collapse>
                    </li>

                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(5)}>
                            <FiVolume2 className='text-[20px] group-hover:text-indigo-600' />
                            <span>Tiếp thị</span>
                            <span className='ml-auto items-center justify-end'><FaAngleDown className={`transition-transform ${OpenSubMenu === 5 ? 'rotate-180' : ''}`} /></span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 5}>
                            <ul className='w-full pl-6 mt-1 space-y-1'>
                                <li><Link to='/marketing/coupons'><Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px]'>- Mã giảm giá</Button></Link></li>
                                <li><Link to='/marketing/campaigns'><Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px]'>- Chiến dịch Email</Button></Link></li>
                            </ul>
                        </Collapse>
                    </li>

                    <li>
                        <Link to='/settings'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <FiSettings className='text-[20px] group-hover:text-indigo-600' />
                                <span>Cài đặt</span>
                            </Button>
                        </Link>
                    </li>
                    <div className='py-2'>
                        <hr />
                    </div>

                    <li>
                        <Link to='/logout'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <LuLogOut className='text-[20px] group-hover:text-indigo-600' />
                                <span>Đăng xuất</span>
                            </Button>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar;
