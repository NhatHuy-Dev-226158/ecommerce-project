import Button from '@mui/material/Button';
import React, { useState } from 'react'
import { BsMenuButtonWideFill } from "react-icons/bs";
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { GiClothesline } from "react-icons/gi";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { IoBagHandleOutline } from "react-icons/io5";
import { GiFootTrip } from "react-icons/gi";
import { FaGem } from "react-icons/fa";
import { IoRocketOutline } from "react-icons/io5";
import CategoryMenu from './CategoryMenu';
import '../Navigation/style.css'

const Navigation = () => {

    const [isOpenCategoryMenu, setIsOpenCategoryMenu] = useState(false);

    const openCategoryMenu = () => {
        setIsOpenCategoryMenu(true);

    }

    return (
        <>
            <nav>
                <div className="container flex items-center justify-end gap-8">

                    <div className="col_1 w-[20%]">
                        <Button className='!text-black gap-2 w-full' onClick={openCategoryMenu}>
                            <BsMenuButtonWideFill className='text-[18px]' />
                            DANH MỤC MUA SẮM
                            <TfiAngleDown className='text-[12px] ml-4 !font-bold' />
                        </Button>
                    </div>
                    <div className="h-8 border-l-2 border-gray-300"></div>
                    <div className="col_2 w-[60%]">
                        <ul className="flex items-center gap-6 justify-center nav">
                            <li className="list-none">
                                <Link to="/" className="link transition text-[14px] font-[500] flex items-center">
                                    <Button className='link transition !gap-2 !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[red] !py-4 '>
                                        <IoHomeOutline /> Home
                                    </Button>

                                </Link>
                            </li>

                            <li className="list-none relative">
                                <Link to="/product-list" className="link transition text-[14px] font-[500] flex items-center ">
                                    <Button className='link transition !gap-2 !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[red]  !py-4'>
                                        <GiClothesline />
                                        Thời Trang
                                    </Button>
                                </Link>
                                <div className="submenu absolute top-[120%] left-[0%] min-w-[180px] 
                                bg-white shadow-md opacity-0 transition-all">
                                    <ul>
                                        <li className='list-none w-full'>
                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Nam</Button>
                                                <div className="submenu absolute top-[120%] left-[0%] min-w-[180px] 
                                bg-white shadow-md opacity-0 transition-all">
                                                    <ul>
                                                        <li className='list-none w-full'>
                                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Nam</Button></Link>

                                                        </li>
                                                        <li className='list-none w-full'>
                                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Nữ</Button></Link>

                                                        </li>
                                                        <li className='list-none w-full'>
                                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Trẻ Em</Button></Link>

                                                        </li>
                                                        <li className='list-none w-full'>
                                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Người Cao Tuổi</Button></Link>

                                                        </li>
                                                    </ul>
                                                </div></Link>

                                        </li>
                                        <li className='list-none w-full'>
                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Nữ</Button></Link>

                                        </li>
                                        <li className='list-none w-full'>
                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Trẻ Em</Button></Link>

                                        </li>
                                        <li className='list-none w-full'>
                                            <Link to='/product-list' className='w-full'><Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left
                                            !justify-start !rounded-none'>Người Cao Tuổi</Button></Link>

                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="list-none">
                                <Link to="/product-list" className="link transition text-[14px] font-[500] flex items-center gap-2">
                                    <Button className='link transition !gap-2 !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[red] !py-4 '>
                                        <MdOutlineLaptopChromebook />
                                        Điện Tử
                                    </Button>

                                </Link>
                            </li>

                            <li className="list-none">
                                <Link to="/product-list" className="link transition text-[14px] font-[500] flex items-center gap-2">
                                    <Button className='link transition !gap-2 !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[red]  !py-4'>
                                        <IoBagHandleOutline />
                                        Túi Xách
                                    </Button>

                                </Link>
                            </li>

                            <li className="list-none">
                                <Link to="/product-list" className="link transition text-[14px] font-[500] flex items-center gap-2">
                                    <Button className='link transition !gap-2 !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[red]  !py-4 '>
                                        <GiFootTrip />
                                        Giày Dép
                                    </Button>

                                </Link>
                            </li>

                            <li className="list-none">
                                <Link to="/product-list" className="link transition text-[14px] font-[500] flex items-center ">
                                    <Button className='link transition !gap-2 !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[red]  !py-4 '>
                                        <FaGem />
                                        Đồ Trang Sức
                                    </Button>

                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="h-8 border-l-2 border-gray-300"></div>
                    <div className="col_3 w-[20%]">
                        <p className='text-[12px] !font-[600] text-gray-500 flex items-center gap-2 mb-0 mt-0'>
                            <IoRocketOutline className='text-[18px]' />
                            Miễn Phí Vận Chuyển Đơn Quốc Tế
                        </p>
                    </div>

                </div>
            </nav>
            {/*Component menu chính, hiển thị danh sách từ trái sang phải */}
            <CategoryMenu
                isOpenCategoryMenu={isOpenCategoryMenu}
                setIsOpenCategoryMenu={setIsOpenCategoryMenu}>

            </CategoryMenu>
        </>
    )
}

export default Navigation;
