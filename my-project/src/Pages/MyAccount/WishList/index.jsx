import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { FiShoppingCart, FiTrash2, FiHeart } from 'react-icons/fi';
import { fetchDataFromApi } from '../../../utils/api';
import { MyContext } from '../../../App';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const WishlistPage = () => {
    const context = useContext(MyContext);
    const { wishlist, removeFromWishlist, addToCart } = context;

    const [categories, setCategories] = useState([]);
    const [filteredWishlist, setFilteredWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Bắt đầu với trạng thái loading
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Biến này để tránh cập nhật state nếu component đã bị unmount
        let isMounted = true;

        const initialLoad = async () => {
            setIsLoading(true);
            try {
                // Chỉ fetch categories
                const catResult = await fetchDataFromApi('/api/category/');
                if (isMounted && catResult.success) {
                    setCategories(catResult.data.filter(cat => !cat.parentId));
                }
            } catch (error) {
                console.error("Failed to fetch categories for filter", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initialLoad();

        return () => {
            isMounted = false; // Cleanup
        };
    }, []);

    useEffect(() => {
        let items = [...wishlist];
        if (selectedCategory !== 'all') {
        }
        setFilteredWishlist(items);
    }, [wishlist, selectedCategory]);

    const handleCategoryFilterChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleAddToCart = (item) => {
        const productToAdd = {
            _id: item.productId,
            name: item.productTitle,
            images: [item.image],
            price: item.price,
        };
        addToCart(productToAdd, 1);
        removeFromWishlist(item.productId);
    };

    return (
        <div className="space-y-6 container mx-auto py-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Sản phẩm yêu thích</h2>
                <p className="text-gray-500 mt-1">Quản lý các sản phẩm bạn đã quan tâm.</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-wrap gap-4 items-center">
                <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
                    <InputLabel>Lọc theo Danh mục</InputLabel>
                    <Select value={selectedCategory} onChange={handleCategoryFilterChange} label="Lọc theo Danh mục">
                        <MenuItem value="all">Tất cả danh mục</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><CircularProgress /></div>
            ) : filteredWishlist.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">SẢN PHẨM</th>
                                <th scope="col" className="px-6 py-4 font-semibold">ĐƠN GIÁ</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-center">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWishlist.map((item) => (
                                <tr key={item.wishlistId} className="bg-white border-t hover:bg-gray-50">
                                    <td scope="row" className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image || '/placeholder.png'} alt={item.productTitle} className="w-20 h-20 rounded-md object-cover" />
                                            <Link to={`/product-detail/${item.productId}`} className="font-bold text-gray-800 hover:text-primary">{item.productTitle}</Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {formatCurrency(item.price)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="contained" size="small" startIcon={<FiShoppingCart />} onClick={() => handleAddToCart(item)} sx={{ textTransform: 'none' }}>
                                                Thêm vào giỏ
                                            </Button>
                                            <Tooltip title="Xóa khỏi danh sách yêu thích">
                                                {/* Sửa lại hàm xóa để dùng productId */}
                                                <IconButton onClick={() => removeFromWishlist(item.productId)} color="error"><FiTrash2 /></IconButton>
                                            </Tooltip>
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