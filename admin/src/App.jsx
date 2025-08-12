import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import Header from './componets/Header';
import Sidebar from './componets/Sidebar';
import Dashboard from './Pages/Dashboard';
import { createContext, useState, useContext } from 'react';
import ProductsTable from './componets/Dashboard-Products';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Products from './Pages/Products/products';
import AddProductPage from './Pages/Products/createProduct';
import OrderListPage from './Pages/Order/OrderListPage';
import OrderDetailPage from './Pages/Order/OrderDetailPage';
import toast, { Toaster } from 'react-hot-toast';
import Verify from './Pages/Verify';
import { useEffect } from 'react';
import { fetchDataFromApi } from './utils/api';
import ForgotPassword from './Pages/ForgotPassword';
import ProfilePage from './Pages/ProfileContent';
import AddCategoryPage from './Pages/Category/AddCategoryPage';
import CategoryListPage from './Pages/Category/CategoryListPage';
import EditCategoryPage from './Pages/Category/EditCategoryPage';
import UserListPage from './Pages/Users/UserListPage';
import AddUserPage from './Pages/Users/AddUserPage';

const MyContext = createContext();

// 2. COMPONENT LAYOUT
const RootLayout = () => {
  const { isSidebarOpen } = useContext(MyContext);



  return (
    <main className='relative bg-gray-50 min-h-screen w-full overflow-hidden'>
      <Sidebar />

      <div
        className={`content-wrapper transition-transform duration-300 ease-in-out w-full
        ${isSidebarOpen ? 'pl-72' : 'pl-0'}`}
      >
        <Header />
        <div className="content-Right py-4 px-5">
          <Outlet />
        </div>
      </div>
    </main>
  );
};


// 3. COMPONENT CHÍNH
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIslogin] = useState(false);
  const [userData, setUserData] = useState(null);

  const openAlerBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('accesstoken')
    if (token !== undefined && token !== null && token !== "") {
      setIslogin(true);
      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserData(res.data);
        if (res?.response?.data?.message === "Chưa đăng nhập") {
          localStorage.removeItem("accesstoken")
          localStorage.removeItem("refreshtoken")
          openAlerBox("error", "Phiên đăng nhập của bạn đã hết hạng. Vui lòng đăng nhập lại");
          window.location.href = '/login'
          setIslogin(false);
        }
      });
    } else {
      setIslogin(false);
    }
  }, [isLogin])


  const values = {
    isSidebarOpen,
    isLogin,
    setIsSidebarOpen,
    setIslogin,
    openAlerBox,
    setUserData,
    userData
  };

  // 4. CẤU HÌNH ROUTER
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/users",
          element: <UserListPage />,
        },
        {
          path: "/edit-user",
          element: <AddUserPage />,
        },
        {
          path: "/add-category",
          element: <AddCategoryPage />,
        },
        {
          path: "/list-category",
          element: <CategoryListPage />,
        },
        {
          path: "/edit-category",
          element: <EditCategoryPage />,
        }
        , {
          path: "/product-list",
          element: <Products />,
        },
        {
          path: "/product-upload",
          element: <AddProductPage />,
        },
        {
          path: "/orders",
          element: <OrderListPage />,
        },
        {
          path: "/orders-Detail",
          element: <OrderDetailPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/verify",
      element: <Verify />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },

  ]);



  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster></Toaster>
    </MyContext.Provider>
  );
}

export default App;
export { MyContext };