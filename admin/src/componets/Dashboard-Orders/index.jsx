import React, from 'react';
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { FiPrinter, FiEdit, FiTrash2, FiMoreHorizontal, FiDownload, FiUpload } from "react-icons/fi";
import { FaPlus, FaFilter } from 'react-icons/fa';
import { VscClearAll } from "react-icons/vsc";
import {
    Box, Button, Checkbox, Divider, IconButton, Menu, MenuItem,
    Paper, TablePagination, TextField, InputAdornment, Typography
} from '@mui/material';

// Dữ liệu mẫu (không thay đổi)
const allSampleOrders = [
    { id: 'DH-00126', customerName: 'Lê Minh Cường', customerEmail: 'cuong.le@email.com', customerPhone: '0905123789', orderDate: '30/12/2023', channel: 'Website', totalAmount: '70.050.000 VNĐ', subTotal: '70.000.000 VNĐ', shippingFee: '50.000 VNĐ', discount: '0 VNĐ', status: 'Đang giao hàng', paymentStatus: 'Đã thanh toán', shippingAddress: '789 Đường LMN, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh', paymentMethod: 'Thanh toán qua Ví MoMo', timeline: [{ status: 'Giao cho đơn vị vận chuyển', time: '14:30 30/12/2023' }, { status: 'Xác nhận thanh toán', time: '11:00 30/12/2023' }, { status: 'Đơn hàng được tạo', time: '10:55 30/12/2023' }], items: [{ sku: 'APL-MBP-17-SLV', name: 'Apple MacBook Pro 17"', quantity: 1, price: '70.000.000 VNĐ', image: '/720x840.png' }] },
    { id: 'DH-00125', customerName: 'Nguyễn Văn An', customerEmail: 'an.nguyen@email.com', customerPhone: '0987654321', orderDate: '25/12/2023', channel: 'Tại cửa hàng', totalAmount: '2.520.000 VNĐ', subTotal: '2.550.000 VNĐ', shippingFee: '0 VNĐ', discount: '30.000 VNĐ', status: 'Đã giao', paymentStatus: 'Đã thanh toán', shippingAddress: 'N/A', paymentMethod: 'Tiền mặt', timeline: [{ status: 'Đơn hàng hoàn tất', time: '18:00 25/12/2023' }, { status: 'Đơn hàng được tạo', time: '17:50 25/12/2023' }], items: [{ sku: 'APL-MM-02-BLK', name: 'Magic Mouse 2', quantity: 1, price: '2.400.000 VNĐ', image: '/720x840.png' }, { sku: 'APL-CBL-USBC', name: 'Cáp sạc USB-C', quantity: 1, price: '150.000 VNĐ', image: '/720x840.png' }] },
    { id: 'DH-00124', customerName: 'Trần Thị Bích', customerEmail: 'bich.tran@email.com', customerPhone: '0912345678', orderDate: '24/12/2023', channel: 'Facebook', totalAmount: '48.000.000 VNĐ', subTotal: '48.000.000 VNĐ', shippingFee: '0 VNĐ', discount: '0 VNĐ', status: 'Đang xử lý', paymentStatus: 'Chờ thanh toán', shippingAddress: '456 Đường XYZ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', paymentMethod: 'Chuyển khoản ngân hàng', timeline: [{ status: 'Đơn hàng được tạo', time: '09:15 24/12/2023' }], items: [{ sku: 'MS-SFP-13-WHT', name: 'Microsoft Surface Pro', quantity: 1, price: '48.000.000 VNĐ', image: '/720x840.png' }] },
    { id: 'DH-00123', customerName: 'Phạm Văn Đức', customerEmail: 'duc.pham@email.com', customerPhone: '0933445566', orderDate: '23/12/2023', channel: 'Website', totalAmount: '26.850.000 VNĐ', subTotal: '27.000.000 VNĐ', shippingFee: '50.000 VNĐ', discount: '200.000 VNĐ', status: 'Đã giao', paymentStatus: 'Đã thanh toán', shippingAddress: '111 Đường GHI, Quận 2, TP. Hồ Chí Minh', paymentMethod: 'Thẻ tín dụng', timeline: [{ status: 'Giao hàng thành công', time: '16:00 25/12/2023' }, { status: 'Giao cho đơn vị vận chuyển', time: '10:00 24/12/2023' }, { status: 'Đơn hàng được tạo', time: '20:30 23/12/2023' }], items: [{ sku: 'DELL-U2721Q', name: 'Dell UltraSharp 27" 4K', quantity: 1, price: '15.000.000 VNĐ', image: '/720x840.png' }, { sku: 'LOGI-MXK', name: 'Bàn phím Logitech MX Keys', quantity: 1, price: '12.000.000 VNĐ', image: '/720x840.png' }] },
    { id: 'DH-00122', customerName: 'Hoàng Lan Anh', customerEmail: 'anh.hoang@email.com', customerPhone: '0944556677', orderDate: '22/12/2023', channel: 'Zalo', totalAmount: '35.000.000 VNĐ', subTotal: '35.000.000 VNĐ', shippingFee: '0 VNĐ', discount: '0 VNĐ', status: 'Đã hủy', paymentStatus: 'Chờ thanh toán', shippingAddress: '222 Đường KLM, Quận 3, TP. Hồ Chí Minh', paymentMethod: 'Chuyển khoản', timeline: [{ status: 'Đơn hàng đã bị hủy', time: '11:00 22/12/2023' }, { status: 'Đơn hàng được tạo', time: '10:30 22/12/2023' }], items: [{ sku: 'DELL-XPS15', name: 'Dell XPS 15', quantity: 1, price: '35.000.000 VNĐ', image: '/720x840.png' }] },
];

