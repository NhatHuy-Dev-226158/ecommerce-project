import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import SideBar from '../../componets/Sidebar';
import { Typography, Breadcrumbs, Link, Button, Menu, MenuItem, Pagination, CircularProgress, Box } from '@mui/material';
import ProductItem from '../../componets/ProductItem';
import ViewProductItemList from '../../componets/ViewProductItemList';
import { TfiMenuAlt } from "react-icons/tfi";
import { IoGrid } from "react-icons/io5";
import { MdOutlineTune } from "react-icons/md";
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import toast from 'react-hot-toast';

const ProductList = () => {
    // === STATE QUẢN LÝ GIAO DIỆN VÀ DỮ LIỆU ===
    const { productFilters } = useContext(MyContext);

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [itemView, setItemView] = useState('grid');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // State này giờ đây chỉ có một nguồn duy nhất là `productFilters` từ Context
    const [filters, setFilters] = useState({
        search: '',
        category: productFilters.category || '',
        brand: productFilters.brand || [],
        price: productFilters.price || [0, 5000000],
        sort: 'createdAt_desc'
    });

    // === LOGIC ĐÃ ĐƯỢC TỐI ƯU HÓA ===
    // 1. useEffect này sẽ đồng bộ state `filters` nội bộ khi `productFilters` từ context thay đổi
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: productFilters.category,
            brand: productFilters.brand,
            price: productFilters.price,
        }));
    }, [productFilters]);

    // 2. Hàm gọi API, được kích hoạt bởi sự thay đổi của `filters` hoặc `page`
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 15,
                sort: filters.sort,
                minPrice: filters.price[0],
                maxPrice: filters.price[1],
            });
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('categories', filters.category);
            if (filters.brand.length > 0) params.append('brand', filters.brand.join(','));

            const result = await fetchDataFromApi(`/api/products?${params.toString()}`);

            if (result.success && Array.isArray(result.products)) {
                setProducts(result.products);
                setTotalPages(result.totalPages);
                setTotalProducts(result.totalCount);
            } else {
                setProducts([]);
                if (!result.success) {
                    throw new Error(result.message || "API trả về dữ liệu không hợp lệ.");
                }
            }
        } catch (error) {
            toast.error(`Lỗi khi tải sản phẩm: ${error.message}`);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, filters]);

    // 3. useEffect chính để kích hoạt việc gọi API
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // === CÁC HÀM XỬ LÝ SỰ KIỆN ===
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handlePageChange = (event, value) => setPage(value);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleSort = (sortOption) => {
        handleFilterChange('sort', sortOption);
        handleClose();
    };

    // === GIAO DIỆN JSX ===
    return (
        <section className='py-5 pb-8 bg-gray-50'>
            <div className="container">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" component={RouterLink} to="/" className='link transition'>
                        HOME
                    </Link>
                    <Link underline="hover" color="inherit" component={RouterLink} to="/product-list" className='link transition'>
                        Fashion
                    </Link>
                </Breadcrumbs>
            </div>
            <div className="bg-white p-2 mt-4">
                <div className="container flex flex-col md:flex-row gap-6">
                    <div className="sidebarWrapper w-full md:w-[20%] h-full bg-white">
                        <SideBar filters={filters} onFilterChange={handleFilterChange} />
                    </div>

                    <div className="right-Content w-full md:w-[80%] py-3">
                        <div className="bg-[#efefef] p-2 w-full mb-4 rounded-md flex items-center justify-between flex-wrap gap-2">
                            <div className="col1 flex items-center itemViewActive">
                                <Button className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${itemView === "list" && 'active'}`}
                                    onClick={() => setItemView("list")}>
                                    <TfiMenuAlt className='text-[#282828]' />
                                </Button>
                                <Button className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${itemView === "grid" && 'active'}`}
                                    onClick={() => setItemView("grid")}>
                                    <IoGrid className='text-[#282828]' />
                                </Button>
                                <span className='text-[14px] font-[500] pl-3 text-[#b0b0b0]'>
                                    Có tất cả {totalProducts} sản phẩm
                                </span>
                            </div>
                            <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                                <Button
                                    id="basic-button"
                                    onClick={handleClick}
                                    className='!w-[130px] !h-[30px] !mr- !min-w-[40px] !rounded-full !text-[#000] !bg-[#fffafa] flex items-center justify-center !border-2 !border-[#000]'
                                >
                                    <span className='text-[14px] font-[500] text-[#000] flex items-center gap-4 !capitalize'>
                                        Bộ lọc<MdOutlineTune className='text-[18px] ' />
                                    </span>
                                </Button>
                                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                                    <MenuItem onClick={() => handleSort('createdAt_desc')} className='!text-[13px] !text-[#000] !capitalize'>Mới nhất</MenuItem>
                                    <MenuItem onClick={() => handleSort('name-asc')} className='!text-[13px] !text-[#000] !capitalize'>Tên: A-Z</MenuItem>
                                    <MenuItem onClick={() => handleSort('name-desc')} className='!text-[13px] !text-[#000] !capitalize'>Tên: Z-A</MenuItem>
                                    <MenuItem onClick={() => handleSort('price_asc')} className='!text-[13px] !text-[#000] !capitalize'>Giá: Thấp đến Cao</MenuItem>
                                    <MenuItem onClick={() => handleSort('price_desc')} className='!text-[13px] !text-[#000] !capitalize'>Giá: Cao đến Thấp</MenuItem>
                                </Menu>
                            </div>
                        </div>

                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
                        ) : products.length === 0 ? (
                            <Typography className="text-center p-10 text-gray-500">Không tìm thấy sản phẩm nào.</Typography>
                        ) : (
                            <div className={`${itemView === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'grid grid-cols-1 gap-4'}`}>
                                {products.map(product => (
                                    itemView === 'grid'
                                        ? <ProductItem key={product._id} product={product} />
                                        : <ViewProductItemList key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-center mt-10">
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} showFirstButton showLastButton variant="outlined" shape="rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductList;