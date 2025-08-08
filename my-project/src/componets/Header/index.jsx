import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng

// COMPONENT CON
import Search from '../Search';
import Navigation from './Navigation';

// CONTEXT
import { MyContext } from '../../App';

// THƯ VIỆN GIAO DIỆN (MATERIAL-UI)
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';

// THƯ VIỆN ICON (REACT-ICONS)
import { FaUserCheck } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { RiAccountCircleLine, RiDashboardLine } from "react-icons/ri";
import { LuHeartOff } from 'react-icons/lu';
import { fetchDataFromApi } from '../../utils/api';

// Tùy chỉnh component Badge của Material-UI
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 5,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const Header = () => {
    // Lấy context và hook navigate
    const context = useContext(MyContext);
    const navigate = useNavigate();

    // State và các hàm xử lý cho Menu dropdown
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Hàm xử lý khi người dùng nhấn nút Logout
    const handleLogout = () => {
        handleClose(); // Đóng menu trước

        setAnchorEl(null)

        fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accesstoken')}`, { withCredentials: true }).then((res) => {
            console.log(res);
            if (res?.error == false) {
                context.setIsLogin(false);
                localStorage.removeItem("accesstoken")
                localStorage.removeItem("refreshtoken")
            }

        });
    };

    return (
        <header className='bg-white'>

            {/* Phần thanh thông báo phía trên */}
            <div className="top-strip py-2 border-t-[1.5px] border-gray-200 border-b-[1px]">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className="col1 w-[50%]">
                            <p className="text-[12px] font-[500]">Get up to 50% off new season styles, limited time only</p>
                        </div>
                        <div className="col2 flex items-center justify-end">
                            <ul className='flex items-center gap-3'>
                                <li className='list-none'>
                                    <Link to="/help-center" className='text-[13px] font-[500] link transition'>Help Center</Link>
                                </li>
                                <li className='list-none'>
                                    <Link to="/order-tracking" className='text-[13px] font-[500] link transition'>Order Tracking</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần header chính */}
            <div className="header py-5 border-b-[1.5px] border-gray-200">
                <div className="container flex items-center !justify-between">
                    <div className="col1 w-[25%]">
                        <Link to={"/"}> <img src="/logo.jpg" alt="logo" /></Link>
                    </div>
                    <div className="col2 w-[45%]">
                        <Search />
                    </div>
                    <div className="col3 w-[30%] flex items-center pl-20">
                        <ul className='flex items-center justify-end gap-3 w-full'>
                            {
                                context.isLogin === false ?
                                    // Khi người dùng chưa đăng nhập
                                    (<li className='list-none'>
                                        <Link to="/login" className='text-[15px] font-[500] link transition'>
                                            Login
                                        </Link> | &nbsp;
                                        <Link to="/register" className='text-[15px] font-[500] link transition'>
                                            Register
                                        </Link>
                                    </li>)
                                    :
                                    // Khi người dùng đã đăng nhập
                                    (
                                        <>
                                            {/* NÚT KÍCH HOẠT MENU */}
                                            <Tooltip title={context?.userData?.email} placement="bottom-end">
                                                <Button
                                                    className='!min-w-[250px] !text-[#000] my-Account !flex !items-center !justify-center !gap-3 cursor-pointer !rounded-full !p-1'
                                                    onClick={handleClick}
                                                    aria-controls={open ? 'account-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                >
                                                    <div className='!flex !items-center !justify-center !w-[40px] !h-[40px] !rounded-full !bg-[#f1f1f1] flex-shrink-0'>
                                                        {

                                                            context?.userData?.avatar ? (

                                                                <img
                                                                    src={context.userData.avatar}
                                                                    alt="User Avatar"
                                                                    className='!w-full !h-full !rounded-full object-cover'
                                                                />
                                                            ) : (
                                                                <FaUserCheck className='text-[20px] text-[rgba(0,0,0,0.7)]' />
                                                            )
                                                        }
                                                    </div>
                                                    <div className="info !flex !flex-col !justify-center !text-left !pr-3 overflow-hidden">
                                                        <h4 className='leading-3 text-[14px] text-[rgba(0,0,0,0.8)] font-semibold mb-0 capitalize'>
                                                            {context?.userData?.name}
                                                        </h4>
                                                        <span className='text-[13px] text-[rgba(0,0,0,0.6)] font-[400] normal-case truncate'>
                                                            {context?.userData?.email}
                                                        </span>
                                                    </div>
                                                </Button>
                                            </Tooltip>


                                            {/* MENU DROPDOWN ĐÃ ĐƯỢC TÙY CHỈNH */}
                                            <Menu
                                                anchorEl={anchorEl}
                                                id="account-menu"
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    elevation: 0,
                                                    sx: {
                                                        overflow: 'visible',
                                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                                        mt: 1.5,
                                                        minWidth: 220,
                                                        borderRadius: '10px',
                                                        '& .MuiMenuItem-root': {
                                                            padding: '10px 16px',
                                                            fontSize: '15px',
                                                        },
                                                        '& .MuiListItemIcon-root': {
                                                            minWidth: 0,
                                                            marginRight: '14px',
                                                            fontSize: '22px',
                                                            color: '#5f6368',
                                                        },
                                                        '&::before': {
                                                            content: '""', display: 'block', position: 'absolute',
                                                            top: 0, right: 14, width: 10, height: 10,
                                                            bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                                                        },
                                                    },
                                                }}
                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account'); }}>
                                                    <ListItemIcon>
                                                        <RiDashboardLine />
                                                    </ListItemIcon>
                                                    Tổng quan
                                                </MenuItem>
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=profile'); }}>
                                                    <ListItemIcon>
                                                        <CgProfile />
                                                    </ListItemIcon>
                                                    Thông tin cá nhân
                                                </MenuItem>

                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=wishlist'); }}>
                                                    <ListItemIcon>
                                                        <RiAccountCircleLine />
                                                    </ListItemIcon>
                                                    Sản phẩm yêu thích
                                                </MenuItem>
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=orders'); }}>
                                                    <ListItemIcon>
                                                        <RiAccountCircleLine />
                                                    </ListItemIcon>
                                                    Đơn hàng
                                                </MenuItem>

                                                <Divider sx={{ my: 0.5 }} />

                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=settings'); }}>
                                                    <ListItemIcon>
                                                        <IoSettingsOutline />
                                                    </ListItemIcon>
                                                    Cài đặt
                                                </MenuItem>

                                                <MenuItem onClick={handleLogout}>
                                                    <ListItemIcon>
                                                        <MdLogout />
                                                    </ListItemIcon>
                                                    Đăng xuất
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    )
                            }
                            {/* Các icon Wishlist và Cart */}
                            <li>
                                <Link to='/my-account?tab=wishlist'>
                                    <Tooltip title="Wishlist">
                                        <IconButton aria-label="wishlist">
                                            <StyledBadge badgeContent={4} color="secondary">
                                                <LuHeartOff className='text-gray-600' />
                                            </StyledBadge>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li>
                                <Tooltip title="Cart">
                                    <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
                                        <StyledBadge badgeContent={4} color="secondary">
                                            <AiOutlineShoppingCart className='text-gray-600' />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Navigation />
        </header>
    )
}

export default Header;