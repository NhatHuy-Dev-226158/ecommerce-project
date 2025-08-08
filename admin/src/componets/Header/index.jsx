import React, { useContext, useState } from 'react'
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import Button from '@mui/material/Button';
import { Badge, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { MyContext } from '../../App';
import { NavLink } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 3,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0px 3px',
        background: 'red'
    },
}));

const Header = () => {
    const [anchorAccount, setAnchorAccount] = useState(null);
    const openAccount = Boolean(anchorAccount);
    const handleClickAccount = (event) => {
        setAnchorAccount(event.currentTarget);
    };
    const handleCloseAccount = () => {
        setAnchorAccount(null);
    };

    const context = useContext(MyContext);

    return (
        <header className=" w-full h-auto py-1.5 pr-7 bg-[#fff] shadow-md flex items-center justify-between sticky top-0 z-40">
            <div className="part-1">
                <Button className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#1f1f1f]'
                    onClick={() => context.setIsSidebarOpen(!context.isSidebarOpen)}>
                    {
                        context.isSidebarOpen === true ?
                            <AiOutlineMenuUnfold className='text-[25px] text-[#1f1f1f]' />
                            :
                            <AiOutlineMenuFold className='text-[25px] text-[#1f1f1f]' />

                    }
                </Button>
            </div>


            <div className="part-2 !w-[40%] flex items-center justify-end gap-5">
                <IconButton aria-label="cart">
                    <StyledBadge badgeContent={4} color="secondary">
                        <IoMdNotificationsOutline className='text-[25px] text-[#1f1f1f]' />
                    </StyledBadge>
                </IconButton>
                {
                    context.isLogin === true ?
                        (
                            <div className="relative flex items-center justify-center">
                                <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                                    <img
                                        src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
                                        alt="avatar"
                                        onClick={handleClickAccount} />
                                </div>
                                <Menu
                                    anchorEl={anchorAccount}
                                    id="account-menu"
                                    open={openAccount}
                                    onClose={handleCloseAccount}
                                    onClick={handleCloseAccount}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleCloseAccount}>
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                                                <img
                                                    src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
                                                    alt="avatar"
                                                />
                                            </div>

                                            <div className="info">
                                                <h3 className='text-[15px] font-[500] leading-5'>Nguyen Nhat Huy</h3>
                                                <p className='text-[13px] font-[400] opacity-70'>nhathuy@gmail.com</p>
                                                <p className='text-[12px] font-[400] opacity-70'>Xin chào bạn là CEO của cửa hàng</p>
                                            </div>
                                        </div>

                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleCloseAccount} className='flex items-center justify-center gap-3'>
                                        <FaUserTie className='text-[18px]' />
                                        <span className='text-[15px]'>Profile</span>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseAccount} className='flex items-center justify-center gap-3'>
                                        <GrLogout className='text-[18px]' />
                                        <span className='text-[15px]'>Logout</span>
                                    </MenuItem>

                                </Menu>
                            </div>
                        ) :
                        (
                            <NavLink
                                to='/login'>
                                <button type="button" className="flex items-center justify-center gap-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-full text-base px-5 py-2 text-center transition-all duration-200">
                                    <FiLogIn className='text-[17px]' />
                                    Đăng nhập
                                </button>
                            </NavLink>
                        )
                }
            </div>
        </header>
    )
}

export default Header;
