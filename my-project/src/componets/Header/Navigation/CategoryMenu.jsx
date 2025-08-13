import { React, useEffect, useContext, useState } from 'react';
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
import { CircularProgress } from '@mui/material';
import { MyContext } from '../../../App';
import { fetchDataFromApi } from '../../../utils/api';

// === COMPONENT CON ĐỆ QUY (ĐÃ CẬP NHẬT) ===
// Component này sẽ nhận dữ liệu từ API
const RecursiveMenuItem = ({ item, level = 0, onClose }) => {
    const [open, setOpen] = useState(false);
    const isParent = item.children && item.children.length > 0;

    const handleClick = () => {
        setOpen(!open);
    };

    // Component sẽ là Link nếu có đường dẫn, ngược lại là div
    const Component = isParent ? 'div' : Link;

    // Tạo slug từ tên danh mục để làm URL
    // Ví dụ: "Thịt, Hải Sản" -> "/category/thit-hai-san"
    const slug = item.name.toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng gạch nối
        .replace(/&/g, 'va'); // Xử lý ký tự '&'

    const componentProps = isParent ? {} : {
        to: `/category/${slug}`,
        onClick: onClose // Khi nhấn vào link, đóng menu
    };

    return (
        <>
            <ListItemButton
                component={Component}
                {...componentProps}
                onClick={isParent ? handleClick : undefined}
                sx={{ pl: (level + 1) * 2, py: 1.2 }}
            >
                <ListItemText
                    primary={item.name} // Sử dụng `item.name` từ API
                    primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }}
                />
                {isParent ? (open ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>

            {isParent && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map(child => (
                            <RecursiveMenuItem key={child._id} item={child} level={level + 1} onClose={onClose} />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};


// --- COMPONENT CHÍNH ---
const CategoryMenu = ({ isOpenCategoryMenu, setIsOpenCategoryMenu }) => {
    const context = useContext(MyContext);
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            const result = await fetchDataFromApi('/api/category/');
            if (result.success) {
                const filterPublished = (categories) => {
                    return categories
                        .filter(cat => cat.isPublished !== false)
                        .map(cat => {
                            if (cat.children && cat.children.length > 0) {
                                return { ...cat, children: filterPublished(cat.children) };
                            }
                            return cat;
                        });
                };

                const publishedCategories = filterPublished(result.data);
                setCategoryData(publishedCategories);

            } else {
                context.openAlerBox("error", "Không thể tải danh mục sản phẩm.");
            }
            setIsLoading(false);
        };

        fetchCategories();
    }, []);

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

            {isLoading ? (
                // Hiển thị loading trong khi chờ API
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                // Hiển thị danh sách sau khi có dữ liệu
                <List component="nav" sx={{ p: 0 }}>
                    {categoryData.map(item => (
                        <RecursiveMenuItem key={item._id} item={item} level={0} onClose={toggleDrawer(false)} />
                    ))}
                </List>
            )}
        </Box>
    );

    return (
        <Drawer anchor="left" open={isOpenCategoryMenu} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
};

export default CategoryMenu;