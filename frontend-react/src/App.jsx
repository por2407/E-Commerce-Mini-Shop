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
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
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
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <OrderHistory />
      </ProtectedRoute>
    ),
  },
  {
   path: "/products/:id",
   element: <ProductDetail/>,
  },
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute adminOnly={true}>
        <ProductList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/add",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute adminOnly={true}>
        <OrderList />
      </ProtectedRoute>
    ),
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
