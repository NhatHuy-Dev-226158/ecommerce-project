import React, { useContext, useState } from 'react';
import { Button, Badge, Divider, IconButton, Menu, MenuItem, Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { FiLogIn } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0, top: 3, border: `2px solid ${theme.palette.background.paper}`,
        padding: '0px 3px', background: 'red'
    },
}));

const Header = () => {
    const [anchorAccount, setAnchorAccount] = useState(null);
    const openAccount = Boolean(anchorAccount);
    const context = useContext(MyContext);
    const navigate = useNavigate();

    const { notifications, setNotifications } = context;
    const [anchorElNotif, setAnchorElNotif] = useState(null);
    const isNotifMenuOpen = Boolean(anchorElNotif);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleClickAccount = (event) => setAnchorAccount(event.currentTarget);
    const handleCloseAccount = () => setAnchorAccount(null);

    const handleNotificationClick = (event) => setAnchorElNotif(event.currentTarget);
    const handleNotificationClose = () => {
        setAnchorElNotif(null);
        if (unreadCount > 0) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    };

    const handleLogout = async () => {
        handleCloseAccount();
        try {
            const res = await postData('/api/user/logout', {});
            if (res.success) {
                context.openAlerBox("success", res.message || "Đăng xuất thành công!");
            } else {
                throw new Error(res.message || "Đăng xuất thất bại trên server.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            context.openAlerBox("error", "Có lỗi xảy ra, đã đăng xuất cục bộ.");
        } finally {
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("refreshtoken");
            context.setIslogin(false);
            context.setUserData(null);
            navigate('/login');
        }
    };

    return (
        <header className=" w-full h-auto py-1.5 pr-7 bg-[#fff] shadow-md flex items-center justify-between sticky top-0 z-40">
            <div className="part-1">
                <Button className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#1f1f1f]'
                    onClick={() => context.setIsSidebarOpen(!context.isSidebarOpen)}>
                    {context.isSidebarOpen ? <AiOutlineMenuUnfold className='text-[25px]' /> : <AiOutlineMenuFold className='text-[25px]' />}
                </Button>
            </div>

            <div className="part-2 !w-[40%] flex items-center justify-end gap-5">
                <IconButton aria-label="notifications" onClick={handleNotificationClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <IoMdNotificationsOutline className='text-[25px]' />
                    </Badge>
                </IconButton>

                {context.isLogin === true ? (
                    <div className="relative flex items-center justify-center">
                        <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                            <img src={context?.userData?.avatar || "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"} alt="User Avatar" onClick={handleClickAccount} className='!w-full !h-full !rounded-full object-cover' />
                        </div>
                        <Menu
                            anchorEl={anchorAccount}
                            id="account-menu"
                            open={openAccount}
                            onClose={handleCloseAccount}
                            onClick={handleCloseAccount}
                            slotProps={{ paper: { elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, }, '&::before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, }, }, }, }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleCloseAccount}>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                                        <img src={context?.userData?.avatar || "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"} alt="User Avatar" className='!w-full !h-full !rounded-full object-cover' />
                                    </div>
                                    <div className="info">
                                        <h3 className='text-[15px] font-[500] leading-5'>{context?.userData?.name}</h3>
                                        <p className='text-[13px] font-[400] opacity-70'>{context?.userData?.email}</p>
                                        <p className='text-[12px] font-[400] opacity-70'>Xin chào bạn là CEO của cửa hàng</p>
                                    </div>
                                </div>
                            </MenuItem>
                            <Divider />
                            <Link to='/profile'>
                                <MenuItem onClick={handleCloseAccount} className='flex items-center justify-center gap-3'>
                                    <FaUserTie className='text-[18px]' />
                                    <span className='text-[15px]'>Profile</span>
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={handleLogout} className='flex items-center justify-center gap-3'>
                                <GrLogout className='text-[18px]' />
                                <span className='text-[15px]'>Logout</span>
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Link to='/login'>
                        <button type="button" className="flex items-center justify-center gap-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-full text-base px-5 py-2 text-center transition-all duration-200">
                            <FiLogIn className='text-[17px]' />
                            Đăng nhập
                        </button>
                    </Link>
                )}
            </div>

            {/* Menu Thông báo */}
            <Menu
                anchorEl={anchorElNotif}
                open={isNotifMenuOpen}
                onClose={handleNotificationClose}
                PaperProps={{ sx: { width: 380, maxHeight: 420, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Thông báo</Typography>
                    {unreadCount > 0 && <Chip label={`${unreadCount} mới`} color="primary" size="small" />}
                </Box>
                <Divider />
                {notifications.length > 0 ? (
                    notifications.slice(0, 7).map(notif => (
                        <MenuItem
                            key={notif.id}
                            component={Link}
                            to={`/admin/orders/${notif.orderId}`}
                            onClick={handleNotificationClose}
                            sx={{
                                display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5,
                                whiteSpace: 'normal',
                                bgcolor: !notif.isRead ? 'action.hover' : 'transparent'
                            }}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" fontWeight={!notif.isRead ? 600 : 400}>
                                    {notif.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                                </Typography>
                            </Box>
                            {!notif.isRead && <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', flexShrink: 0, mt: 0.5 }} />}
                        </MenuItem>
                    ))
                ) : (
                    <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">Không có thông báo mới.</Typography>
                )}
            </Menu>
        </header>
    )
}

export default Header;