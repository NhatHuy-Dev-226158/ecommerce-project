import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IoCloseCircleOutline } from "react-icons/io5";

const menuData = [
    {
        id: 'cat-1',
        label: 'Thực Phẩm Tươi Sống',
        children: [
            { id: 'sub-1-1', label: 'Rau, Củ, Quả', path: '/category/rau-cu-qua' },
            { id: 'sub-1-2', label: 'Thịt, Hải Sản', path: '/category/thit-hai-san' },
            { id: 'sub-1-4', label: 'Thực Phẩm Chế Biến Sẵn', path: '/category/che-bien-san' },
        ]
    },
    {
        id: 'cat-2',
        label: 'Thực Phẩm Khô & Đóng Hộp',
        children: [
            { id: 'sub-2-1', label: 'Gạo, Mì & Nông Sản Khô', path: '/category/gao-mi' },
            { id: 'sub-2-2', label: 'Gia Vị & Nước Chấm', path: '/category/gia-vi' },
            { id: 'sub-2-3', label: 'Thực Phẩm Đóng Hộp', path: '/category/do-hop' },
        ]
    },
    {
        id: 'cat-3',
        label: 'Đồ Uống & Giải Khát',
        path: '/category/do-uong'
    },
    {
        id: 'cat-4',
        label: 'Bánh Kẹo & Đồ Ăn Vặt',
        path: '/category/an-vat'
    },
    {
        id: 'cat-5',
        label: 'Hóa Mỹ Phẩm & Chăm Sóc Cá Nhân',
        path: '/category/hoa-my-pham'
    },
    {
        id: 'cat-6',
        label: 'Mẹ & Bé',
        path: '/category/me-be'
    }
];

const RecursiveMenuItem = ({ item, level = 0 }) => {
    const [open, setOpen] = useState(false);
    const isParent = item.children && item.children.length > 0;

    const handleClick = () => {
        setOpen(!open);
    };

    const Component = isParent ? 'div' : Link;
    const componentProps = isParent ? {} : { to: item.path || '#' };

    return (
        <>
            <ListItemButton
                component={Component}
                {...componentProps}
                onClick={isParent ? handleClick : undefined}
                sx={{ pl: (level + 1) * 2, py: 1.2 }}
            >
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }}
                />
                {isParent ? (open ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>

            {isParent && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map(child => (
                            <RecursiveMenuItem key={child.id} item={child} level={level + 1} />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

// --- COMPONENT CHÍNH ---
const CategoryMenu = ({ isOpenCategoryMenu, setIsOpenCategoryMenu }) => {

    const toggleDrawer = (newOpen) => () => {
        setIsOpenCategoryMenu(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 300 }} role="presentation">
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                p: '12px 16px', borderBottom: '1px solid #eee'
            }}>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Tất Cả Danh Mục</span>
                <IoCloseCircleOutline
                    onClick={toggleDrawer(false)}
                    style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#888' }}
                />
            </Box>

            <Divider />
            <List component="nav" sx={{ p: 0 }}>
                {menuData.map(item => (
                    <RecursiveMenuItem key={item.id} item={item} level={0} />
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer anchor="left" open={isOpenCategoryMenu} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
};

export default CategoryMenu;