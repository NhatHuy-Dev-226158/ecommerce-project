import React, { createContext, useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// --- Thư viện UI & Icons ---
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { MdOutlineCloseFullscreen } from "react-icons/md";

// --- Các Component & Trang của dự án ---
import Header from './componets/Header';
import Footer from './componets/Footer';
import Home from './Pages/Home';
import ProductList from './Pages/ProductList';
import ProductDetails from './Pages/ProductDetails';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Cart from './componets/Cart';
import Verify from './Pages/Verify';
import ForgotPassword from './Pages/ForgotPassword';
import CheckoutPage from './Pages/Checkout';
import MyAccount from './Pages/MyAccount';
import ZoomProductImg from './componets/ZoomProductImg/Zoomquickview';
import ProductDetailsComponets from './componets/ProductDetails/inddex';
import OrderDetailPage from './Pages/MyAccount/Orders/OrderDetail';

// --- Các hàm tiện ích & Styles ---
import { deleteData, fetchDataFromApi, postData } from './utils/api';
import './App.css';
import BlogDetailPage from './componets/BlogItem/BlogDetailPage';

// --- Khởi tạo Context ---
export const MyContext = createContext();

// ====================================================================
// ===                 COMPONENT WRAPPER TRUNG TÂM                  ===
// ====================================================================
// Component này chứa toàn bộ state và logic, nằm bên trong BrowserRouter
const AppContextWrapper = ({ children }) => {
  const navigate = useNavigate(); // Hook này hợp lệ vì component nằm trong <BrowserRouter>

  // --- STATE QUẢN LÝ UI CHUNG ---
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openProductDetailModel, setOpenProductDetailModel] = useState(false);
  const [productDataForModel, setProductDataForModel] = useState(null);

  // --- STATE QUẢN LÝ DỮ LIỆU NGƯỜI DÙNG & XÁC THỰC ---
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // --- STATE QUẢN LÝ BỘ LỌC SẢN PHẨM TOÀN CỤC ---
  const [productFilters, setProductFilters] = useState({
    category: '',
    brand: [],
    price: [0, 5000000000],
  });


  // ====================================================================
  // ===                       CÁC HÀM TIỆN ÍCH                      ===
  // ====================================================================

  const openAlerBox = (type, msg) => toast[type]?.(msg);
  const toggleCartPanel = (isOpen) => () => setOpenCartPanel(isOpen);

  /**
   * Áp dụng bộ lọc sản phẩm và điều hướng đến trang danh sách sản phẩm.
   * Được gọi từ các menu danh mục.
   */
  const applyFilterAndNavigate = (filterKey, filterValue) => {
    setProductFilters(prev => ({
      ...prev,
      category: filterKey === 'search' ? '' : (filterKey === 'category' ? filterValue : prev.category),
      search: filterKey === 'search' ? filterValue : '',
      [filterKey]: filterValue
    }));
    navigate('/product-list');
  };


  // ====================================================================
  // ===                      LOGIC GIỎ HÀNG (CART)                    ===
  // ====================================================================

  const fetchCartData = async () => {
    try {
      const res = await fetchDataFromApi('/api/cart/');
      if (res.success) {
        setCart(res.data.map(item => ({
          _id: item.productId, cartItemId: item._id, quantity: item.quantity,
          name: item.productTitle, images: [item.image], price: item.price
        })));
      }
    } catch (error) { console.error("Lỗi khi tải giỏ hàng:", error); }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isLogin) return openAlerBox("error", "Vui lòng đăng nhập để mua hàng.");
    try {
      const payload = {
        productId: product._id, quantity, productTitle: product.name,
        image: product.images[0], price: product.price
      };
      const result = await postData('/api/cart/add', payload);
      if (result.success) {
        await fetchCartData();
        setOpenCartPanel(true);
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
      } else { throw new Error(result.message); }
    } catch (error) { openAlerBox("error", error.message || "Thêm sản phẩm thất bại."); }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const result = await deleteData(`/api/cart/${cartItemId}`);
      if (result.success) {
        await fetchCartData();
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
      } else { throw new Error(result.message); }
    } catch (error) { openAlerBox("error", error.message || "Xóa sản phẩm thất bại."); }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(cartItemId);
    try {
      const result = await postData('/api/cart/update-quantity', { cartItemId, newQuantity });
      if (result.success) {
        await fetchCartData();
      } else { throw new Error(result.message); }
    } catch (error) { openAlerBox("error", error.message || "Cập nhật số lượng thất bại."); }
  };


  // ====================================================================
  // ===               LOGIC DANH SÁCH YÊU THÍCH (WISHLIST)             ===
  // ====================================================================

  const addToWishlist = async (product) => {
    if (!isLogin) return openAlerBox("error", "Vui lòng đăng nhập.");
    try {
      const payload = {
        productId: product._id, productTitle: product.name, image: product.images?.[0] || '',
        rating: product.rating || 0, price: product.price, oldPrice: product.oldPrice || 0,
        brand: product.brand || '', discount: product.discount || 0
      };
      const result = await postData('/api/mylist/add', payload);
      if (result.success && result.data) {
        const newItem = result.data;
        setWishlist(prev => [...prev, {
          wishlistId: newItem._id, productId: newItem.productId, productTitle: newItem.productTitle,
          image: newItem.image, price: newItem.price
        }]);
        toast.success("Đã thêm vào danh sách yêu thích!");
      } else { throw new Error(result.message || "Không thể thêm sản phẩm."); }
    } catch (error) { openAlerBox("error", error.message); }
  };

  const removeFromWishlist = async (productId, showToast = true) => {
    if (!isLogin) return openAlerBox("error", "Vui lòng đăng nhập.");
    const wishlistItem = wishlist.find(item => item.productId === productId);
    if (!wishlistItem) return;
    try {
      const result = await deleteData(`/api/mylist/${wishlistItem.wishlistId}`);
      if (result.success) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        if (showToast) toast.success("Đã xóa khỏi danh sách yêu thích.");
      } else { throw new Error(result.message); }
    } catch (error) { openAlerBox("error", error.message); }
  };

  const isInWishlist = (productId) => wishlist.some(item => item.productId === productId);


  // ====================================================================
  // ===                      LOGIC XÁC THỰC (AUTH)                   ===
  // ====================================================================

  const logout = useCallback(async (showToast = true) => {
    try {
      await postData('/api/user/logout', {});
    } catch (error) {
      console.error("Lỗi API đăng xuất, vẫn tiếp tục phía client:", error);
    } finally {
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      setIsLogin(false);
      setUserData(null);
      setCart([]);
      setWishlist([]);
      if (showToast) toast.success("Đăng xuất thành công!");
    }
  }, []);

  // --- SIDE EFFECTS ---

  // Tải dữ liệu người dùng (giỏ hàng, wishlist) khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    if (isLogin) {
      Promise.all([
        fetchDataFromApi(`/api/user/user-details`),
        fetchDataFromApi(`/api/mylist/`),
        fetchDataFromApi(`/api/cart/`)
      ]).then(([userRes, wishlistRes, cartRes]) => {
        if (!userRes.success) {
          console.error("Token không hợp lệ. Tự động đăng xuất.");
          return logout(false);
        }
        setUserData(userRes.data);
        if (wishlistRes.success) setWishlist(wishlistRes.data.map(item => ({
          wishlistId: item._id, productId: item.productId, productTitle: item.productTitle,
          image: item.image, price: item.price
        })));
        if (cartRes.success) setCart(cartRes.data.map(item => ({
          _id: item.productId, cartItemId: item._id, quantity: item.quantity,
          name: item.productTitle, images: [item.image], price: item.price
        })));
      }).catch(error => {
        console.error("Lỗi khi lấy dữ liệu, tự động đăng xuất:", error);
        logout(false);
      });
    }
  }, [isLogin, logout]);

  // Kiểm tra token khi ứng dụng tải lần đầu
  useEffect(() => {
    if (localStorage.getItem('accesstoken')) {
      setIsLogin(true);
    }
  }, []);


  // ====================================================================
  // ===                    CUNG CẤP GIÁ TRỊ CONTEXT                  ===
  // ====================================================================
  const contextValue = useMemo(() => ({
    // UI State & Handlers
    openCartPanel,
    openProductDetailModel,
    setOpenCartPanel,
    toggleCartPanel,
    setOpenProductDetailModel,
    setProductDataForModel,
    openAlerBox,

    // Auth State & Handlers
    isLogin,
    userData,
    setIsLogin,
    setUserData,
    logout,

    // Cart State & Handlers
    cart,
    fetchCartData,
    addToCart,
    removeFromCart,
    updateQuantity,

    // Wishlist State & Handlers
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,

    // Product Filter State & Handlers
    productFilters,
    applyFilterAndNavigate,

  }), [isLogin, userData, cart, openCartPanel, wishlist, productFilters, logout, applyFilterAndNavigate]);

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}


