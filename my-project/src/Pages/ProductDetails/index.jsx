import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductsSlider from '../../componets/ProductsSlider';
import ProductDetailsComponets from '../../componets/ProductDetails/inddex';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { CircularProgress, Typography, Box, Rating, TextField, Button } from '@mui/material';
import ZoomdetailPage from '../../componets/ZoomProductImg/ZoomdetailPage';

// --- COMPONENT TRANG CHÍNH ---
const ProductDetails = () => {
    const { productId } = useParams();
    const context = useContext(MyContext);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActiveTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            return;
        }

        window.scrollTo(0, 0);
        const fetchProductDetails = async () => {
            setIsLoading(true);
            try {
                const result = await fetchDataFromApi(`/api/products/${productId}`);
                if (result.success) {
                    setProduct(result.product);
                } else {
                    context.openAlerBox("error", "Không tìm thấy sản phẩm.");
                }
            } catch (error) {
                context.openAlerBox("error", "Lỗi khi tải chi tiết sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    if (!product) {
        return <div className="text-center py-10"><Typography>Không tìm thấy sản phẩm.</Typography></div>;
    }

    const productInfoDetails = [
        ["Tên sản phẩm", product.name],
        ["Thương hiệu", product.brand || 'N/A'],
        ["Danh mục", product.category?.name || 'N/A'],
        ["Tồn kho", `${product.countInStock} sản phẩm`],
        ["Đánh giá", `${product.rating || 0} / 5 sao`],
    ];

    return (
        <>
            <div className='py-5 bg-gray-50 border-b'>
                <div className="container">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link component={RouterLink} underline="hover" color="inherit" to="/">TRANG CHỦ</Link>
                        {product.category && <Link component={RouterLink} underline="hover" color="inherit" to={`/category/${product.category._id}`}>{product.category.name.toUpperCase()}</Link>}
                        <Typography color="text.primary">{product.name.toUpperCase()}</Typography>
                    </Breadcrumbs>
                </div>
            </div>

            <section className='bg-white py-8'>
                <div className="!w-[85%] container grid grid-cols-1 lg:grid-cols-2 ">
                    <div className=" w-full ">
                        <ZoomdetailPage images={product.images} />
                    </div>
                    <div className="w-full">
                        <ProductDetailsComponets product={product} />
                    </div>
                </div>

                <div className="container pt-12">
                    <div className="flex items-center gap-8 mb-5 border-b">
                        <span className={`py-3 font-medium cursor-pointer transition-all ${isActiveTab === 0 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`} onClick={() => setActiveTab(0)}>Mô tả</span>
                        <span className={`py-3 font-medium cursor-pointer transition-all ${isActiveTab === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`} onClick={() => setActiveTab(1)}>Thông tin chi tiết</span>
                        <span className={`py-3 font-medium cursor-pointer transition-all ${isActiveTab === 2 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`} onClick={() => setActiveTab(2)}>Đánh giá</span>
                    </div>

                    <Box sx={{ mt: 3 }}>
                        {isActiveTab === 0 && (
                            <div
                                className="prose max-w-none shadow-md py-8 px-8 rounded-md leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.richDescription || product.description.replace(/\n/g, '<br />') }}
                            />
                        )}

                        {isActiveTab === 1 && (
                            <div className="shadow-md w-full py-8 px-8 rounded-md space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/2 w-full">
                                        <h3 className="text-2xl font-semibold mb-4">Thông tin chi tiết</h3>
                                        <table className="table-auto w-full border border-gray-300 text-sm">
                                            <tbody>
                                                {productInfoDetails.map(([label, value], index) => (
                                                    <tr key={index} className="even:bg-gray-50">
                                                        <td className="border px-3 py-2 font-medium w-1/3">{label}</td>
                                                        <td className="border px-3 py-2">{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:w-1/2 w-full flex justify-center items-center">
                                        <img
                                            src={product.images?.[1] || product.images?.[0] || '/placeholder.png'}
                                            alt="Hình minh họa sản phẩm"
                                            className="rounded-md border shadow-md max-h-[400px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isActiveTab === 2 && (
                            <div className="shadow-md w-full md:w-4/5 py-8 px-8 rounded-md">
                                <h3 className="text-2xl font-semibold mb-4">Đánh giá & Bình luận</h3>
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 mb-6">
                                    {/* Logic hiển thị review thật sẽ ở đây */}
                                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                </div>
                                <div className="reviews-form bg-gray-50 p-4 rounded-md">
                                    <h4 className='text-lg font-semibold'>Để lại bình luận của bạn</h4>
                                    <form className='w-full mt-4 space-y-4'>
                                        <TextField label="Nhập bình luận..." multiline rows={3} fullWidth />
                                        <Rating name="user-rating" defaultValue={5} />
                                        <div className="flex justify-end"><Button variant="contained">Gửi bình luận</Button></div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Box>
                </div>

                <div className="container pt-14">
                    <h2 className='text-2xl font-bold mb-4'>Sản phẩm tương tự</h2>
                    <ProductsSlider items={6} categoryId={product.category?._id} />
                </div>
            </section>
        </>
    );
};

export default ProductDetails;