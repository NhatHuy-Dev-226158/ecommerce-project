import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsMenuButtonWideFill } from "react-icons/bs";
import { TfiAngleDown } from "react-icons/tfi";
import { IoHomeOutline, IoRocketOutline, IoChevronDownOutline } from "react-icons/io5";
import CategoryMenu from './CategoryMenu';
import '../Navigation/style.css';

const Navigation = () => {
    const [isOpenCategoryMenu, setIsOpenCategoryMenu] = useState(false);

    const openCategoryMenu = () => {
        setIsOpenCategoryMenu(true);
    };

    const navButtonStyle = {
        color: 'rgba(0,0,0,0.7)',
        fontWeight: 500,
        padding: '0.75rem 0.5rem',
        fontSize: '15px',
        textTransform: 'none',
        borderRadius: '8px',
        position: 'relative',
        '& .chevron-icon': {
            marginLeft: '4px',
            fontSize: '12px',
            transition: 'transform 0.2s ease',
        },
        '&:hover .chevron-icon': {
            transform: 'rotate(180deg)',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '0',
            width: '100%',
            height: '2px',
            backgroundColor: '#ff4646',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom center',
            transition: 'transform 0.3s ease-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
        '&:hover': {
            color: '#000',
            backgroundColor: 'transparent'
        },
    };

    const subMenuButtonStyle = {
        color: 'rgba(0,0,0,0.85)',
        width: '100%',
        justifyContent: 'flex-start',
        borderRadius: '6px',
        padding: '0.7rem 1rem',
        textTransform: 'none',
        fontSize: '14px',
        '&:hover': {
            color: '#ff4646',
            backgroundColor: 'rgba(255, 70, 70, 0.05)'
        }
    };

    return (
        <>
            <nav>
                <div className="container flex items-center justify-end gap-4">
                    <div className="col_1 w-[20%]">
                        <Button className='!text-black gap-2 w-full !bg-[#f7f7f7] !px-3' onClick={openCategoryMenu}>
                            <BsMenuButtonWideFill className='text-[18px]' />
                            DANH MỤC
                            <TfiAngleDown className='text-[12px] ml-auto !font-bold' />
                        </Button>
                    </div>

                    <div className="h-8 border-l-2 border-gray-200"></div>

                    <div className="col_2 w-[65%]">
                        <ul className="flex items-center gap-4 justify-center nav">
                            <li className="list-none relative">
                                <Button component={Link} to="/" sx={navButtonStyle}><IoHomeOutline /></Button>
                            </li>

                            <li className="list-none relative">
                                <Button sx={navButtonStyle}>Tươi Sống <IoChevronDownOutline className="chevron-icon" /></Button>
                                <div className="submenu absolute top-[100%] left-0 min-w-[240px] bg-white shadow-md">
                                    <ul>
                                        <li><Button component={Link} to='/category/rau-cu-qua' sx={subMenuButtonStyle}>Rau, Củ, Quả</Button></li>
                                        <li><Button component={Link} to='/category/thit-hai-san' sx={subMenuButtonStyle}>Thịt, Hải Sản</Button></li>
                                        <li><Button component={Link} to='/category/thuc-pham-che-bien' sx={subMenuButtonStyle}>Thực Phẩm Chế Biến Sẵn</Button></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="list-none relative">
                                <Button sx={navButtonStyle}>Đồ Khô <IoChevronDownOutline className="chevron-icon" /></Button>
                                <div className="submenu absolute top-[100%] left-0 min-w-[240px] bg-white shadow-md">
                                    <ul>
                                        <li><Button component={Link} to='/category/gao-mi-nong-san' sx={subMenuButtonStyle}>Gạo, Mì & Nông Sản Khô</Button></li>
                                        <li><Button component={Link} to='/category/gia-vi' sx={subMenuButtonStyle}>Gia Vị & Nước Chấm</Button></li>
                                        <li><Button component={Link} to='/category/do-hop' sx={subMenuButtonStyle}>Thực Phẩm Đóng Hộp</Button></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="list-none relative">
                                <Button sx={navButtonStyle}>Đồ Uống <IoChevronDownOutline className="chevron-icon" /></Button>
                                <div className="submenu absolute top-[100%] left-0 min-w-[240px] bg-white shadow-md">
                                    <ul>
                                        <li><Button component={Link} to='/category/nuoc-giai-khat' sx={subMenuButtonStyle}>Nước Giải Khát</Button></li>
                                        <li><Button component={Link} to='/category/sua' sx={subMenuButtonStyle}>Sữa & Sản Phẩm Từ Sữa</Button></li>
                                        <li><Button component={Link} to='/category/bia-ruou' sx={subMenuButtonStyle}>Bia, Rượu & Đồ Uống Có Cồn</Button></li>
                                        <li><Button component={Link} to='/category/tra-ca-phe' sx={subMenuButtonStyle}>Trà, Cà Phê & Ca Cao</Button></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="list-none relative">
                                <Button component={Link} to="/category/an-vat" sx={navButtonStyle}>Ăn Vặt</Button>
                            </li>

                            <li className="list-none relative">
                                <Button sx={navButtonStyle}>Hóa Mỹ Phẩm <IoChevronDownOutline className="chevron-icon" /></Button>
                                <div className="submenu absolute top-[100%] left-0 min-w-[240px] bg-white shadow-md">
                                    <ul>
                                        <li><Button component={Link} to='/category/cham-soc-toc' sx={subMenuButtonStyle}>Chăm Sóc Tóc</Button></li>
                                        <li><Button component={Link} to='/category/cham-soc-co-the' sx={subMenuButtonStyle}>Chăm Sóc Cơ Thể</Button></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="list-none relative">
                                <Button component={Link} to="/category/me-be" sx={navButtonStyle}>Mẹ & Bé</Button>
                            </li>
                        </ul>
                    </div>

                    <div className="h-8 border-l-2 border-gray-200"></div>

                    <div className="col_3 w-[15%]">
                        <p className='text-[12px] !font-[600] text-gray-500 flex items-center gap-2 mb-0 mt-0'>
                            <IoRocketOutline className='text-[18px]' />
                            Giao Hàng Nhanh
                        </p>
                    </div>
                </div>
            </nav>

            <CategoryMenu
                isOpenCategoryMenu={isOpenCategoryMenu}
                setIsOpenCategoryMenu={setIsOpenCategoryMenu}
            />
        </>
    );
};

export default Navigation;