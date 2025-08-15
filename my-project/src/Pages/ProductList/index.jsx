import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import SideBar from '../../componets/Sidebar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../componets/ProductItem';
import ViewProductItemList from '../../componets/ViewProductItemList';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TfiMenuAlt } from "react-icons/tfi";
import { IoGrid } from "react-icons/io5";
import { MdOutlineTune } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { CircularProgress, Box } from '@mui/material';

const ProductList = () => {
    const { categorySlug } = useParams();
    const context = useContext(MyContext);

    // State cho dữ liệu và giao diện
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [itemView, setItemView] = useState('grid');

    // State cho bộ lọc
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const open = Boolean(anchorEl);

    // Logic gọi API
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // TODO: Backend cần hỗ trợ lọc theo category slug và sắp xếp
                const result = await fetchDataFromApi(`/api/products/?page=${page}&limit=15&sort=${sortBy}`);
                if (result.success) {
                    setProducts(result.products);
                    setTotalPages(result.totalPages);
                    setTotalProducts(result.totalCount);
                } else {
                    context.openAlerBox("error", "Không thể tải danh sách sản phẩm.");
                }
            } catch (error) {
                context.openAlerBox("error", "Lỗi khi tải sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [page, categorySlug, sortBy, context]);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handlePageChange = (event, value) => setPage(value);

    const handleSort = (sortOption) => {
        setSortBy(sortOption);
        setPage(1);
        handleClose();
    };

    return (
        <section className='py-5 pb-8'>
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
                        <SideBar />
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
                                    <MenuItem onClick={() => handleSort('sales-desc')} className='!text-[13px] !text-[#000] !capitalize'>Bán chạy nhất</MenuItem>
                                    <MenuItem onClick={() => handleSort('name-asc')} className='!text-[13px] !text-[#000] !capitalize'>Tên: A-Z</MenuItem>
                                    <MenuItem onClick={() => handleSort('name-desc')} className='!text-[13px] !text-[#000] !capitalize'>Tên: Z-A</MenuItem>
                                    <MenuItem onClick={() => handleSort('price-asc')} className='!text-[13px] !text-[#000] !capitalize'>Giá: Thấp đến Cao</MenuItem>
                                    <MenuItem onClick={() => handleSort('price-desc')} className='!text-[13px] !text-[#000] !capitalize'>Giá: Cao đến Thấp</MenuItem>
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