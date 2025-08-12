import React, { useState } from 'react';
import {
    Typography, Button, Breadcrumbs, Paper, TextField, InputAdornment, Chip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox,
    Toolbar, Tooltip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";
import { alpha } from '@mui/material/styles';

// --- DỮ LIỆU MẪU ---
// Trong ứng dụng thực tế, dữ liệu này sẽ được fetch từ API
const mockUsers = [
    { id: 'user1', avatar: 'https://via.placeholder.com/40/818cf8/ffffff?text=A', name: 'Nguyễn Văn An', email: 'an.nguyen@example.com', role: 'USER', status: 'Active', joinDate: '2024-08-15' },
    { id: 'user2', avatar: 'https://via.placeholder.com/40/fb923c/ffffff?text=B', name: 'Trần Thị Bình', email: 'binh.tran@example.com', role: 'USER', status: 'Active', joinDate: '2024-08-14' },
    { id: 'user3', avatar: 'https://via.placeholder.com/40/34d399/ffffff?text=C', name: 'Lê Minh Cường', email: 'cuong.le@example.com', role: 'ADMIN', status: 'Active', joinDate: '2024-08-12' },
    { id: 'user4', avatar: 'https://via.placeholder.com/40/f87171/ffffff?text=D', name: 'Phạm Thị Dung', email: 'dung.pham@example.com', role: 'USER', status: 'Suspended', joinDate: '2024-08-10' },
    { id: 'user5', avatar: 'https://via.placeholder.com/40/a78bfa/ffffff?text=E', name: 'Hoàng Văn Em', email: 'em.hoang@example.com', role: 'USER', status: 'Inactive', joinDate: '2024-07-25' },
    { id: 'user6', avatar: 'https://via.placeholder.com/40/facc15/ffffff?text=G', name: 'Vũ Thị Giang', email: 'giang.vu@example.com', role: 'USER', status: 'Active', joinDate: '2024-07-20' },
];

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Người dùng' }
];

// --- COMPONENT CON CHO BẢNG ---
// Component cho thanh công cụ của bảng, hiển thị khi có item được chọn
const EnhancedTableToolbar = ({ numSelected }) => {
    return (
        <Toolbar sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
                bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
            borderRadius: '12px 12px 0 0'
        }}>
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} đã chọn
                </Typography>
            ) : (
                <div className="p-2 w-full">
                    <TextField fullWidth placeholder="Tìm kiếm người dùng..." variant="outlined" size="small"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><FiSearch className="text-gray-400" /></InputAdornment>
                        }}
                    />
                </div>
            )}
            {numSelected > 0 && (
                <Tooltip title="Xóa">
                    <IconButton><FiTrash2 /></IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

// === COMPONENT TRANG CHÍNH ===
const UserListPage = () => {
    // State cho bảng và lựa chọn
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Xử lý chọn tất cả
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = mockUsers.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    // Xử lý chọn một dòng
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
        else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
        else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Xử lý phân trang
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Active': return <Chip label="Hoạt động" color="success" size="small" />;
            case 'Inactive': return <Chip label="Không hoạt động" color="warning" size="small" />;
            case 'Suspended': return <Chip label="Bị khóa" color="error" size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    return (
        <section className="bg-gray-50">
            {/* Header của trang */}
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

            {/* Khung chính */}
            <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell padding="checkbox"><Checkbox indeterminate={selected.length > 0 && selected.length < mockUsers.length} checked={mockUsers.length > 0 && selected.length === mockUsers.length} onChange={handleSelectAllClick} /></TableCell>
                                <TableCell>Người dùng</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày tham gia</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <TableRow key={row.id} hover onClick={(event) => handleClick(event, row.id)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>
                                        <TableCell padding="checkbox"><Checkbox checked={isItemSelected} /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{row.name}</p>
                                                    <p className="text-sm text-gray-500">{row.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={row.role} color={row.role === 'ADMIN' ? 'primary' : 'default'} size="small" sx={{ fontWeight: 500 }} />
                                        </TableCell>
                                        <TableCell>{getStatusChip(row.status)}</TableCell>
                                        <TableCell>{row.joinDate}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Sửa người dùng">
                                                <Link to='/edit-user'>
                                                    <IconButton size="small"><FiEdit /></IconButton>
                                                </Link>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={mockUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng mỗi trang:"
                />
            </Paper>
        </section>
    );
};

export default UserListPage;