import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }


  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2 font-bold text-indigo-600 text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          MiniShop
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/home"
            className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            หน้าแรก
          </Link>
          
          {/* ซ่อน ตะกร้า และ ประวัติ สำหรับ Admin */}
          {user?.role !== "admin" && (
            <>
              <Link to="/cart"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                ตะกร้าสินค้า
              </Link>
              <Link to="/history"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                รายการสั่งซื้อ
              </Link>
            </>
          )}

          {user?.role === "admin" && (

            <>
              <Link to="/admin/products"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                จัดการสินค้า
              </Link>
              <Link to="/admin/orders"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                รายการสั่งซื้อ (Admin)
              </Link>
            </>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link to="/login"
              className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
