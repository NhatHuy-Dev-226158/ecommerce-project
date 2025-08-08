import React, { useState } from 'react';
import {
    Button,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    TableContainer,
    TablePagination,
    Avatar,
    Box,
    Typography,
    Chip,
    Link,
    Divider,
    TextField,
    InputAdornment,
} from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import {
    FiEdit,
    FiTrash2,
    FiMoreHorizontal,
    FiCopy,
    FiChevronDown,
    FiChevronUp,
    FiEyeOff,
    FiEye,
    FiStar,
    FiTrendingUp,
    FiAlertTriangle,
    FiTarget,
    FiDollarSign,
    FiDownload,
    FiUpload,
    FiColumns,
    FiMoreVertical,
} from 'react-icons/fi';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { VscClearAll } from "react-icons/vsc";


// --- DỮ LIỆU MẪU VỚI originalPrice ---
const sampleProducts = [
    { id: 'PROD-001', name: 'Apple MacBook Pro 17"', sku: 'APL-MBP-17', category: 'Laptop', vendor: 'Apple Inc.', originalPrice: 75000000, price: 70000000, stock: 12, sales: 150, rating: 4.9, published: 'Đang bán', image: '/720x840.png', dateAdded: '2024-05-20', variants: 3, tags: ['17-inch', 'M3 Pro', '1TB SSD'], revenue: 10500000000, profit: 1575000000, profitMargin: 15.0, salesTrend: 'up' },
    { id: 'PROD-002', name: 'Microsoft Surface Pro 9', sku: 'MS-SFP-9', category: 'Laptop 2-in-1', vendor: 'Microsoft', originalPrice: 96000000, price: 48000000, stock: 25, sales: 98, rating: 4.8, published: 'Đang bán', image: '/720x840.png', dateAdded: '2024-05-18', variants: 4, tags: ['i7', '16GB RAM'], revenue: 4704000000, profit: 846720000, profitMargin: 18.0, salesTrend: 'up' },
    { id: 'PROD-003', name: 'Magic Mouse 2', sku: 'APL-MM-02', category: 'Phụ kiện', vendor: 'Apple Inc.', originalPrice: 2400000, price: 2400000, stock: 0, sales: 302, rating: 4.5, published: 'Hết hàng', image: '/720x840.png', dateAdded: '2024-04-10', variants: 1, tags: ['Bluetooth', 'Sạc lại'], revenue: 724800000, profit: -14496000, profitMargin: -2.0, salesTrend: 'down' },
    { id: 'PROD-004', name: 'Dell UltraSharp 27" 4K', sku: 'DELL-U2721Q', category: 'Màn hình', vendor: 'Dell', originalPrice: 18000000, price: 15000000, stock: 8, sales: 75, rating: 4.7, published: 'Sắp hết', image: '/720x840.png', dateAdded: '2024-05-01', variants: 1, tags: ['4K', 'USB-C'], revenue: 1125000000, profit: 135000000, profitMargin: 12.0, salesTrend: 'stable' },
    { id: 'PROD-005', name: 'Bàn phím Logitech MX Keys', sku: 'LOGI-MXK', category: 'Phụ kiện', vendor: 'Logitech', originalPrice: null, price: 2890000, stock: 50, sales: 120, rating: 4.9, published: 'Ẩn', image: '/720x840.png', dateAdded: '2024-03-15', variants: 2, tags: ['Wireless', 'Backlit'], revenue: 346800000, profit: 52020000, profitMargin: 15.0, salesTrend: 'up' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

// --- COMPONENT CON CHO TỪNG HÀNG SẢN PHẨM ---
const ProductRow = ({ product, isSelected, onSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const openMenu = Boolean(anchorEl);

    const statusConfig = {
        'Đang bán': 'bg-green-100 text-green-800',
        'Sắp hết': 'bg-yellow-100 text-yellow-800',
        'Hết hàng': 'bg-red-100 text-red-800',
        'Ẩn': 'bg-gray-100 text-gray-800',
    };
    const currentStatusColor = statusConfig[product.published] || 'bg-gray-100 text-gray-800';

    const PerformanceTags = ({ product }) => {
        const tags = [];
        if (product.profit < 0) {
            tags.push(<Chip key="loss" icon={<FiDollarSign />} label="Gây lỗ" color="error" size="small" variant="outlined" />);
        }
        if (product.sales > 100) {
            tags.push(<Chip key="bestseller" icon={<FiStar />} label="Bestseller" color="warning" size="small" variant="outlined" />);
        }
        if (product.salesTrend === 'up') {
            tags.push(<Chip key="trending" icon={<FiTrendingUp />} label="Xu hướng tăng" color="success" size="small" variant="outlined" />);
        }
        if (product.profitMargin >= 15.0) {
            tags.push(<Chip key="high-profit" icon={<FiTarget />} label="Lợi nhuận cao" color="info" size="small" variant="outlined" />);
        }
        if (product.stock > 0 && product.stock < 10) {
            tags.push(<Chip key="low-stock" icon={<FiAlertTriangle />} label="Tồn kho thấp" color="error" size="small" variant="outlined" />);
        }
        if (tags.length === 0) {
            return <Typography variant="caption" color="text.secondary">Không có</Typography>;
        }
        return (
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'start', flexWrap: 'wrap' }}>
                {tags}
            </Box>
        );
    };

    // --- HIỂN THỊ GIẢM GIÁ ---
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    return (
        <>
            <tr className={`bg-white border-b hover:bg-slate-50 transition-colors ${isSelected ? '!bg-indigo-50' : ''}`}>
                <td className="p-2"><Checkbox size="small" color="primary" checked={isSelected} onChange={() => onSelect(product.id)} /></td>
                <td className="px-3 py-2">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Link href={`/product/${product.id}`} underline="none">
                            <Avatar src={product.image} variant="rounded" sx={{ width: 40, height: 40, cursor: 'pointer', border: '1px solid #e5e7eb' }} />
                        </Link>
                        <Box>
                            <Link href={`/product/${product.id}`} underline="hover" color="inherit">
                                <Typography component="p" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{product.name}</Typography>
                            </Link>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: {product.id}</Typography>
                        </Box>
                    </Box>
                </td>
                <td className="px-3 py-2 text-center"><span className={`px-2 py-1 text-xs font-medium rounded-full ${currentStatusColor}`}>{product.published}</span></td>
                <td className="px-3 py-2 text-right">
                    <Typography fontWeight="bold" variant="body2">{formatCurrency(product.price)}</Typography>
                    {hasDiscount && (
                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            {formatCurrency(product.originalPrice)}
                        </Typography>
                    )}
                </td>
                <td className="px-3 py-2 text-center">
                    {hasDiscount ? (
                        <Chip
                            label={`-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`}
                            color="error"
                            size="small"
                        />
                    ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                </td>
                <td className="px-3 py-2 text-center font-semibold">{product.stock}</td>
                <td className="px-3 py-2 text-center font-semibold">{product.sales}</td>
                <td className={`px-3 py-2 text-right font-semibold ${product.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(product.profit)}
                </td>
                <td className="px-3 py-2 text-center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <FiStar className="text-yellow-500" />
                        <Typography variant="body2" fontWeight="medium">{product.rating.toFixed(1)}</Typography>
                    </Box>
                </td>
                <td className="px-3 py-2 text-center">
                    <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}><FiMoreVertical /></IconButton>
                    <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)} PaperProps={{ variant: 'outlined', elevation: 0 }}>
                        <MenuItem onClick={() => { }}><FiEdit className="mr-2" />Sửa</MenuItem>
                        <MenuItem onClick={() => { }}><FiCopy className="mr-2" />Copy</MenuItem>
                        <MenuItem onClick={() => { }} sx={{ color: 'error.main' }}><FiTrash2 className="mr-2" />Xóa</MenuItem>
                    </Menu>
                    <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)} title="Xem thêm">
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </IconButton>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-slate-50">
                    <td colSpan={10}>
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm">
                            <div><p className="font-bold text-gray-500 uppercase text-xs">Doanh thu</p><p className="font-semibold">{formatCurrency(product.revenue)}</p></div>
                            <div><p className="font-bold text-gray-500 uppercase text-xs">SKU</p><p className="font-mono">{product.sku}</p></div>
                            <div><p className="font-bold text-gray-500 uppercase text-xs">Danh mục</p><p>{product.category}</p></div>
                            <div><p className="font-bold text-gray-500 uppercase text-xs">Nhà cung cấp</p><p>{product.vendor}</p></div>
                            <div><p className="font-bold text-gray-500 uppercase text-xs">Số phiên bản</p><p>{product.variants}</p></div>
                            <div><p className="font-bold text-gray-500 uppercase text-xs">Ngày tạo</p><p>{formatDate(product.dateAdded)}</p></div>
                            <div className="col-span-2"><p className="font-bold text-gray-500 uppercase text-xs">Hiệu suất</p><PerformanceTags product={product} /></div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};


// --- COMPONENT CHÍNH ---
const ProductsTable = () => {
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(sampleProducts.map((n) => n.id));
        } else {
            setSelected([]);
        }
    };
    const handleSelectOne = (id) => {
        const index = selected.indexOf(id);
        let newSelected = [];
        if (index === -1) {
            newSelected = newSelected.concat(selected, id);
        } else {
            newSelected = selected.filter(selId => selId !== id);
        }
        setSelected(newSelected);
    };
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenActionsMenu = (event) => setActionsMenuAnchor(event.currentTarget);
    const handleCloseActionsMenu = () => setActionsMenuAnchor(null);

    return (
        <div className="my-5">
            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }} variant="outlined">
                <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
                    {selected.length > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>{selected.length} đã chọn</Typography>
                            <Button variant="text" size="small" startIcon={<FiEye />}>Đăng bán</Button>
                            <Button variant="text" size="small" startIcon={<FiEyeOff />}>Ẩn</Button>
                            <Button variant="text" size="small" color="error" startIcon={<FiTrash2 />}>Xóa</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button variant="text" size="small" startIcon={<VscClearAll />} onClick={() => setSelected([])}>Bỏ chọn</Button>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h6" fontWeight="bold">Sản phẩm ({sampleProducts.length})</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder="Tìm kiếm..."
                                    sx={{ width: { xs: '100%', sm: 240 } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IoIosSearch size={20} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button variant="outlined" startIcon={<FaFilter />}>Lọc</Button>
                                <Button variant="contained" className='!py-[5px]' startIcon={<FaPlus />}>Thêm mới</Button>
                                <IconButton onClick={handleOpenActionsMenu}><FiMoreHorizontal /></IconButton>
                                <Menu
                                    anchorEl={actionsMenuAnchor}
                                    open={Boolean(actionsMenuAnchor)}
                                    onClose={handleCloseActionsMenu}
                                >
                                    <MenuItem onClick={handleCloseActionsMenu}><FiDownload className="mr-2" /> Xuất file Excel</MenuItem>
                                    <MenuItem onClick={handleCloseActionsMenu}><FiUpload className="mr-2" /> Nhập từ file</MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleCloseActionsMenu}><FiColumns className="mr-2" /> Tùy chỉnh cột</MenuItem>
                                </Menu>
                            </Box>
                        </>
                    )}
                </Box>

                <TableContainer>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="p-2 w-4"><Checkbox size="small" color="primary" indeterminate={selected.length > 0 && selected.length < sampleProducts.length} checked={sampleProducts.length > 0 && selected.length === sampleProducts.length} onChange={handleSelectAll} /></th>
                                <th className="px-3 py-2 min-w-[250px]">Sản phẩm</th>
                                <th className="px-3 py-2 text-center whitespace-nowrap">Trạng thái</th>
                                <th className="px-3 py-2 text-right whitespace-nowrap">Giá bán</th>
                                <th className="px-3 py-2 text-center whitespace-nowrap">Giảm giá</th>
                                <th className="px-3 py-2 text-center whitespace-nowrap">Tồn kho</th>
                                <th className="px-3 py-2 text-center whitespace-nowrap">Đã bán</th>
                                <th className="px-3 py-2 text-right whitespace-nowrap">Lợi nhuận</th>
                                <th className="px-3 py-2 text-center whitespace-nowrap">Đánh giá</th>
                                <th className="px-3 py-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                                <ProductRow key={product.id} product={product} isSelected={selected.indexOf(product.id) !== -1} onSelect={handleSelectOne} />
                            ))}
                        </tbody>
                    </table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={sampleProducts.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
            </Paper>
        </div>
    );
};

export default ProductsTable;