// ====================================================================
// ===                      COMPONENT APP CHÍNH                     ===
// ====================================================================
// Component App giờ đây rất gọn gàng, chỉ chịu trách nhiệm về routing và layout
function App() {
  const [maxWidth] = useState('lg');
  const [fullWidth] = useState(true);

  // Component con để quản lý Dialog, giúp App gọn hơn
  const DialogManager = () => {
    const { openProductDetailModel = false, setOpenProductDetailModel, productDataForModel } = useContext(MyContext);
    const handleCloseProductModel = () => setOpenProductDetailModel(false);

    return (
      <Dialog
        fullWidth={fullWidth} maxWidth={maxWidth} open={openProductDetailModel}
        onClose={handleCloseProductModel} className='product-Detail-Model'
      >
        <DialogContent>
          <div className="flex items-center w-full product-Detail-Model-conteiner relative">
            <Button
              className='!absolute !top-0 !right-0 !w-[35px] !h-[35px] !min-w-[35px] !rounded-md !text-[#000] !bg-[#f4f4f4] hover:!bg-[#ff6767] hover:!text-[#fff4f4]'
              onClick={handleCloseProductModel}
            >
              <MdOutlineCloseFullscreen className='text-[24px]' />
            </Button>
            <div className="col1 w-[38.3%] px-3">
              <ZoomProductImg images={productDataForModel?.images} />
            </div>
            <div className="col2 w-[61.7%] py-8 px-8 pr-10">
              <ProductDetailsComponets product={productDataForModel} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <BrowserRouter>
        <AppContextWrapper>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product-list" element={<ProductList />} />
              {/* Route `/category/:categoryId` đã được comment lại để tránh lỗi */}
              <Route path="/product-detail/:productId" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/view-cart" element={<Cart />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/my-account/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
            </Routes>
          </main>
          <Footer />
          <DialogManager />
        </AppContextWrapper>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;