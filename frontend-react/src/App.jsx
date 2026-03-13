import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AddProduct from "./pages/admin/products/AddProduct.jsx";
import ProductList from "./pages/admin/products/ProductList.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Home from "./pages/shop/Home.jsx";
import ProductDetail from "./pages/shop/ProductDetail.jsx";
import Cart from "./pages/shop/Cart.jsx";
import OrderHistory from "./pages/customer/OrderHistory.jsx";
import OrderList from "./pages/admin/orders/OrderList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
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
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/cart",
    element: <Cart/>,
  },
  {
    path: "/history",
    element: <OrderHistory/>,
  },
  {
   path: "/products/:id",
   element: <ProductDetail/>,
  },
  {
    path: "/admin/products",
    element: <ProductList />,
  },
  {
    path: "/admin/products/add",
    element: <AddProduct />,
  },{
    path: "/admin/orders",
    element: <OrderList />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
