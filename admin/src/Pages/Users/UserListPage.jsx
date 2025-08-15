import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Typography, Button, Breadcrumbs, Paper, TextField, InputAdornment, Chip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox,
    Toolbar, Tooltip, CircularProgress, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { alpha } from '@mui/material/styles';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { format } from 'date-fns';
import ConfirmationDialog from '../../componets/ConfirmationDialog/ConfirmationDialog';

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Người dùng' }
];

// --- COMPONENT CON CHO THANH CÔNG CỤ ---
const EnhancedTableToolbar = ({ numSelected, onSearchChange, onBulkDelete }) => (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }) }}>
        {numSelected > 0 ? (
            <>
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">{numSelected} đã chọn</Typography>
                <Tooltip title="Xóa">
                    <IconButton onClick={onBulkDelete} color="error"><FiTrash2 /></IconButton>
                </Tooltip>
            </>
        ) : (
            <TextField
                fullWidth
                placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                variant="outlined"
                size="small"
                onChange={onSearchChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><FiSearch className="text-gray-400" /></InputAdornment>
                }}
            />
        )}
    </Toolbar>
);

// === COMPONENT TRANG CHÍNH ===
const UserListPage = () => {
    const context = useContext(MyContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState([]);

    // --- LOGIC FETCH DỮ LIỆU ---
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `/api/user/all?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`;
            const result = await fetchDataFromApi(url);
            if (result.success) {
                setUsers(result.data);
                setTotalUsers(result.totalCount);
            } else {
                context.openAlerBox("error", "Không thể tải danh sách người dùng.");
            }
        } catch (error) {
            context.openAlerBox("error", "Lỗi khi tải người dùng.");
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, searchTerm, context]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = users.map((n) => n._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex > -1) newSelected = selected.filter(selId => selId !== id);
        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getRoleChip = (role) => {
        let className = 'px-2 py-1 text-xs font-semibold rounded-full ';
        switch (role) {
            case 'ADMIN':
                className += 'bg-blue-600 text-white';
                break;
            case 'STAFF':
                className += 'bg-sky-500 text-white';
                break;
            default:
                className += 'bg-gray-200 text-gray-700';
                break;
        }
        return <span className={className}>{role}</span>;
    };
    const getStatusChip = (status) => {
        let className = 'px-2 py-1 text-xs font-semibold rounded-full ';
        let label = status;
        switch (status) {
            case 'Active':
                className += 'bg-green-600 text-white';
                label = 'Hoạt động';
                break;
            case 'Inactive':
                className += 'bg-yellow-500 text-white';
                label = 'Không hoạt động';
                break;
            case 'Suspended':
                className += 'bg-red-600 text-white';
                label = 'Bị khóa';
                break;
            default:
                className += 'bg-gray-200 text-gray-700';
                break;
        }
        return <span className={className}>{label}</span>;
    };


    // --- CÁC HÀM XỬ LÝ XÓA MỚI ---
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
            result = await deleteData(`/api/user/${idsToDelete[0]}`);
        } else {
            result = await postData(`/api/user/delete-multiple`, { ids: idsToDelete });
        }
        if (result.success) {
            context.openAlerBox("success", result.message || `Đã xóa ${idsToDelete.length} người dùng.`);
            fetchUsers();
        } else {
            context.openAlerBox("error", "Xóa người dùng thất bại.");
        }

        setSelected([]);
        handleCloseConfirm();
    };

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Quản lý người dùng</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button component={Link} to="/add-user" variant="contained" startIcon={<FiPlus />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Thêm người dùng
                    </Button>
                </div>
            </div>

            <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <EnhancedTableToolbar numSelected={selected.length} onSearchChange={handleSearchChange} onBulkDelete={handleBulkDeleteClick} />
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell padding="checkbox"><Checkbox color="primary" indeterminate={selected.length > 0 && selected.length < users.length} checked={users.length > 0 && selected.length === users.length} onChange={handleSelectAllClick} /></TableCell>
                                <TableCell>Người dùng</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày tham gia</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading && users.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ p: 4 }}><CircularProgress /></TableCell></TableRow>
                            ) : users.map((row) => {
                                const isItemSelected = isSelected(row._id);
                                return (
                                    <TableRow key={row._id} hover onClick={(event) => handleClick(event, row._id)} role="checkbox" tabIndex={-1} selected={isItemSelected}>
                                        <TableCell padding="checkbox"><Checkbox color="primary" checked={isItemSelected} /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={row.avatar || `https://i.pravatar.cc/40?u=${row.email}`} alt={row.name} />
                                                <div>
                                                    <p className="font-medium text-gray-800">{row.name}</p>
                                                    <p className="text-sm text-gray-500">{row.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleChip(row.role)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(row.status)}
                                        </TableCell>
                                        <TableCell>{format(new Date(row.createdAt), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Sửa người dùng">
                                                <Link to={`/edit-user/${row._id}`} onClick={(e) => e.stopPropagation()}>
                                                    <IconButton size="small"><FiEdit /></IconButton>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(row._id);
                                                    }}
                                                >
                                                    <FiTrash2 />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalUsers}
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
                message={`Bạn có chắc chắn muốn xóa ${idsToDelete.length} người dùng đã chọn không?`}
            />
        </section>
    );
};

export default UserListPage;