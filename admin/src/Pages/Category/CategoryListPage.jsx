import React, { useState } from 'react';
import {
    Typography, Button, Breadcrumbs, Paper, TextField, InputAdornment, Chip, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// --- DỮ LIỆU MẪU ---
// Trong ứng dụng thực tế, dữ liệu này sẽ được fetch từ API
const mockCategories = [
    { id: 'cat1', name: 'Thịt', image: 'https://via.placeholder.com/40', parent: null, productCount: 25, status: 'published' },
    { id: 'cat2', name: 'Rau củ', image: 'https://via.placeholder.com/40', parent: null, productCount: 42, status: 'published' },
    { id: 'cat3', name: 'Hải sản', image: 'https://via.placeholder.com/40', parent: null, productCount: 15, status: 'hidden' },
    { id: 'subcat1', name: 'Thịt heo', image: 'https://via.placeholder.com/40', parent: 'Thịt', productCount: 12, status: 'published' },
    { id: 'subcat2', name: 'Thịt bò', image: 'https://via.placeholder.com/40', parent: 'Thịt', productCount: 8, status: 'published' },
    { id: 'subcat3', name: 'Rau ăn lá', image: 'https://via.placeholder.com/40', parent: 'Rau củ', productCount: 20, status: 'published' },
    { id: 'subcat4', name: 'Củ quả', image: 'https://via.placeholder.com/40', parent: 'Rau củ', productCount: 22, status: 'published' },
    { id: 'cat4', name: 'Đồ khô', image: 'https://via.placeholder.com/40', parent: null, productCount: 0, status: 'hidden' },
    { id: 'cat5', name: 'Gia vị', image: 'https://via.placeholder.com/40', parent: null, productCount: 50, status: 'published' },
];

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Danh mục' } // Mục cuối không có link
];


// === COMPONENT TRANG CHÍNH ===
const CategoryListPage = () => {
    // State cho việc phân trang
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý thay đổi số dòng trên mỗi trang
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <section className="bg-gray-50">
            {/* Header của trang */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Danh sách danh mục</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        {breadcrumbsData.map((c, i) => (
                            c.link ?
                                <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> :
                                <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>
                        ))}
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        component={Link}
                        to="/add-category" // Link tới trang thêm mới bạn vừa tạo
                        variant="contained"
                        startIcon={<FiPlus />}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            {/* Khung chính chứa bộ lọc và bảng */}
            <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Thanh tìm kiếm */}
                <div className="p-4">
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm danh mục theo tên..."
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiSearch className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {/* Bảng danh sách */}
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell padding="checkbox"><Checkbox /></TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Danh mục cha</TableCell>
                                <TableCell align="center">Số sản phẩm</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox"><Checkbox /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img src={row.image} alt={row.name} className="w-10 h-10 rounded-md object-cover" />
                                            <span className="font-medium">{row.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{row.parent || '—'}</TableCell>
                                    <TableCell align="center">{row.productCount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                                            color={row.status === 'published' ? 'success' : 'default'}
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link to='/edit-category'>
                                            <IconButton size="small"><FiEdit /></IconButton>
                                        </Link>
                                        <IconButton size="small" color="error"><FiTrash2 /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Phân trang */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={mockCategories.length}
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

export default CategoryListPage;