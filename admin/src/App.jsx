import React, { createContext, useState, useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import './App.css';
import toast, { Toaster } from 'react-hot-toast';
import { fetchDataFromApi } from './utils/api';
import { io } from "socket.io-client";

// --- Layout Components ---
import Header from './componets/Header';
import Sidebar from './componets/Sidebar';

// --- Page Components  ---
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Verify from './Pages/Verify';
import ForgotPassword from './Pages/ForgotPassword';
import ProfilePage from './Pages/ProfileContent';
import Products from './Pages/Products/products';
import AddProductPage from './Pages/Products/createProduct';
import ProductDetailPage from './Pages/Products/ProductDetailPage';
import EditProductPage from './Pages/Products/EditProductPage';
import OrderListPage from './Pages/Order/OrderListPage';
import OrderDetailPage from './Pages/Order/OrderDetailPage';
import AddCategoryPage from './Pages/Category/AddCategoryPage';
import CategoryListPage from './Pages/Category/CategoryListPage';
import EditCategoryPage from './Pages/Category/EditCategoryPage';
import UserListPage from './Pages/Users/UserListPage';
import EditUserPage from './Pages/Users/EditUserPage';
import AddBannerPage from './Pages/Banner/AddBannerPage';
import BannerListPage from './Pages/Banner/BannerListPage';
import EditBannerPage from './Pages/Banner/EditBannerPage';
import BlogFormPage from './Pages/Blog/BlogFormPage';
import BlogListPage from './Pages/Blog/BlogListPage';

const MyContext = createContext();

// 2. COMPONENT LAYOUT 
const RootLayout = () => {
  const { isSidebarOpen } = useContext(MyContext);
  return (
    <main className='relative bg-gray-50 min-h-screen w-full overflow-hidden'>
      <Sidebar />
      <div className={`content-wrapper transition-all duration-300 ease-in-out w-full ${isSidebarOpen ? 'md:pl-72' : 'md:pl-0'}`}>
        <Header />
        <div className="content-Right py-4 px-5">
          <Outlet />
        </div>
      </div>
    </main>
  );
};


const ProtectedRoute = () => {
  const { isLogin, authLoading } = useContext(MyContext);
  if (authLoading) {
    return <div>Loading Authentication...</div>;
  }
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }
  return <RootLayout />;
};

// 3. COMPONENT CHÍNH
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLogin, setIslogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  const openAlerBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem('accesstoken');
      if (!token) {
        setIslogin(false);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetchDataFromApi(`/api/user/user-details`);
        if (res.success) {
          setIslogin(true);
          setUserData(res.data);
        } else {
          setIslogin(false);
          setUserData(null);
          localStorage.removeItem("accesstoken");
          localStorage.removeItem("refreshtoken");
        }
      } catch (error) {
        setIslogin(false);
        setUserData(null);
      } finally {
        setAuthLoading(false);
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    if (isLogin && (userData?.role === 'ADMIN' || userData?.role === 'STAFF')) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.on('new_order_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        toast.success(notification.message, { icon: '🔔', duration: 5000 });
      });

      return () => newSocket.close();
    }
  }, [isLogin, userData]);


  const values = {
    isSidebarOpen, isLogin, userData, authLoading, notifications,
    setIsSidebarOpen, setIslogin, setUserData, setNotifications,
    openAlerBox,
  };

  // Định nghĩa router (đầy đủ)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "/banner-list", element: <BannerListPage /> },
        { path: "/add-banner", element: <AddBannerPage /> },
        { path: "/edit-banner/:bannerId", element: <EditBannerPage /> },
        { path: "users", element: <UserListPage /> },
        { path: "edit-user/:userId", element: <EditUserPage /> },
        { path: "category-list", element: <CategoryListPage /> },
        { path: "add-category", element: <AddCategoryPage /> },
        { path: "edit-category/:categoryId", element: <EditCategoryPage /> },
        { path: "product-list", element: <Products /> },
        { path: "product-upload", element: <AddProductPage /> },
        { path: "/product/:productId", element: <ProductDetailPage /> },
        { path: "/edit-product/:productId", element: <EditProductPage /> },
        { path: "orders", element: <OrderListPage /> },
        { path: "/admin/orders/:orderId", element: <OrderDetailPage /> },
        { path: "/admin/blogs", element: <BlogListPage /> },
        { path: "/admin/blogs/new", element: <BlogFormPage /> },
        { path: "/admin/blogs/edit/:id", element: <BlogFormPage /> },
        { path: "profile", element: <ProfilePage /> },
      ]
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify", element: <Verify /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </MyContext.Provider>
  );
}

export default App;
export { MyContext };