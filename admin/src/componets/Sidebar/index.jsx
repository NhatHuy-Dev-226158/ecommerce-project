import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import {
    RxDashboard,
    RxImage,
} from "react-icons/rx";
import {
    FiUsers,
} from "react-icons/fi";
import { FaShopify } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from 'react-collapse';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';

/**
 * Component Sidebar: Thanh điều hướng chính của trang quản trị.
 * - Hiển thị các liên kết đến các trang chức năng.
 * - Có các menu con có thể đóng/mở.
 * - Trạng thái đóng/mở được quản lý bởi Context.
 */
const Sidebar = () => {
    // State để quản lý menu con nào đang được mở (null: không có menu nào mở)
    const [OpenSubMenu, setOpenSubMenu] = useState(null);

    // Lấy state và hàm từ Context chung
    const context = useContext(MyContext);
    const { isSidebarOpen, setIsSidebarOpen } = context;
    const navigate = useNavigate();

    /**
     * Xử lý việc đóng/mở các menu con.
     * @param {number} index - Chỉ số của menu con cần được tương tác.
     */
    const isOpenSubMenu = (index) => {
        // Nếu menu đã mở, đóng nó lại. Ngược lại, mở menu được chọn.
        if (OpenSubMenu === index) {
            setOpenSubMenu(null);
        } else {
            setOpenSubMenu(index);
        }
    };

    /**
     * Xử lý logic đăng xuất người dùng.
     * - Gọi API để logout.
     * - Dọn dẹp localStorage và Context state.
     * - Chuyển hướng về trang đăng nhập.
     */
    const handleLogout = async () => {
        try {
            const res = await postData('/api/user/logout', {});
            if (res.success) {
                context.openAlerBox("success", "Đăng xuất thành công!");
            } else {
                // Ném lỗi nếu server trả về thất bại
                throw new Error(res.message || "Đăng xuất thất bại trên server.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            context.openAlerBox("error", "Có lỗi xảy ra, đã đăng xuất cục bộ.");
        } finally {
            // Luôn thực hiện dọn dẹp dù API thành công hay thất bại
            localStorage.removeItem('accesstoken');
            localStorage.removeItem('refreshtoken');
            context.setIslogin(false);
            context.setUserData(null);
            navigate('/login');
        }
    };

    return (
        <>
            {/* Lớp phủ (overlay) nền mờ, chỉ hiển thị trên mobile khi sidebar mở */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)} // Click vào overlay sẽ đóng sidebar
            ></div>

            {/* Thẻ <aside> chứa nội dung chính của Sidebar */}
            {/* Class `translate-x-0` (hiện) và `-translate-x-full` (ẩn) được điều khiển bởi state `isSidebarOpen` */}
            <aside className={`sidebar fixed top-0 left-0 bg-slate-50 transition-transform duration-300 ease-in-out h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4 w-72 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Phần Logo */}
                <div className="py-2 w-full flex items-center justify-center">
                    <Link to='/'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Dash_%28cryptocurrency%29_logo.svg/1024px-Dash_%28cryptocurrency%29_logo.svg.png" className='w-[160px]' alt="Logo" />
                    </Link>
                </div>

                {/* Danh sách các mục menu */}
                <ul className='mt-4 overflow-y-auto h-[calc(100%-80px)]'>
                    {/* Mục menu đơn */}
                    <li>
                        <Link to='/'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <RxDashboard className='text-[20px] group-hover:text-indigo-600' />
                                <span>Tổng Quan</span>
                            </Button>
                        </Link>
                    </li>

                    {/* Mục menu có menu con (Collapsible) */}
                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(1)}>
                            <RxImage className='text-[20px] group-hover:text-indigo-600' />
                            <span>Home slides</span>
                            <span className='ml-auto flex items-center justify-end'>
                                <FaAngleDown className={`transition-all ${OpenSubMenu === 1 ? 'rotate-180' : ''}`} />
                            </span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 1}>
                            <ul className='w-full'>
                                <li>
                                    <Link to='/banner-list'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Home banner list
                                        </Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/add-banner'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Add home banner slide
                                        </Button>
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>

                    {/* Các mục menu khác tương tự */}
                    <li>
                        <Link to='/users'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <FiUsers className='text-[20px] group-hover:text-indigo-600' />
                                <span>Người dùng</span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={() => isOpenSubMenu(2)}>
                            <FaShopify className='text-[20px] group-hover:text-indigo-600' />
                            <span>Sản phẩm</span>
                            <span className='ml-auto flex items-center justify-end'>
                                <FaAngleDown className={`transition-all ${OpenSubMenu === 2 ? 'rotate-180' : ''}`} />
                            </span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 2}>
                            <ul className='w-full'>
                                <li>
                                    <Link to='/product-list'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Danh sách sản phẩm
                                        </Button>
                                    </Link>
                                </li>
                                <li>
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
                            <span>Danh mục</span>
                            <span className='ml-auto flex items-center justify-end'>
                                <FaAngleDown className={`transition-all ${OpenSubMenu === 3 ? 'rotate-180' : ''}`} />
                            </span>
                        </Button>
                        <Collapse isOpened={OpenSubMenu === 3}>
                            <ul className='w-full'>
                                <li>
                                    <Link to='/category-list'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Danh sách danh mục
                                        </Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/add-category'>
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[450] !pl-8 flex gap-2 group hover:!bg-[#ebf2fe]'>
                                            <span className='block w-[5px] h-[5px] rounded-full bg-[#919191] group-hover:bg-indigo-600'></span>
                                            Thêm danh mục
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
                    <li>
                        <Link to='/admin/blogs'>
                            <Button className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'>
                                <IoNewspaperOutline className='text-[20px] group-hover:text-indigo-600' />
                                <span>Quản lý Blog</span>
                            </Button>
                        </Link>
                    </li>

                    {/* Phần cuối, chứa nút Đăng xuất */}
                    <div className='py-2'>
                        <hr />
                    </div>
                    <li>
                        <Button
                            className='w-full !capitalize !items-center !justify-start gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#ebf2fe] group'
                            onClick={handleLogout}
                        >
                            <LuLogOut className='text-[20px] group-hover:text-indigo-600' />
                            <span>Đăng xuất</span>
                        </Button>
                    </li>
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;