//================================================================================
// COMPONENT CON: STATUS BADGE
//================================================================================

/**
 * @component StatusBadge
 * @description Hiển thị một badge (nhãn) với màu sắc tương ứng với trạng thái đơn hàng hoặc thanh toán.
 * @param {object} props - Props cho component.
 * @param {string} props.status - Chuỗi trạng thái (ví dụ: 'Đã giao', 'Đã thanh toán').
 * @param {'order' | 'payment'} [props.type='order'] - Loại trạng thái để áp dụng màu sắc chính xác.
 */
const StatusBadge = ({ status, type = 'order' }) => {
    const orderStatusClasses = { 'Đã giao': 'bg-green-100 text-green-800', 'Đang xử lý': 'bg-yellow-100 text-yellow-800', 'Đang giao hàng': 'bg-blue-100 text-blue-800', 'Đã hủy': 'bg-red-100 text-red-800' };
    const paymentStatusClasses = { 'Đã thanh toán': 'bg-teal-100 text-teal-800', 'Chờ thanh toán': 'bg-orange-100 text-orange-800' };
    const classes = type === 'payment' ? paymentStatusClasses : orderStatusClasses;
    return <span className={`whitespace-nowrap px-2 py-1 text-xs font-medium rounded-full ${classes[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

//================================================================================
// COMPONENT CON: ORDER ROW
//================================================================================

/**
 * @component OrderRow
 * @description Component hiển thị một hàng dữ liệu đơn hàng trong bảng, với khả năng mở rộng để xem chi tiết.
 * @param {object} props - Props cho component.
 * @param {object} props.order - Đối tượng chứa toàn bộ thông tin của đơn hàng.
 * @param {boolean} props.isSelected - Cho biết hàng này có đang được chọn hay không.
 * @param {Function} props.onSelect - Callback được gọi khi checkbox của hàng này được thay đổi.
 */
const OrderRow = ({ order, isSelected, onSelect }) => {
    // State quản lý việc hiển thị/ẩn phần chi tiết của đơn hàng
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {/* Hàng chính chứa thông tin tóm tắt */}
            <tr className={`bg-white border-b hover:bg-gray-50 ${isSelected ? '!bg-indigo-50' : ''}`}>
                <td className="w-4 p-4"><Checkbox size="small" checked={isSelected} onChange={() => onSelect(order.id)} /></td>
                <th scope="row" className="px-6 py-4 font-bold text-blue-600 whitespace-nowrap">{order.id}</th>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.orderDate}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{order.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={order.status} type="order" /></td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={order.paymentStatus} type="payment" /></td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <IconButton size="small" title="Sửa"><FiEdit /></IconButton>
                        <IconButton size="small" title="In"><FiPrinter /></IconButton>
                        <IconButton size="small" title="Xóa" sx={{ color: 'error.main' }}><FiTrash2 /></IconButton>
                        <IconButton onClick={() => setIsOpen(!isOpen)} size="small" title="Chi tiết">
                            <IoIosArrowDown className={`transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                        </IconButton>
                    </div>
                </td>
            </tr>
            {/* Hàng phụ chứa thông tin chi tiết, chỉ hiển thị khi 'isOpen' là true */}
            {isOpen && (
                <tr className="bg-gray-50 border-b">
                    <td colSpan="8" className="p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cột 1: Thông tin khách hàng và giao hàng */}
                            <div className="space-y-4">
                                <div><h4 className='font-semibold text-gray-800 mb-2'>Thông tin khách hàng</h4><p className='text-gray-600 text-sm'><strong>Email:</strong> {order.customerEmail}</p><p className='text-gray-600 text-sm'><strong>SĐT:</strong> {order.customerPhone}</p></div>
                                <div><h4 className='font-semibold text-gray-800 mb-2'>Thông tin giao hàng</h4><p className='text-gray-600 text-sm'><strong>Địa chỉ:</strong> {order.shippingAddress}</p><p className='text-gray-600 text-sm'><strong>Thanh toán:</strong> {order.paymentMethod}</p><p className='text-gray-600 text-sm'><strong>Kênh bán:</strong> {order.channel}</p></div>
                            </div>
                            {/* Cột 2: Lịch sử đơn hàng (timeline) */}
                            <div className="space-y-4">
                                <h4 className='font-semibold text-gray-800 mb-2'>Lịch sử đơn hàng</h4>
                                <ul className="relative border-l border-gray-200">{order.timeline.map((event, index) => (<li key={index} className="mb-4 ml-4"><div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div><time className="mb-1 text-xs font-normal leading-none text-gray-400">{event.time}</time><p className="text-sm font-semibold text-gray-700">{event.status}</p></li>))}</ul>
                            </div>
                            {/* Cột 3: Chi tiết sản phẩm và tổng tiền */}
                            <div className="space-y-4">
                                <h4 className='font-semibold text-gray-800 mb-2'>Chi tiết sản phẩm</h4>
                                <div className='space-y-3'>{order.items.map((item, index) => (<div key={index} className="flex items-center gap-4"><img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" /><div className="flex-grow"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-gray-500">SL: {item.quantity}</p></div><p className="font-medium text-sm">{item.price}</p></div>))}</div>
                                <div className="border-t pt-3 space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Tiền hàng:</span><span>{order.subTotal}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển:</span><span>{order.shippingFee}</span></div>
                                    <div className="flex justify-between text-red-500"><span className="text-gray-600">Giảm giá:</span><span>- {order.discount}</span></div>
                                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span className="text-gray-800">Tổng cộng:</span><span className="text-blue-600">{order.totalAmount}</span></div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

//================================================================================
// COMPONENT CHÍNH: ORDERS TABLE
//================================================================================

/**
 * @component OrdersTable
 * @description Component chính hiển thị toàn bộ giao diện quản lý đơn hàng, bao gồm thanh công cụ,
 * bảng dữ liệu, và phân trang.
 * @note Dữ liệu `allSampleOrders` đang được hardcode. Trong ứng dụng thực tế, nó nên được
 * truyền vào qua props hoặc lấy từ API.
 */
const OrdersTable = () => {
    // --- STATE MANAGEMENT ---
    const [selected, setSelected] = useState([]); // Quản lý danh sách ID đơn hàng được chọn
    const [page, setPage] = useState(0); // Quản lý trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5); // Quản lý số hàng trên mỗi trang
    const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null); // Quản lý menu hành động (...)

    // --- EVENT HANDLERS ---
    const handleSelectAll = (event) => {
        if (event.target.checked) setSelected(allSampleOrders.map((n) => n.id));
        else setSelected([]);
    };
    const handleSelectOne = (id) => {
        const index = selected.indexOf(id);
        let newSelected = [];
        if (index === -1) newSelected = newSelected.concat(selected, id);
        else newSelected = selected.filter(selId => selId !== id);
        setSelected(newSelected);
    };
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleOpenActionsMenu = (event) => setActionsMenuAnchor(event.currentTarget);
    const handleCloseActionsMenu = () => setActionsMenuAnchor(null);

    // --- RENDER ---
    return (
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }} variant="outlined">
            {/* Thanh công cụ: Hiển thị khác nhau dựa trên việc có đơn hàng nào được chọn hay không */}
            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
                {selected.length > 0 ? (
                    // Giao diện khi có ít nhất một đơn hàng được chọn
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>{selected.length} đã chọn</Typography>
                        <Button variant="text" size="small" startIcon={<FiPrinter />}>In hàng loạt</Button>
                        <Button variant="text" size="small" color="error" startIcon={<FiTrash2 />}>Xóa</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button variant="text" size="small" startIcon={<VscClearAll />} onClick={() => setSelected([])}>Bỏ chọn</Button>
                    </Box>
                ) : (
                    // Giao diện mặc định khi không có đơn hàng nào được chọn
                    <>
                        <Typography variant="h6" fontWeight="bold">Đơn hàng ({allSampleOrders.length})</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField size="small" placeholder="Tìm đơn hàng..." sx={{ width: { xs: '100%', sm: 240 } }} InputProps={{ startAdornment: (<InputAdornment position="start"><IoIosSearch size={20} /></InputAdornment>), }} />
                            <Button variant="outlined" startIcon={<FaFilter />}>Lọc</Button>
                            <Button variant="contained" startIcon={<FaPlus />}>Thêm mới</Button>
                            <IconButton onClick={handleOpenActionsMenu}><FiMoreHorizontal /></IconButton>
                            <Menu anchorEl={actionsMenuAnchor} open={Boolean(actionsMenuAnchor)} onClose={handleCloseActionsMenu}>
                                <MenuItem onClick={handleCloseActionsMenu}><FiDownload className="mr-2" /> Xuất file</MenuItem>
                                <MenuItem onClick={handleCloseActionsMenu}><FiUpload className="mr-2" /> Nhập file</MenuItem>
                            </Menu>
                        </Box>
                    </>
                )}
            </Box>

            {/* Bảng dữ liệu chính */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="p-4 w-4"><Checkbox size="small" indeterminate={selected.length > 0 && selected.length < allSampleOrders.length} checked={allSampleOrders.length > 0 && selected.length === allSampleOrders.length} onChange={handleSelectAll} /></th>
                            <th scope="col" className="px-6 py-3">Mã Đơn</th>
                            <th scope="col" className="px-6 py-3">Khách Hàng</th>
                            <th scope="col" className="px-6 py-3">Ngày Đặt</th>
                            <th scope="col" className="px-6 py-3">Tổng Tiền</th>
                            <th scope="col" className="px-6 py-3">Trạng thái ĐH</th>
                            <th scope="col" className="px-6 py-3">Trạng thái TT</th>
                            <th scope="col" className="px-6 py-3 text-right">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Cắt (slice) mảng dữ liệu để phân trang và lặp (map) qua để render các hàng */}
                        {allSampleOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                            <OrderRow key={order.id} order={order} isSelected={selected.indexOf(order.id) !== -1} onSelect={handleSelectOne} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Component phân trang */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={allSampleOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default OrdersTable;