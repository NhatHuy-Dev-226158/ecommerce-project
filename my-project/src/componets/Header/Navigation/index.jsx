import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsMenuButtonWideFill } from "react-icons/bs";
import { TfiAngleDown } from "react-icons/tfi";
import { IoHomeOutline, IoRocketOutline, IoChevronDownOutline } from "react-icons/io5";
import CategoryMenu from './CategoryMenu';
import '../Navigation/style.css';
import { MyContext } from '../../../App';
import { fetchDataFromApi } from '../../../utils/api';


const Navigation = () => {
    const { applyFilterAndNavigate, ...context } = useContext(MyContext);
    const [navCategories, setNavCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenCategoryMenu, setIsOpenCategoryMenu] = useState(false);

    const handleCategoryClick = (categoryId) => {
        // Gọi hàm từ context để cập nhật bộ lọc và điều hướng
        applyFilterAndNavigate('category', categoryId);
    };
    useEffect(() => {
        const fetchNavCategories = async () => {
            setIsLoading(true);
            const result = await fetchDataFromApi('/api/category/');
            if (result.success) {
                // Lọc ra các danh mục được phép hiển thị và chỉ lấy các danh mục cha
                const publishedParentCategories = result.data.filter(cat => cat.isPublished !== false);

                // Cập nhật state với nhiều nhất 7 danh mục
                setNavCategories(publishedParentCategories.slice(0, 7));
            } else {
                context.openAlerBox("error", "Không thể tải danh mục.");
            }
            setIsLoading(false);
        };
        fetchNavCategories();
    }, []);


    const navButtonStyle = {
        color: 'rgba(0,0,0,0.7)',
        fontWeight: 500,
        padding: '0.75rem 0.5rem',
        fontSize: '15px',
        textTransform: 'none',
        borderRadius: '8px',
        position: 'relative',
        '& .chevron-icon': {
            marginLeft: '4px',
            fontSize: '12px',
            transition: 'transform 0.2s ease',
        },
        '&:hover .chevron-icon': {
            transform: 'rotate(180deg)',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '0',
            width: '100%',
            height: '2px',
            backgroundColor: '#ff4646',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom center',
            transition: 'transform 0.3s ease-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
        '&:hover': {
            color: '#000',
            backgroundColor: 'transparent'
        },
    };

    const subMenuButtonStyle = {
        color: 'rgba(0,0,0,0.85)',
        width: '100%',
        justifyContent: 'flex-start',
        borderRadius: '6px',
        padding: '0.7rem 1rem',
        textTransform: 'none',
        fontSize: '14px',
        '&:hover': {
            color: '#ff4646',
            backgroundColor: 'rgba(255, 70, 70, 0.05)'
        }
    };

    return (
        <>
            <nav>
                <div className="container flex items-center justify-end gap-4">
                    {/* Nút DANH MỤC */}
                    <div className="col_1 w-[20%]">
                        <Button className='!text-black gap-2 w-full !bg-[#f7f7f7] !px-3' onClick={() => setIsOpenCategoryMenu(true)}>
                            <BsMenuButtonWideFill className='text-[18px]' />
                            DANH MỤC
                            <TfiAngleDown className='text-[12px] ml-auto !font-bold' />
                        </Button>
                    </div>

                    <div className="h-8 border-l-2 border-gray-200"></div>

                    {/* --- THANH ĐIỀU HƯỚNG CHÍNH --- */}
                    <div className="col_2 w-[65%]">
                        <ul className="flex items-center gap-4 justify-center nav">
                            <li className="list-none relative">
                                <Button component={Link} to="/" sx={navButtonStyle}><IoHomeOutline /></Button>
                            </li>

                            {!isLoading && navCategories.map(category => {
                                const isParent = category.children && category.children.length > 0;

                                return (
                                    <li key={category._id} className="list-none relative">
                                        <Button
                                            // Nếu là danh mục cha, nó chỉ là một div. Nếu không, nó sẽ có sự kiện onClick
                                            component={isParent ? 'div' : Button}
                                            onClick={isParent ? undefined : () => handleCategoryClick(category._id)}
                                            sx={navButtonStyle}
                                        >
                                            {category.name}
                                            {isParent && <IoChevronDownOutline className="chevron-icon" />}
                                        </Button>

                                        {isParent && (
                                            <div className="submenu absolute top-[100%] left-0 min-w-[240px] bg-white shadow-md">
                                                <ul>
                                                    {category.children.map(child => {
                                                        if (child.isPublished === false) return null;
                                                        return (
                                                            <li key={child._id}>
                                                                <Button
                                                                    onClick={() => handleCategoryClick(child._id)}
                                                                    sx={subMenuButtonStyle}
                                                                >
                                                                    {child.name}
                                                                </Button>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="h-8 border-l-2 border-gray-200"></div>

                    <div className="col_3 w-[15%]">
                        <p className='text-[12px] !font-[600] text-gray-500 flex items-center gap-2 mb-0 mt-0'>
                            <IoRocketOutline className='text-[18px]' />
                            Giao Hàng Nhanh
                        </p>
                    </div>
                </div>
            </nav>

            <CategoryMenu
                isOpenCategoryMenu={isOpenCategoryMenu}
                setIsOpenCategoryMenu={setIsOpenCategoryMenu}
            />
        </>
    );
};

export default Navigation;