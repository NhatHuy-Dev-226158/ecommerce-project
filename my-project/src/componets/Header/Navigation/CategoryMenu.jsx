import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { LuCircleMinus } from "react-icons/lu";

const CategoryMenu = (props) => {

    const [submenuIndex, setSubmenuIndex] = useState(null);
    const [inersubmenuIndex, setInerSubmenuIndex] = useState(null);

    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCategoryMenu(newOpen);
    };

    const openSubmenu = (index) => {
        if (submenuIndex === index) {
            setSubmenuIndex(null);
        } else {
            setSubmenuIndex(index);
        }
    }

    const openInerSubmenu = (index) => {
        if (inersubmenuIndex === index) {
            setInerSubmenuIndex(null);
        } else {
            setInerSubmenuIndex(index);
        }
    }

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" className='categoryMenu'>

            <h2 className='flex items-center justify-between p-3 text-[20px] font-[500]'>
                All Categories <IoCloseCircleOutline onClick={toggleDrawer(false)} className='cursor-pointer text-[20px]' />
            </h2>

            <div className="scroll">
                <ul className='w-full'>
                    <li className='list-none flex items-center relative flex-col'>
                        <Link to='/product-list' className='w-full'>
                            <Button className=' link w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>
                                Thời Trang
                            </Button>
                        </Link>
                        {submenuIndex == 0 ? (
                            <LuCircleMinus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openSubmenu(0)} />

                        ) : (
                            <LuCirclePlus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openSubmenu(0)} />
                        )}
                        {submenuIndex === 0 && (<ul className='submenu w-full pl-5'>
                            <li className='list-none relative'>
                                <Link to='/product-list' className='w-full'>
                                    <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>
                                        Nam
                                    </Button>
                                </Link>
                                {inersubmenuIndex == 0 ? (
                                    <LuCircleMinus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openInerSubmenu(0)} />
                                ) : (
                                    <LuCirclePlus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openInerSubmenu(0)} />
                                )}
                                {
                                    inersubmenuIndex === 0 && (
                                        <ul className='iner_submenu w-full pl-5'>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Áo
                                                </Link>
                                            </li>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Quần
                                                </Link>
                                            </li>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Giày
                                                </Link>
                                            </li>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Phụ Kiện
                                                </Link>
                                            </li>
                                        </ul>
                                    )
                                }

                            </li>

                        </ul>)
                        }
                    </li>

                    <li className='list-none flex items-center relative flex-col'>
                        <Link to='/product-list' className='w-full'>
                            <Button className=' link w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>
                                Điện Tử
                            </Button>
                        </Link>
                        {submenuIndex == 1 ? (
                            <LuCircleMinus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openSubmenu(1)} />

                        ) : (
                            <LuCirclePlus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openSubmenu(1)} />
                        )}
                        {submenuIndex === 1 && (<ul className='submenu w-full pl-5'>
                            <li className='list-none relative'>
                                <Link to='/product-list' className='w-full'>
                                    <Button className='w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>
                                        LapTop
                                    </Button>
                                </Link>
                                {inersubmenuIndex == 1 ? (
                                    <LuCircleMinus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openInerSubmenu(1)} />
                                ) : (
                                    <LuCirclePlus className='absolute top-[10px] right-[35px] cursor-pointer' onClick={() => openInerSubmenu(1)} />
                                )}
                                {
                                    inersubmenuIndex === 1 && (
                                        <ul className='iner_submenu w-full pl-5'>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Asus
                                                </Link>
                                            </li>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Mac
                                                </Link>
                                            </li>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    Acer
                                                </Link>
                                            </li>
                                            <li className='list-none relative mb-1'>
                                                <Link to='/product-list' className='link w-full !text-left !justify-start !px-3 transition textt-[14px]'>
                                                    MSI
                                                </Link>
                                            </li>
                                        </ul>
                                    )
                                }

                            </li>

                        </ul>)
                        }
                    </li>
                </ul>
            </div>

        </Box>
    );
    return (
        <>
            <Drawer open={props.isOpenCategoryMenu} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </>
    )
}

export default CategoryMenu
