import React, { useContext } from 'react'
import { RiRefund2Fill } from "react-icons/ri";
import { FaShippingFast } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { FaGift } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { SiZalo } from "react-icons/si";

import { IoCloseSharp } from "react-icons/io5";
import { Drawer, IconButton } from '@mui/material';
import CartPanel from '../CartPanel';
import { MyContext } from '../../App';


const Footer = () => {

    const context = useContext(MyContext);
    const totalItems = 10;


    const currentYear = new Date().getFullYear();
    return (
        <>
            <footer className='py-4 bg-[#d9ddc7]'>
                <div className="container">
                    <div className="flex items-center justify-center gap-2 py-8 pb-8">
                        <div className="col flex items-center justify-center flex-col group w-[15%]">
                            <FaShippingFast className='text-[40px] transition-all 
                duration-300 group-hover:text-primary group-hover:translate-y-1'/>
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Free Ship
                            </h3>
                            <p className='text-[12px] font-[500]'>Cho Đơn Trên 2,000,000</p>
                        </div>

                        <div className="col flex items-center justify-center flex-col group w-[15%]">
                            <RiRefund2Fill className='text-[40px] transition-all 
                duration-300 group-hover:text-primary group-hover:translate-y-1'/>
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Hoàn Tiền
                            </h3>
                            <p className='text-[12px] font-[500]'>Đổi Trả Trong 7 Ngày</p>
                        </div>

                        <div className="col flex items-center justify-center flex-col group w-[15%]">
                            <GiWallet className='text-[40px] transition-all 
                duration-300 group-hover:text-primary group-hover:translate-y-1'/>
                            <h3 className='text-[16px] font-[600] mt-3'>
                                An Toàn Khi Giao Dịch
                            </h3>
                            <p className='text-[12px] font-[500]'>Đa Dạng Phương Thức Lựa Chọn</p>
                        </div>

                        <div className="col flex items-center justify-center flex-col group w-[15%]">
                            <FaGift className='text-[40px] transition-all 
                duration-300 group-hover:text-primary group-hover:translate-y-1'/>
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Quà Ưu Đãi Hấp Dẫn
                            </h3>
                            <p className='text-[12px] font-[500]'>Cho Đơn Hàng Đầu Tiên Của Bạn</p>
                        </div>

                        <div className="col flex items-center justify-center flex-col group w-[15%]">
                            <BiSupport className='text-[40px] transition-all 
                duration-300 group-hover:text-primary group-hover:translate-y-1'/>
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Hỗ Trợ 24/7
                            </h3>
                            <p className='text-[12px] font-[500]'>Liên Hệ Chúng Tôi Bất Cứ Khi Nào</p>
                        </div>
                    </div>

                    <div className='w-full border-b-2 border-gray-200'></div>

                    <div className="footer flex  py-8">
                        <div className="part-1 w-[25%] border-r-2 border-gray-200">
                            <h2 className="text-[18px] font-[600] mb-4">Contact us</h2>
                            <p className="text-[13px] font-[400] pb-4">Classyshop - Mega Super Store
                                <br />
                                597-Union Trade Centre France
                            </p>

                            <Link className="link text-[13px]" to="mailto:someone@example.com">2200006158@nttu.edu.vn</Link>
                            <span className="text-[22px] font-[500] block w-full mt-3 text-[#ff2d2d]">
                                (+84) 1234-567-890
                            </span>

                            <div className="flex items-center gap-2">
                                <IoChatboxEllipsesOutline className='text-[50px] text-[#ff2d2d]' />
                                <span className='text-[14px] font-[500]'>
                                    Liên Hệ Ngay Để Nhận <br />
                                    Hỗ Trợ Từ Chuyên Gia
                                </span>
                            </div>

                        </div>

                        <div className="part-2 w-[40%] flex pl-8 pr-8">
                            <div className="part-2_col1 w-[50%]">
                                <h2 className="text-[18px] font-[600] mb-4">Sản Phẩm</h2>
                                <ul className='list '>
                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2 duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Sản phẩm mới
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2 duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Sản phẩm bán chạy nhất
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2 duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Xu hướng
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Đại hạ giá
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Săn Phiếu giảm giá
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Ưu đãi mới nhất
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Nạp lần đầu
                                            </Link>
                                        </li>
                                    </div>

                                </ul>
                            </div>

                            <div className="part-2_col2 w-[50%]">
                                <h2 className="text-[18px] font-[600] mb-4">Công ty chúng tôi </h2>
                                <ul className='list '>
                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2 duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Vận chuyển
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2 duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Giấy phép
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2 duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Điều khoản và điều kiện
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Về chúng tôi
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                An toàn khi giao dịch
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Đặng nhập / Đăng ký
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="group">
                                        <li className='list-none text-[14px] w-full mb-2  duration-300  group-hover:translate-x-1'>
                                            <Link to='/' className='link transition-all'>
                                                Nạp lần đầu
                                            </Link>
                                        </li>
                                    </div>

                                </ul>
                            </div>
                        </div>
                        <div className="part-3 w-[35%] flex pl-8 flex-col pr-8 border-l-2 border-gray-200">
                            <h2 className="text-[18px] font-[600] mb-4">Nhập Email Để Nhận Thông Báo Sớm Nhất</h2>
                            <p>Nhập Email vào đây để nhận thông báo mới nhất của chúng tôi về
                                các ưu đãi cũng như các chương trình giảm giá.
                            </p>
                            <form action="" className='mt-5'>
                                <input type="text" className='w-full h-[45px] border outline-none pl-4 pr-4 rounded-md mb-4 focus:border-[#311c1c]' placeholder='Nhap Email cua vao day...' />
                                <Button className='org-btn hover:!bg-[#38362b] '>SUBMIT</Button>

                                <FormControlLabel control={<Checkbox />} label="I agree to the terms and conditions and the privacy policy" />
                            </form>
                        </div>
                    </div>
                </div>
            </footer >

            <div className='bottomStrip border-t border-[#000] py-3 bg-[#fffefe]'>
                <div className="container flex items-center justify-between">
                    <ul className='flex items-center gap-3'>
                        <li className='list-none'>
                            <Link to='/' target='_blank' className='w-[35px] h-[35px] rounded-full
                                border border-[#9a9a9a] flex items-center justify-center group hover:bg-primary transition-all'>
                                <FaFacebookF className='text-[15px] group-hover:text-white' />
                            </Link>
                        </li>
                        <li className='list-none'>
                            <Link to='/' target='_blank' className='w-[35px] h-[35px] rounded-full
                                border border-[#9a9a9a] flex items-center justify-center group hover:bg-primary transition-all'>
                                <FaXTwitter className='text-[15px] group-hover:text-white' />
                            </Link>
                        </li>
                        <li className='list-none'>
                            <Link to='/' target='_blank' className='w-[35px] h-[35px] rounded-full
                                border border-[#9a9a9a] flex items-center justify-center group hover:bg-primary transition-all'>
                                <FaYoutube className='text-[15px] group-hover:text-white' />
                            </Link>
                        </li>
                        <li className='list-none'>
                            <Link to='/' target='_blank' className='w-[35px] h-[35px] rounded-full
                                border border-[#9a9a9a] flex items-center justify-center group hover:bg-primary transition-all'>
                                <IoLogoInstagram className='text-[15px] group-hover:text-white' />
                            </Link>
                        </li>
                        <li className='list-none'>
                            <Link to='/' target='_blank' className='w-[35px] h-[35px] rounded-full
                                border border-[#9a9a9a] flex items-center justify-center group hover:bg-primary transition-all'>
                                <SiZalo className='text-[18px] group-hover:text-white' />
                            </Link>
                        </li>
                    </ul>

                    <p className="text-[13px] text-center mb-0">Copyright © {currentYear} Siêu Thị Mini. All rights reserved.</p>

                    <div className="flex items-center">
                        <img src="/payment/payment(2).png" alt="" className='w-[60px] h-[14px]]' />
                        <img src="/payment/payment(3).png" alt="" className='w-[60px] h-[14px]]' />
                        <img src="/payment/payment(4).png" alt="" className='w-[60px] h-[14px]]' />
                        <img src="/payment/payment(5).png" alt="" className='w-[60px] h-[14px]]' />
                    </div>
                </div>
            </div>

            <Drawer
                open={context.openCartPanel}
                onClose={context.toggleCartPanel(false)}
                anchor="right"
                className="cartPanel" // Class này vẫn cần để set width
            >
                {/* --- HEADER CỦA DRAWER --- */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h4 className='text-xl font-semibold text-gray-800'>Giỏ hàng ({totalItems})</h4>
                    <IconButton onClick={context.toggleCartPanel(false)}>
                        <IoCloseSharp className='text-xl text-gray-600 hover:text-black' />
                    </IconButton>
                </div>

                {/* --- NỘI DUNG CART PANEL --- */}
                <CartPanel />
            </Drawer>
        </>
    )
}

export default Footer;
