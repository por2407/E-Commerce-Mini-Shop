import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navLinks = [
    { name: "จัดการสินค้า", path: "/admin/products" },
    { name: "จัดการคำสั่งซื้อ", path: "/admin/orders" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/admin/products" className="flex items-center gap-2 font-bold text-indigo-600 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            MiniShop Admin
          </Link>

          {/* Admin Routes Only */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  location.pathname === link.path
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors"
          >
            ← กลับหน้าร้าน
          </Link>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
}
