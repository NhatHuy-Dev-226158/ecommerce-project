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
import AddProductPage from './Pages/CreateProduct/createProduct';
import OrderListPage from './Pages/Order/OrderListPage';
import OrderDetailPage from './Pages/Order/OrderDetailPage';

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

  const values = {
    isSidebarOpen,
    isLogin,
    setIsSidebarOpen,
    setIslogin
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
          path: "/product-lisst",
          element: <ProductsTable />,
        }, {
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
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
    </MyContext.Provider>
  );
}

export default App;
export { MyContext };