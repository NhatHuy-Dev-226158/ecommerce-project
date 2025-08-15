import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Paper, Grid, CircularProgress, Box, Toolbar, alpha, Typography,
    TextField, InputAdornment, Tooltip, IconButton, Button, TablePagination
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../componets/Componets-Product/Product-Header';
import RejectionItemsCard from '../../componets/Componets-Product/RejectionItemsCard';
import ProductsBreakdownCard from '../../componets/Componets-Product/ProductsBreakdownCard';
import ProductListTable from '../../componets/Componets-Product/ProductListTable';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, postData, updateData } from '../../utils/api';
import { FiSearch, FiTrash2 } from 'react-icons/fi';

// --- COMPONENT CON: THANH CÔNG CỤ NÂNG CAO ---
const EnhancedTableToolbar = ({ numSelected, onBulkDelete }) => (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }) }}>
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">{numSelected} đã chọn</Typography>
        <Tooltip title="Xóa tất cả đã chọn">
            <IconButton color="error" onClick={onBulkDelete}><FiTrash2 /></IconButton>
        </Tooltip>
    </Toolbar>
);

// --- COMPONENT CON: BỘ LỌC ---
const ProductListFilter = ({ onSearchChange }) => (
    <div className="p-4">
        <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            onChange={onSearchChange}
            InputProps={{
                startAdornment: <InputAdornment position="start"><FiSearch className="text-gray-400" /></InputAdornment>,
            }}
        />
    </div>
);

const ProductListPage = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();

    // State dữ liệu
    const [allProducts, setAllProducts] = useState([]);
    const [productsToDisplay, setProductsToDisplay] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State cho phân trang và tìm kiếm
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // State cho các hành động
    const [selected, setSelected] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState([]);

    // --- LOGIC FETCH DỮ LIỆU ---
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchDataFromApi(`/api/products/?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`); if (result.success) {
                if (result.success) {
                    setAllProducts(result.products);
                    setProductsToDisplay(result.products);
                    setTotalProducts(result.totalCount); // Dùng totalCount từ API mới
                }
            }
            else {
                context.openAlerBox("error", "Không thể tải danh sách sản phẩm.");
            }
        } catch (error) {
            context.openAlerBox("error", "Lỗi khi tải sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    }, [context, page, rowsPerPage, searchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- LOGIC LỌC VÀ TÌM KIẾM (PHÍA CLIENT) ---
    useEffect(() => {
        let filtered = [...allProducts];
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setProductsToDisplay(filtered);
        setTotalProducts(filtered.length);
        setPage(0);
    }, [searchTerm, allProducts]);

    // --- CÁC HÀM XỬ LÝ HÀNH ĐỘNG ---
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(productsToDisplay.map((n) => n._id));
        } else {
            setSelected([]);
        }
    };
    const handleSelectClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex > -1) newSelected = selected.filter(selId => selId !== id);
        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;
    const handleDeleteClick = (id) => { setIdsToDelete([id]); setIsConfirmOpen(true); };
    const handleBulkDeleteClick = () => { setIdsToDelete(selected); setIsConfirmOpen(true); };
    const handleCloseConfirm = () => { setIsConfirmOpen(false); setIdsToDelete([]); };

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
            fetchProducts();
        } else {
            context.openAlerBox("error", "Xóa sản phẩm thất bại.");
        }
        setSelected([]);
        handleCloseConfirm();
    };

    const handleEditClick = (productId) => navigate(`/edit-product/${productId}`);

    const handleDuplicateClick = async (productId) => {
        try {
            const originalProduct = allProducts.find(p => p._id === productId);
            if (!originalProduct) throw new Error("Không tìm thấy sản phẩm gốc.");
            const duplicatedData = { ...originalProduct, name: `${originalProduct.name} - Copy`, isFeatured: false };
            delete duplicatedData._id;
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
        setProductsToDisplay(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: newStatus } : p));
        const result = await updateData(`/api/products/${product._id}`, { isFeatured: newStatus }); if (!result.success) {
            context.openAlerBox("error", "Cập nhật thất bại.");
            setProductsToDisplay(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: !newStatus } : p));
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
                {selected.length > 0 ? (
                    <EnhancedTableToolbar numSelected={selected.length} onBulkDelete={handleBulkDeleteClick} />
                ) : (
                    <ProductListFilter onSearchChange={handleSearchChange} />
                )}

                <ProductListTable
                    products={productsToDisplay.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    isLoading={isLoading && productsToDisplay.length === 0}
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
        </section>
    );
};

export default ProductListPage;