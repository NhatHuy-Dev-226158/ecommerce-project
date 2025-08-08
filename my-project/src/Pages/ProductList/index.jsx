import React, { useState } from 'react'
import SideBar from '../../componets/Sidebar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../componets/ProductItem';
import ViewProductItemList from '../../componets/ViewProductItemList';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TfiMenuAlt } from "react-icons/tfi";
import { IoGrid } from "react-icons/io5";
import { MdOutlineTune } from "react-icons/md";
import Pagination from '@mui/material/Pagination';

const ProductList = () => {
    const [ItemView, setItemView] = useState('grid');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <section className='py-5 pb-0'>
            <div className="container">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/" className='link transition'>
                        HOME
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/"
                        className='link transition'
                    >
                        Fashion
                    </Link>
                </Breadcrumbs>
            </div>
            <div className="bg-white p-2 mt-4">
                <div className="container flex gap-3">
                    <div className="sidebarWrapper w-[20%] h-full bg-white">
                        <SideBar></SideBar>
                    </div>

                    <div className="right-Content w-full py-3">
                        <div className="bg-[#efefef] p-2 w-full mb-4 rounded-md flex items-center justify-between">
                            <div className="col1 flex items-center itemViewActive">
                                <Button className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]
                                ${ItemView === "list" && 'active'}`}
                                    onClick={() => setItemView("list")}>
                                    <TfiMenuAlt className='text-[#282828]' />
                                </Button>
                                <Button className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]
                                ${ItemView === "grid" && 'active'}`}
                                    onClick={() => setItemView("grid")}>
                                    <IoGrid className='text-[#282828]' />
                                </Button>
                                <span className='text-[14px] font-[500] pl-3 text-[#b0b0b0]'>
                                    Có tất cả 100 sản phẩm
                                </span>
                            </div>
                            <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">

                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    className='!w-[130px] !h-[30px] !mr- !min-w-[40px] !rounded-full !text-[#000] !bg-[#fffafa] flex items-center justify-center !border-2 !border-[#000]'
                                >
                                    <span className='text-[14px] font-[500] text-[#000] flex items-center gap-4 !capitalize'>
                                        Bộ lọc<MdOutlineTune className='text-[18px] ' />
                                    </span>

                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Sales, highest to lowest</MenuItem>
                                    <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Name, A to Z</MenuItem>
                                    <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Name, z to A</MenuItem>
                                    <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Price, thấp tới cao</MenuItem>
                                    <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Price, cao tới thấp</MenuItem>
                                </Menu>
                            </div>

                        </div>

                        <div className={`${ItemView === 'grid' ? 'grid grid-cols-5 md:grid-cols-5 gap-2 ' : 'grid grid-cols-1 md:grid-cols-1 gap-4'}`}>
                            {
                                ItemView === 'grid' ?
                                    (<>
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                        <ProductItem />
                                    </>
                                    ) : (
                                        <>
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                            <ViewProductItemList />
                                        </>
                                    )}
                        </div>
                        <div className="flex items-center justify-center mt-10">
                            <Pagination count={10} showFirstButton showLastButton variant="outlined" shape="rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductList;
