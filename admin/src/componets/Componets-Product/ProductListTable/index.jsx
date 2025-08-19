import React, { useState } from 'react';
import {
    Grid, Checkbox, IconButton, CircularProgress, Typography, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Menu, MenuItem, ListItemIcon, ListItemText, Avatar, Divider, Box, Collapse
} from '@mui/material';
import { FiEdit, FiTrash2, FiMoreVertical, FiCopy, FiStar, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * @component CollapsibleRow
 * @description Một hàng trong bảng sản phẩm có thể mở rộng để xem chi tiết.
 * @param {object} props - Props cho component.
 * @param {object} props.product - Dữ liệu của sản phẩm để hiển thị.
 * @param {boolean} props.isSelected - Trạng thái cho biết hàng có đang được chọn hay không.
 * @param {Function} props.onSelectClick - Callback được gọi khi người dùng click vào hàng để chọn/bỏ chọn.
 * @param {Function} props.onEditClick - Callback được gọi khi nhấn nút "Sửa".
 * @param {Function} props.onDeleteClick - Callback được gọi khi nhấn nút "Xóa".
 * @param {Function} props.onDuplicateClick - Callback được gọi khi nhấn nút "Nhân bản".
 * @param {Function} props.onToggleFeaturedClick - Callback được gọi khi nhấn nút "Nổi bật" hoặc "Bỏ nổi bật".
 */
const CollapsibleRow = ({
    product, isSelected, onSelectClick,
    onEditClick, onDeleteClick, onDuplicateClick, onToggleFeaturedClick
}) => {
    // State quản lý việc mở/đóng phần chi tiết (collapse) của hàng
    const [open, setOpen] = useState(false);
    // State quản lý việc mở/đóng menu hành động (...)
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const labelId = `product-row-${product._id}`;

    // Mở menu tại vị trí của nút được click
    const handleMenuOpen = (event) => {
        event.stopPropagation(); // Ngăn sự kiện click lan ra toàn bộ hàng, tránh trigger onSelectClick
        setAnchorEl(event.currentTarget);
    };

    // Đóng menu
    const handleMenuClose = () => setAnchorEl(null);

    // Các hàm bao bọc (wrapper) để tự động đóng menu sau khi một hành động được thực hiện
    const handleEdit = () => { handleMenuClose(); onEditClick(product._id); };
    const handleDelete = () => { handleMenuClose(); onDeleteClick(product._id); };
    const handleDuplicate = () => { handleMenuClose(); onDuplicateClick(product._id); };
    const handleToggleFeatured = () => { handleMenuClose(); onToggleFeaturedClick(product); };

    return (
        <React.Fragment>
            {/* Hàng chính chứa thông tin cơ bản của sản phẩm */}
            <TableRow
                hover
                selected={isSelected}
                onClick={(event) => onSelectClick(event, product._id)}
                sx={{ '& > *': { borderBottom: 'unset' } }} // Bỏ border dưới để hàng collapse liền mạch
            >
                <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={isSelected} inputProps={{ 'aria-labelledby': labelId }} />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        {/* Nút để mở/đóng phần chi tiết */}
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                        >
                            {open ? <FiChevronUp /> : <FiChevronDown />}
                        </IconButton>
                        <Avatar variant="rounded" src={product.images?.[0] || '/placeholder.png'} sx={{ width: 48, height: 48 }} />
                        <div>
                            <Typography variant="subtitle2" fontWeight={600} className="line-clamp-2" id={labelId}>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{product.category?.name || 'N/A'}</Typography>
                        </div>
                    </div>
                </TableCell>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{product.brand || 'N/A'}</TableCell>
                <TableCell align="center">{product.countInStock.toLocaleString()}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>{product.price.toLocaleString('vi-VN')} đ</TableCell>
                <TableCell align="right">
                    {/* Menu hành động */}
                    <Tooltip title="Tùy chọn">
                        <IconButton onClick={handleMenuOpen}><FiMoreVertical /></IconButton>
                    </Tooltip>
                    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                        <MenuItem onClick={handleEdit}><ListItemIcon><FiEdit size={16} /></ListItemIcon><ListItemText>Sửa</ListItemText></MenuItem>
                        <MenuItem onClick={handleDuplicate}><ListItemIcon><FiCopy size={16} /></ListItemIcon><ListItemText>Nhân bản</ListItemText></MenuItem>
                        <MenuItem onClick={handleToggleFeatured}><ListItemIcon><FiStar size={16} color={product.isFeatured ? '#facc15' : 'inherit'} /></ListItemIcon><ListItemText>{product.isFeatured ? 'Bỏ nổi bật' : 'Nổi bật'}</ListItemText></MenuItem>
                        <MenuItem component="a" href={`/product/${product._id}`} target="_blank" onClick={handleMenuClose}><ListItemIcon><FiEye size={16} /></ListItemIcon><ListItemText>Xem trước</ListItemText></MenuItem>
                        <Divider />
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><ListItemIcon sx={{ color: 'error.main' }}><FiTrash2 size={16} /></ListItemIcon><ListItemText>Xóa</ListItemText></MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>

            {/* Hàng phụ chứa thông tin chi tiết, chỉ hiển thị khi 'open' là true */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, padding: 3, backgroundColor: 'grey.50', borderRadius: '12px' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Mô tả:</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto', color: 'text.secondary' }}>
                                        {product.description || 'Không có mô tả.'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>Thư viện ảnh:</Typography>
                                    {product.images && product.images.length > 0 ? (
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                            {product.images.map((imgUrl, index) => (
                                                <a key={index} href={imgUrl} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border hover:border-indigo-500 transition-all">
                                                    <img src={imgUrl} alt={`Ảnh sản phẩm ${index + 1}`} className="w-full h-full object-cover" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Không có ảnh nào.</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

/**
 * @component ProductListTable
 * @description Component chính để hiển thị bảng danh sách sản phẩm.
 * @description Nó xử lý trạng thái loading, trạng thái rỗng và render danh sách các `CollapsibleRow`.
 * @param {object} props - Props cho component.
 * @param {Array<object>} props.products - Mảng các đối tượng sản phẩm để hiển thị.
 * @param {boolean} props.isLoading - Cờ cho biết dữ liệu có đang được tải hay không.
 * @param {Function} props.onDeleteClick - Callback được truyền xuống `CollapsibleRow`.
 * @param {Function} props.onEditClick - Callback được truyền xuống `CollapsibleRow`.
 * @param {Function} props.onDuplicateClick - Callback được truyền xuống `CollapsibleRow`.
 * @param {Function} props.onToggleFeaturedClick - Callback được truyền xuống `CollapsibleRow`.
 * @param {Array<string>} props.selected - Mảng chứa ID của các sản phẩm đang được chọn.
 * @param {Function} props.onSelectAllClick - Callback được gọi khi click vào checkbox "chọn tất cả".
 * @param {Function} props.onSelectClick - Callback được gọi khi một hàng được chọn.
 * @param {Function} props.isSelected - Hàm để kiểm tra xem một sản phẩm có đang được chọn hay không.
 */
const ProductListTable = ({
    products, isLoading, onDeleteClick, onEditClick, onDuplicateClick, onToggleFeaturedClick,
    selected, onSelectAllClick, onSelectClick, isSelected,
}) => (
    <React.Fragment>
        <TableContainer>
            <Table>
                {/* Tiêu đề của bảng */}
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={selected.length > 0 && selected.length < products.length}
                                checked={products.length > 0 && selected.length === products.length}
                                onChange={onSelectAllClick}
                            />
                        </TableCell>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Thương hiệu</TableCell>
                        <TableCell align="center">Tồn kho</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                {/* Thân bảng */}
                <TableBody>
                    {/* Trường hợp: Đang tải dữ liệu */}
                    {isLoading && products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                        // Trường hợp: Không có sản phẩm nào
                    ) : products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                <Typography>Không tìm thấy sản phẩm nào.</Typography>
                            </TableCell>
                        </TableRow>
                        // Trường hợp: Có dữ liệu sản phẩm
                    ) : (
                        products.map(item => (
                            <CollapsibleRow
                                key={item._id}
                                product={item}
                                isSelected={isSelected(item._id)}
                                onSelectClick={onSelectClick}
                                onEditClick={onEditClick}
                                onDeleteClick={onDeleteClick}
                                onDuplicateClick={onDuplicateClick}
                                onToggleFeaturedClick={onToggleFeaturedClick}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </React.Fragment>
);

export default ProductListTable;