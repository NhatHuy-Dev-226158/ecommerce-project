import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Paper, Grid, CircularProgress, Toolbar, alpha, Typography,
    TextField, InputAdornment, Tooltip, IconButton, TablePagination,
    Drawer, Box, Slider, Button, Table, TableHead, TableRow, TableCell, TableSortLabel, Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

// --- Component Imports ---
import PageHeader from '../../componets/Componets-Product/Product-Header';
import RejectionItemsCard from '../../componets/Componets-Product/RejectionItemsCard';
import ProductsBreakdownCard from '../../componets/Componets-Product/ProductsBreakdownCard';
import ProductListTable from '../../componets/Componets-Product/ProductListTable';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';

// --- Context & API ---
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, postData, updateData } from '../../utils/api';
import { FiSearch, FiTrash2, FiFilter } from 'react-icons/fi';

//================================================================================
// MAIN PRODUCT LIST PAGE COMPONENT
//================================================================================

const ProductListPage = () => {
    // --- State cũ ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState([]);

    // --- State mới cho Lọc, Sắp xếp và Phân trang ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('createdAt_desc'); // Mặc định: mới nhất
    const [filters, setFilters] = useState({ minPrice: '', maxPrice: '' });
    const [tempFilters, setTempFilters] = useState({ minPrice: '', maxPrice: '' }); // State tạm cho drawer
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- Hàm tải dữ liệu (đã cập nhật) ---
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm,
                sort: sort,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
            });

            for (let [key, value] of params.entries()) {
                if (!value) params.delete(key);
            }

            const result = await fetchDataFromApi(`/api/products/?${params.toString()}`);
            if (result.success) {
                setProducts(result.products);
                setTotalProducts(result.totalCount);
            } else {
                context.openAlerBox("error", "Không thể tải danh sách sản phẩm.");
            }
        } catch (error) {
            context.openAlerBox("error", "Lỗi khi tải sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, searchTerm, sort, filters, context]);

    useEffect(() => {
        const handler = setTimeout(() => fetchProducts(), 500); // Debounce
        return () => clearTimeout(handler);
    }, [fetchProducts]);

    // --- Các hàm xử lý hành động ---

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleSort = (sortKey) => {
        const isDesc = sort === `${sortKey}_desc`;
        const newSort = isDesc ? `${sortKey}_asc` : `${sortKey}_desc`;
        setSort(newSort);
        setPage(0);
    };

    const handleFilterChange = (e) => {
        setTempFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyFilters = () => {
        setFilters(tempFilters);
        setPage(0);
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        const cleared = { minPrice: '', maxPrice: '' };
        setFilters(cleared);
        setTempFilters(cleared);
        setPage(0);
        setIsFilterOpen(false);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) setSelected(products.map((n) => n._id));
        else setSelected([]);
    };

    const handleSelectClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else newSelected = selected.filter(selId => selId !== id);
        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleDeleteClick = (id) => {
        setIdsToDelete([id]);
        setIsConfirmOpen(true);
    };

    const handleBulkDeleteClick = () => {
        setIdsToDelete(selected);
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
        setIdsToDelete([]);
    };

    const handleConfirmDelete = async () => {
        if (!idsToDelete || idsToDelete.length === 0) return;
        let result;
        if (idsToDelete.length === 1) {
            result = await deleteData(`/api/products/${idsToDelete[0]}`);
        } else {
            result = await postData(`/api/products/delete-multiple`, { ids: idsToDelete });
        }
        if (result.success) {
            context.openAlerBox("success", result.message || `Đã xóa ${idsToDelete.length} sản phẩm.`);
            fetchProducts(); // Tải lại dữ liệu
        } else {
            context.openAlerBox("error", "Xóa sản phẩm thất bại.");
        }
        setSelected([]);
        handleCloseConfirm();
    };

    const handleEditClick = (productId) => navigate(`/edit-product/${productId}`);

    const handleDuplicateClick = async (productId) => {
        try {
            const originalProduct = products.find(p => p._id === productId);
            if (!originalProduct) throw new Error("Không tìm thấy sản phẩm gốc.");
            const duplicatedData = { ...originalProduct, name: `${originalProduct.name} - Copy`, isFeatured: false };
            delete duplicatedData._id; // Xóa ID để DB tạo mới
            const result = await postData('/api/products/', duplicatedData);
            if (result.success) {
                context.openAlerBox("success", "Nhân bản sản phẩm thành công!");
                fetchProducts();
            } else {
                throw new Error(result.message || "Nhân bản thất bại.");
            }
        } catch (error) {
            context.openAlerBox("error", error.message);
        }
    };

    const handleToggleFeaturedClick = async (product) => {
        const newStatus = !product.isFeatured;
        // Optimistic Update
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: newStatus } : p));
        const result = await updateData(`/api/products/${product._id}`, { isFeatured: newStatus });
        if (!result.success) {
            context.openAlerBox("error", "Cập nhật thất bại.");
            // Hoàn tác nếu lỗi
            setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !newStatus } : p));
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <PageHeader />
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} lg={5}><RejectionItemsCard /></Grid>
                <Grid item xs={12} lg={7}><ProductsBreakdownCard /></Grid>
            </Grid>

            <Paper sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

                {/* === KHU VỰC ĐÃ CẬP NHẬT === */}
                {selected.length > 0 ? (
                    // Hiển thị thanh công cụ xóa khi có sản phẩm được chọn
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                            bgcolor: (theme) => alpha(theme.palette.primary.light, 0.15),
                        }}
                    >
                        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
                            {selected.length} đã chọn
                        </Typography>

                        <Tooltip title="Xóa">
                            <IconButton onClick={handleBulkDeleteClick}>
                                <FiTrash2 color='red' />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                ) : (
                    // Hiển thị thanh tìm kiếm và bộ lọc mặc định
                    <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm theo tên sản phẩm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<FiFilter />}
                            onClick={() => setIsFilterOpen(true)}
                            sx={{ textTransform: 'none', borderRadius: '8px' }}
                        >
                            Lọc
                        </Button>
                    </Box>
                )}

                <ProductListTable
                    products={products}
                    isLoading={isLoading}
                    onSort={handleSort}
                    sortConfig={{ key: sort.split('_')[0], direction: sort.split('_')[1] }}
                    selected={selected}
                    onSelectAllClick={handleSelectAllClick}
                    onSelectClick={handleSelectClick}
                    isSelected={isSelected}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    onDuplicateClick={handleDuplicateClick}
                    onToggleFeaturedClick={handleToggleFeaturedClick}
                />
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalProducts}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng/trang:"
                />
            </Paper>

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa ${idsToDelete.length} sản phẩm đã chọn không?`}
            />

            {/* Giao diện bộ lọc nâng cao */}
            <Drawer anchor="right" open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
                <Box sx={{ width: 320, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Bộ lọc nâng cao</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField label="Giá thấp nhất" name="minPrice" type="number" value={tempFilters.minPrice} onChange={handleFilterChange} />
                        <TextField label="Giá cao nhất" name="maxPrice" type="number" value={tempFilters.maxPrice} onChange={handleFilterChange} />
                    </Box>
                    <Divider sx={{ mt: 3 }} />
                    <Box sx={{ pt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="text" onClick={clearFilters}>Xóa bộ lọc</Button>
                        <Button variant="contained" onClick={applyFilters}>Áp dụng</Button>
                    </Box>
                </Box>
            </Drawer>
        </section>
    );
};

export default ProductListPage;