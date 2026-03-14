import { productApi } from "../../api/product.api.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productApi.getAll()
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isAdmin ? <AdminNavbar /> : <Navbar />}

      {/* Hero */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            {isAdmin ? "แผงควบคุมผู้ดูแลระบบ 🛠️" : "ยินดีต้อนรับสู่ MiniShop 🛍️"}
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            {isAdmin ? "จัดการสินค้าและออเดอร์ทั้งหมดในที่เดียว" : "สินค้าคุณภาพดี ราคาเป็นมิตร จัดส่งทั่วประเทศ"}
          </p>
          {/* Search */}
          <div className="w-full max-w-md relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              type="text" placeholder="ค้นหาสินค้าหรือหมวดหมู่..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 text-sm outline-none shadow-lg placeholder:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8l-1 4h10l-1-4z" />
            </svg>
            <p className="text-sm">ไม่พบสินค้าที่ค้นหา</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">แสดง {filtered.length} รายการ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer">
                  {/* Image */}
                  <div className="relative overflow-hidden h-48 bg-gray-100">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-white/90 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    {product.stock === 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">หมด</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h2>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 font-bold text-base">฿{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">เหลือ {product.stock} ชิ้น</span>
                    </div>
                    <button className={`mt-3 w-full py-2 text-sm font-medium rounded-xl transition-colors ${
                      isAdmin 
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    }`}>
                      {isAdmin ? "จัดการ/ดูข้อมูล" : "ดูรายละเอียด"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
