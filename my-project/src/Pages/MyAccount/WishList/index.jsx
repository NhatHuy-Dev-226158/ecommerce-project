import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FiShoppingCart, FiTrash2, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';

// --- DỮ LIỆU TĨNH ĐÃ CÓ THUỘC TÍNH CHI TIẾT ---
const wishlistItems = [
    {
        id: 1,
        name: 'Áo khoác Chrono-Weave',
        image: '/product/720x840.png',
        price: 3450000,
        category: 'Thời trang',
        attributes: { size: 'L', color: 'Đen' } // Thuộc tính thời trang
    },
    {
        id: 2,
        name: 'Đồng hồ thông minh Helios',
        image: '/product/720x840.png',
        price: 7300000,
        category: 'Công nghệ',
        attributes: { version: 'Titanium', strap: 'Da' } // Thuộc tính công nghệ
    },
    {
        id: 3,
        name: 'Túi da Lunar',
        image: '/product/720x840.png',
        price: 2100000,
        category: 'Phụ kiện',
        attributes: { material: 'Da bò thật', color: 'Nâu' } // Thuộc tính phụ kiện
    },
    {
        id: 4,
        name: 'Giày thể thao Zero-G',
        image: '/product/720x840.png',
        price: 1800000,
        category: 'Giày dép',
        attributes: { size: '42', color: 'Trắng/Xanh' }
    },
];
const categories = ['Tất cả', 'Thời trang', 'Công nghệ', 'Phụ kiện', 'Giày dép'];
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// --- COMPONENT CON MỚI ĐỂ HIỂN THỊ THUỘC TÍNH ---
const ProductAttributes = ({ attributes }) => (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
        {attributes.size && <span>Size: <span className="font-medium text-gray-700">{attributes.size}</span></span>}
        {attributes.color && <span>Màu: <span className="font-medium text-gray-700">{attributes.color}</span></span>}
        {attributes.version && <span>Phiên bản: <span className="font-medium text-gray-700">{attributes.version}</span></span>}
        {attributes.strap && <span>Dây đeo: <span className="font-medium text-gray-700">{attributes.strap}</span></span>}
        {attributes.material && <span>Chất liệu: <span className="font-medium text-gray-700">{attributes.material}</span></span>}
    </div>
);


// --- COMPONENT TRANG WISHLIST ---
const WishlistPage = () => {
    // Để xem giao diện khi trống, đổi giá trị này
    const hasItems = true;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Sản phẩm yêu thích</h2>
                <p className="text-gray-500 mt-1">Quản lý và mua sắm các sản phẩm bạn đã quan tâm.</p>
            </div>

            {/* Thanh công cụ với component MUI (Không đổi) */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-wrap gap-4 items-center">
                <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
                    <InputLabel>Danh mục</InputLabel>
                    <Select defaultValue="Tất cả" label="Danh mục">
                        {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
                    <InputLabel>Sắp xếp</InputLabel>
                    <Select defaultValue="date_desc" label="Sắp xếp">
                        <MenuItem value="date_desc">Mới nhất</MenuItem>
                        <MenuItem value="price_asc">Giá: Thấp đến cao</MenuItem>
                        <MenuItem value="price_desc">Giá: Cao đến thấp</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="outlined" color="error" startIcon={<FiTrash2 />} className="!ml-auto">
                    Xóa đã chọn
                </Button>
            </div>

            {/* Bảng sản phẩm - Nâng cấp */}
            {hasItems ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" /></th>
                                <th scope="col" className="px-6 py-3">Sản phẩm</th>
                                <th scope="col" className="px-6 py-3 text-center">Đơn giá</th>
                                <th scope="col" className="px-6 py-3 text-center">Số lượng</th>
                                <th scope="col" className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 ">
                                    <td className="w-4 p-4 pt-6"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" /></td>

                                    {/* Cột sản phẩm - Đã thêm thuộc tính */}
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-start gap-4">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                                            <div>
                                                <Link to={`/product-detail/${item.id}`} className="font-bold hover:underline">{item.name}</Link>
                                                <p className="text-gray-500 text-xs mt-1">{item.category}</p>
                                                {/* Component hiển thị thuộc tính */}
                                                <ProductAttributes attributes={item.attributes} />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 pt-6 text-center font-medium">
                                        {formatCurrency(item.price)}
                                    </td>

                                    {/* Cột số lượng - MỚI */}
                                    <td className="px-6 py-4 pt-5 text-center">
                                        <div className="flex items-center justify-center border border-gray-300 rounded-md w-fit mx-auto">
                                            <button className="px-2 py-1 text-gray-600 hover:bg-gray-100"><FiMinus size={14} /></button>
                                            <input type="text" defaultValue="1" className="w-10 text-center font-semibold text-gray-800 bg-transparent border-l border-r border-gray-300 focus:outline-none" />
                                            <button className="px-2 py-1 text-gray-600 hover:bg-gray-100"><FiPlus size={14} /></button>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 pt-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="contained" size="small" startIcon={<FiShoppingCart />} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                                                Add to card
                                            </Button>
                                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                                <FiTrash2 className='text-[18px]' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='text-center py-20 flex items-center flex-col justify-center border-2 border-dashed border-gray-300 rounded-xl'>
                    <FiHeart className="text-6xl text-gray-300 mb-4" />
                    <h3 className="font-bold text-xl text-gray-800">Danh sách yêu thích của bạn đang trống</h3>
                    <p className="text-gray-500 mt-1">Hãy khám phá và thêm sản phẩm bạn yêu thích vào đây nhé.</p>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;