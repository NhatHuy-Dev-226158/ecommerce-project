import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './componets/Header'
import Home from './Pages/Home'
import Footer from './componets/Footer'
import ProductList from './Pages/ProductList'
import ProductDetails from './Pages/ProductDetails'
import React, { createContext, useEffect, useState } from 'react'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ZoomProductImg from './componets/ZoomProductImg'
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
import { fetchDataFromApi } from './utils/api'



const MyContext = createContext();

function App() {
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [fullWidth, setFullWidth] = React.useState(true);
  const [openProductDetailModel, setOpenProductDetailModel] = useState(false);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  const toggleCartPanel = (isOpen) => () => {
    setOpenCartPanel(isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken')
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/user-details?token=${token}`).then((res) => {
        setUserData(res.data);
        console.log(res);
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin])

  const handleClose = () => {
    setOpenProductDetailModel(false);
  };

  const openAlerBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  }

  const values = {
    setOpenProductDetailModel,
    setOpenCartPanel,
    toggleCartPanel,
    openAlerBox,
    setIsLogin,
    isLogin,
    openCartPanel,
    userData,
    setUserData
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route path={"/product-list"} exact={true} element={<ProductList />} />
            <Route path={"/product-detail/:id"} exact={true} element={<ProductDetails />} />
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
              <ZoomProductImg></ZoomProductImg>
            </div>

            <div className="col2  w-[61.7%] py-8 px-8 pr-10">
              <ProductDetailsComponets></ProductDetailsComponets>
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