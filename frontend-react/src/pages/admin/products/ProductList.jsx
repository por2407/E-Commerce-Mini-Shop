import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../api/product.api.js";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  function fetchProducts() {
    setLoading(true);
    productApi.getAll()
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleDelete(id, name) {
    if (!confirm(`ลบสินค้า "${name}" ใช่หรือไม่?`)) return;
    setDeleting(id);
    try {
      await productApi.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-indigo-600 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            MiniShop Admin
          </div>
          <button onClick={() => navigate("/home")} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">← กลับหน้าร้าน</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="📦" label="สินค้าทั้งหมด" value={`${products.length} รายการ`} color="indigo" />
          <StatCard icon="⚠️" label="สินค้าหมด" value={`${outOfStock} รายการ`} color="red" />
          <StatCard icon="💰" label="มูลค่าสต็อกรวม" value={`฿${totalValue.toLocaleString()}`} color="green" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="relative w-full sm:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              type="text" placeholder="ค้นหาสินค้า..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300" />
          </div>
          <button onClick={() => navigate("/admin/products/add")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            เพิ่มสินค้า
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <svg className="w-7 h-7 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8l-1 4h10l-1-4z" />
              </svg>
              <p className="text-sm">{search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้าในระบบ"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="px-4 py-3 text-left">สินค้า</th>
                    <th className="px-4 py-3 text-left">หมวดหมู่</th>
                    <th className="px-4 py-3 text-right">ราคา</th>
                    <th className="px-4 py-3 text-right">สต็อก</th>
                    <th className="px-4 py-3 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            {product.imageUrl
                              ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">?</div>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">{product.category}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">฿{product.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          product.stock === 0 ? "bg-red-50 text-red-500"
                          : product.stock < 10 ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600"
                        }`}>{product.stock} ชิ้น</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deleting === product._id}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
                            {deleting === product._id
                              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                              : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    red: "bg-red-50 text-red-500",
    green: "bg-green-50 text-green-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <span className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${colors[color]}`}>{icon}</span>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

