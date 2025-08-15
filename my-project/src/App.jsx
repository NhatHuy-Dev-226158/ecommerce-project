import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './componets/Header'
import Home from './Pages/Home'
import Footer from './componets/Footer'
import ProductList from './Pages/ProductList'
import ProductDetails from './Pages/ProductDetails'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ZoomProductImg from './componets/ZoomProductImg/Zoomquickview'
import { MdOutlineCloseFullscreen } from "react-icons/md";
import ProductDetailsComponets from './componets/ProductDetails/inddex'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Cart from './componets/Cart'
import Verify from './Pages/Verify'
import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './Pages/ForgotPassword'
import CheckoutPage from './Pages/Checkout'
import MyAccount from './Pages/MyAccount'
import { deleteData, fetchDataFromApi, postData } from './utils/api'



const MyContext = createContext();

function App() {
  const [maxWidth, setMaxWidth] = useState('lg');
  const [fullWidth, setFullWidth] = useState(true);
  const [openProductDetailModel, setOpenProductDetailModel] = useState(false);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [productDataForModel, setProductDataForModel] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // --- CÁC HÀM MỚI ĐỂ QUẢN LÝ GIỎ HÀNG ---
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);

      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: quantity }];
      }
    });
    setOpenCartPanel(true);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
    toast.error("Đã xóa sản phẩm khỏi giỏ hàng.");
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // --- CÁC HÀM QUẢN LÝ WISHLIST ---
  const addToWishlist = async (product) => {
    if (!isLogin) return openAlerBox("error", "Vui lòng đăng nhập.");
    try {
      const result = await postData('/api/mylist/add', {
        productId: product._id, productTitle: product.name, image: product.images?.[0] || '',
        rating: product.rating || 0, price: product.price, oldPrice: product.oldPrice || 0,
        brand: product.brand || '', discount: product.discount || 0
      });
      if (result.success) {
        const wishlistRes = await fetchDataFromApi(`/api/mylist/`);
        if (wishlistRes.success) {
          setWishlist(wishlistRes.data.map(item => ({ productId: item.productId, wishlistId: item._id })));
        }
        toast.success("Đã thêm vào danh sách yêu thích!");
      } else { throw new Error(result.message); }
    } catch (error) { openAlerBox("error", error.message); }
  };

  const removeFromWishlist = async (productId) => {
    if (!isLogin) return openAlerBox("error", "Vui lòng đăng nhập.");

    const wishlistItem = wishlist.find(item => item.productId === productId);
    if (!wishlistItem) return;

    try {
      const result = await deleteData(`/api/mylist/${wishlistItem.wishlistId}`);
      if (result.success) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
      } else { throw new Error(result.message); }
    } catch (error) { openAlerBox("error", error.message); }
  };

  const isInWishlist = (productId) => wishlist.some(item => item.productId === productId);

  const toggleCartPanel = (isOpen) => () => {
    setOpenCartPanel(isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      setIsLogin(true);
      Promise.all([
        fetchDataFromApi(`/api/user/user-details`),
        fetchDataFromApi(`/api/mylist/`)
      ]).then(([userRes, wishlistRes]) => {
        if (userRes.success) {
          setUserData(userRes.data);
        } else {
          localStorage.removeItem("accesstoken");
          localStorage.removeItem("refreshtoken");
          setIsLogin(false);
        }
        if (wishlistRes.success) {
          const wishlistData = wishlistRes.data.map(item => ({
            wishlistId: item._id,
            productId: item.productId,
            productTitle: item.productTitle,
            image: item.image,
            price: item.price,
          }));
          setWishlist(wishlistData);
        }
      }).catch(error => {
        console.error("Authentication Error:", error);
        setIsLogin(false);
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);


  const handleClose = () => {
    setOpenProductDetailModel(false);
    setProductDataForModel(null);
  };

  const openAlerBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  }

  const values = useMemo(() => ({
    setOpenProductDetailModel,
    setOpenCartPanel,
    toggleCartPanel,
    openAlerBox,
    setIsLogin,
    isLogin,
    openCartPanel,
    userData,
    setUserData,
    setProductDataForModel,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }), [isLogin, userData, cart, openCartPanel, wishlist]);

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route path={"/product-list"} exact={true} element={<ProductList />} />
            <Route path={"/product-detail/:productId"} exact={true} element={<ProductDetails />} />
            <Route path={"/login"} exact={true} element={<Login />} />
            <Route path={"/register"} exact={true} element={<Register />} />
            <Route path={"/view-cart"} exact={true} element={<Cart />} />
            <Route path={"/verify"} exact={true} element={<Verify />} />
            <Route path={"/forgot-password"} exact={true} element={<ForgotPassword />} />
            <Route path={"/checkout"} exact={true} element={<CheckoutPage />} />
            <Route path={"/my-account"} exact={true} element={<MyAccount />} />

          </Routes>
          <Footer></Footer>
        </MyContext.Provider>

      </BrowserRouter>

      <Toaster />

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openProductDetailModel}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='product-Detail-Model'
      >

        <DialogContent>
          <div className="flex items-center w-full product-Detail-Model-conteiner relative">
            <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-md 
            !text-[#000] !absolute top-[0px] right-[0px] !bg-[#f4f4f4] hover:!bg-[#ff6767] hover:!text-[#fff4f4]'
              onClick={handleClose}>
              <MdOutlineCloseFullscreen className='text-[24px]' />
            </Button>
            <div className="col1 w-[38.3%] px-3">
              <ZoomProductImg images={productDataForModel?.images} />
            </div>

            <div className="col2  w-[61.7%] py-8 px-8 pr-10">
              <ProductDetailsComponets product={productDataForModel} />
            </div>
          </div>
        </DialogContent>

      </Dialog>


      <Toaster></Toaster>
    </>
  )
}

export default App

export { MyContext }