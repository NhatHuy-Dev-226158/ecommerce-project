import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../Search';
import Navigation from './Navigation';
import { MyContext } from '../../App';
// THƯ VIỆN GIAO DIỆN (MATERIAL-UI)
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
// THƯ VIỆN ICON (REACT-ICONS)
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdLogout, MdMenu } from "react-icons/md";
import { RiAccountCircleLine, RiDashboardLine } from "react-icons/ri";
import { LuHeartOff } from 'react-icons/lu';
import CategoryMenu from './Navigation/CategoryMenu';
// IMPORT COMPONENT MENU DANH MỤC

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 5,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const Header = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // --- LOGIC MỚI CHO RESPONSIVE ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // true nếu màn hình < 900px

    // --- STATE QUẢN LÝ MENU DANH MỤC (DI CHUYỂN TỪ NAVIGATION) ---
    const [isOpenCategoryMenu, setIsOpenCategoryMenu] = useState(false);

    const wishlistCount = context.wishlist.length;
    const cartCount = context.cart.reduce((total, item) => total + item.quantity, 0);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        await context.logout();
        navigate('/login');
    };

    return (
        <header className='bg-white shadow-sm sticky top-0 z-50'>
            {/* Top strip (ẩn trên di động để gọn gàng hơn) */}
            {!isMobile && (
                <div className="top-strip py-2 border-t-[1.5px] border-gray-200 border-b-[1px]">
                    <div className="container">
                        <div className="flex items-center justify-between">
                            <div className="col1 w-[50%]">
                                <p className="text-[12px] font-[500]">Get up to 50% off new season styles, limited time only</p>
                            </div>
                            <div className="col2 flex items-center justify-end">
                                <ul className='flex items-center gap-3'>
                                    <li className='list-none'><Link to="/help-center" className='text-[13px] font-[500] link transition'>Help Center</Link></li>
                                    <li className='list-none'><Link to="/order-tracking" className='text-[13px] font-[500] link transition'>Order Tracking</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Phần header chính */}
            <div className="header py-3 md:py-4 border-b-[1.5px] border-gray-200">
                <div className="container flex items-center justify-between gap-4">
                    {/* --- CỘT TRÁI: ICON MENU VÀ LOGO --- */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isMobile && (
                            <IconButton onClick={() => setIsOpenCategoryMenu(true)}>
                                <MdMenu className="text-2xl" />
                            </IconButton>
                        )}
                        <Link to={"/"}>
                            <img src="/logo.jpg" alt="logo" className="max-w-[140px] md:max-w-full" />
                        </Link>
                    </div>

                    {/* --- CỘT GIỮA: THANH TÌM KIẾM (CHỈ HIỂN THỊ TRÊN DESKTOP) --- */}
                    {!isMobile && (
                        <div className="w-full max-w-lg">
                            <Search />
                        </div>
                    )}

                    {/* --- CỘT PHẢI: ICON VÀ MENU NGƯỜI DÙNG --- */}
                    <div className="flex-shrink-0">
                        <ul className='flex items-center justify-end gap-1 md:gap-3 w-full'>
                            {
                                context.isLogin === false ?
                                    // Khi người dùng chưa đăng nhập
                                    (<li className='list-none hidden md:block'>
                                        <Link to="/login" className='text-[15px] font-[500] link transition'>Login</Link> | &nbsp;
                                        <Link to="/register" className='text-[15px] font-[500] link transition'>Register</Link>
                                    </li>)
                                    :
                                    // Khi người dùng đã đăng nhập
                                    (
                                        <>
                                            <Tooltip title={context?.userData?.email} placement="bottom-end">
                                                <Button
                                                    className='!min-w-0 md:!min-w-fit !text-[#000] my-Account !flex !items-center !justify-center !gap-3 cursor-pointer !rounded-full !p-1'
                                                    onClick={handleClick}
                                                    aria-controls={open ? 'account-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                >
                                                    <div className='!flex !items-center !justify-center !w-[40px] !h-[40px] !rounded-full !bg-[#f1f1f1] flex-shrink-0'>
                                                        {context?.userData?.avatar ? (
                                                            <img src={context.userData.avatar} alt="User Avatar" className='!w-full !h-full !rounded-full object-cover' />
                                                        ) : (
                                                            <img src='/user.png' alt='user avatar' className="w-full h-full rounded-full object-cover" />
                                                        )}
                                                    </div>
                                                    {!isMobile && (
                                                        <div className="info !flex !flex-col !justify-center !text-left !pr-3 overflow-hidden">
                                                            <h4 className='leading-3 text-[14px] text-[rgba(0,0,0,0.8)] font-semibold mb-0 capitalize'>{context?.userData?.name}</h4>
                                                            <span className='text-[13px] text-[rgba(0,0,0,0.6)] font-[400] normal-case truncate'>{context?.userData?.email}</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </Tooltip>

                                            <Menu
                                                anchorEl={anchorEl}
                                                id="account-menu"
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    elevation: 0,
                                                    sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))', mt: 1.5, minWidth: 220, borderRadius: '10px', '& .MuiMenuItem-root': { padding: '10px 16px', fontSize: '15px' }, '& .MuiListItemIcon-root': { minWidth: 0, marginRight: '14px', fontSize: '22px', color: '#5f6368' }, '&::before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 } },
                                                }}
                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account'); }}><ListItemIcon><RiDashboardLine /></ListItemIcon>Tổng quan</MenuItem>
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=profile'); }}><ListItemIcon><CgProfile /></ListItemIcon>Thông tin cá nhân</MenuItem>
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=wishlist'); }}><ListItemIcon><LuHeartOff /></ListItemIcon>Sản phẩm yêu thích</MenuItem>
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=orders'); }}><ListItemIcon><RiAccountCircleLine /></ListItemIcon>Đơn hàng</MenuItem>
                                                <Divider sx={{ my: 0.5 }} />
                                                <MenuItem onClick={() => { handleClose(); navigate('/my-account?tab=settings'); }}><ListItemIcon><IoSettingsOutline /></ListItemIcon>Cài đặt</MenuItem>
                                                <MenuItem onClick={handleLogout}><ListItemIcon><MdLogout /></ListItemIcon>Đăng xuất</MenuItem>
                                            </Menu>
                                        </>
                                    )
                            }
                            {/* Wishlist và Cart */}
                            <li className='list-none'>
                                <Link to='/my-account?tab=wishlist'>
                                    <Tooltip title="Wishlist">
                                        <IconButton aria-label="wishlist">
                                            <StyledBadge badgeContent={wishlistCount} color="error"><LuHeartOff className='text-gray-600' /></StyledBadge>
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </li>
                            <li className='list-none'>
                                <Tooltip title="Cart">
                                    <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
                                        <StyledBadge badgeContent={cartCount} color="primary"><AiOutlineShoppingCart className='text-gray-600' /></StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {isMobile && (
                <div className="container py-2 border-b-[1.5px] border-gray-200">
                    <Search />
                </div>
            )}

            <Navigation />

            <CategoryMenu
                isOpenCategoryMenu={isOpenCategoryMenu}
                setIsOpenCategoryMenu={setIsOpenCategoryMenu}
            />
        </header>
    )
}

export default Header;