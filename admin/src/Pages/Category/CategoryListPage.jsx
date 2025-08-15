import React, { useContext, useEffect, useState } from 'react';
import {
    Typography, Button, Breadcrumbs, Paper, TextField, InputAdornment, Chip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox,
    CircularProgress,
    Tooltip, Toolbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData, postData } from '../../utils/api';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';
import { alpha } from '@mui/material/styles';

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Danh mục' }
];

const flattenCategories = (categories) => {
    let flatList = [];
    const traverse = (nodes, parentName = null, depth = 0) => {
        nodes.forEach(node => {
            const displayName = depth > 0 ? '— '.repeat(depth) + node.name : node.name;
            flatList.push({ ...node, parent: parentName, displayName: displayName });
            if (node.children && node.children.length > 0) {
                traverse(node.children, node.name, depth + 1);
            }
        });
    };
    traverse(categories);
    return flatList;
};

// --- COMPONENT CON: THANH CÔNG CỤ NÂNG CAO ---
const EnhancedTableToolbar = ({ numSelected, onBulkDelete, onSearchChange }) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
                    {numSelected} đã chọn
                </Typography>
            ) : (
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm danh mục theo tên..."
                    variant="outlined"
                    size="small"
                    onChange={onSearchChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><FiSearch className="text-gray-400" /></InputAdornment>,
                    }}
                />
            )}

            {numSelected > 0 && (
                <Tooltip title="Xóa tất cả đã chọn">
                    <IconButton color="error" onClick={onBulkDelete}>
                        <FiTrash2 />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

// === COMPONENT TRANG CHÍNH ===
const CategoryListPage = () => {
    const context = useContext(MyContext);
    const [allCategories, setAllCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            const result = await fetchDataFromApi('/api/category/');
            if (result.success) {
                const flattenedData = flattenCategories(result.data);
                setAllCategories(flattenedData);
                setFilteredCategories(flattenedData);
            } else {
                context.openAlerBox("error", "Không thể tải danh sách danh mục.");
            }
            setIsLoading(false);
        };
        fetchCategories();
    }, []);

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = allCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm)
        );
        setFilteredCategories(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = filteredCategories.map((n) => n._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelectClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
        else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
        else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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
        // Nếu chỉ xóa một mục
        if (idsToDelete.length === 1) {
            result = await deleteData(`/api/category/${idsToDelete[0]}`);
        }
        // Nếu xóa nhiều mục
        else {
            result = await postData(`/api/category/delete-multiple`, { ids: idsToDelete });
        }

        if (result.success) {
            context.openAlerBox("success", result.message);
            const newCategories = allCategories.filter(cat => !idsToDelete.includes(cat._id));
            setAllCategories(newCategories);
            setFilteredCategories(newCategories);
        } else {
            context.openAlerBox("error", "Xóa thất bại.");
        }

        setSelected([]);
        handleCloseConfirm();
    };

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Danh sách danh mục</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        {breadcrumbsData.map((c, i) => (
                            c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link>
                                : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>
                        ))}
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button component={Link} to="/add-category" variant="contained" startIcon={<FiPlus />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <EnhancedTableToolbar numSelected={selected.length} onBulkDelete={handleBulkDeleteClick} onSearchChange={handleSearchChange} />

                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < filteredCategories.length}
                                        checked={filteredCategories.length > 0 && selected.length === filteredCategories.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Danh mục cha</TableCell>
                                <TableCell align="center">Số sản phẩm</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredCategories.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><Typography>Không có dữ liệu.</Typography></TableCell></TableRow>
                            ) : (
                                filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const isItemSelected = isSelected(row._id);
                                    return (
                                        <TableRow
                                            key={row._id}
                                            hover
                                            onClick={(event) => handleSelectClick(event, row._id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox"><Checkbox color="primary" checked={isItemSelected} /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <img src={row.images && row.images.length > 0 ? row.images[0] : '/placeholder.png'} alt={row.name} className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                                                    <span className="font-medium">{row.displayName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{row.parent || '—'}</TableCell>
                                            <TableCell align="center">{row.productCount || 0}</TableCell>
                                            <TableCell>
                                                <Chip label={row.isPublished !== false ? 'Hiển thị' : 'Ẩn'} color={row.isPublished !== false ? 'success' : 'default'} size="small" sx={{ fontWeight: 500 }} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Sửa">
                                                    <Link to={`/edit-category/${row._id}`} onClick={(e) => e.stopPropagation()}>
                                                        <IconButton size="small"><FiEdit /></IconButton>
                                                    </Link>
                                                </Tooltip>

                                                <Tooltip title="Xóa">
                                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}>
                                                        <FiTrash2 />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredCategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng mỗi trang:"
                />
            </Paper>

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa ${idsToDelete.length} danh mục đã chọn không?`}
            />
        </section>
    );
};

export default CategoryListPage;