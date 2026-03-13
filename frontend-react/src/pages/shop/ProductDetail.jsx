import { useParams, useNavigate } from "react-router-dom";
import { productApi } from "../../api/product.api.js";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.js";
import Navbar from "../../components/Navbar.jsx";
import useCartStore from "../../store/cartStore.js";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    productApi
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    setOrderLoading(true);
    try {
      addToCart(product, quantity);
      showToast("success", "เพิ่มลงในตะกร้าเรียบร้อยแล้ว!");
      navigate("/cart");
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
      );
    } finally {
      setOrderLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <button
            onClick={() => navigate("/home")}
            className="hover:text-indigo-600 transition-colors"
          >
            หน้าแรก
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-600">
            {product?.name ?? "รายละเอียดสินค้า"}
          </span>
        </div>

        {!product ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="w-8 h-8 animate-spin text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="bg-gray-50 flex items-center justify-center min-h-72 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover max-h-96"
                  />
                ) : (
                  <div className="text-gray-300 flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                    <span className="text-sm">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {product.category}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    {product.name}
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-extrabold text-indigo-600">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">/ ชิ้น</span>
                  </div>

                  {/* Stock badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <span
                      className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-400"}`}
                    />
                    <span className="text-sm text-gray-500">
                      {product.stock > 0
                        ? `มีสินค้า ${product.stock} ชิ้น`
                        : "สินค้าหมด"}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm font-medium text-gray-700">
                        จำนวน
                      </span>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                        >
                          −
                        </button>
                        <span className="w-12 text-center text-sm font-semibold text-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity((q) => Math.min(product.stock, q + 1))
                          }
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total + Action */}
                <div className="space-y-3">
                  {product.stock > 0 && (
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">รวมทั้งหมด</span>
                      <span className="text-xl font-bold text-gray-800">
                        ฿{(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || orderLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {orderLoading ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        กำลังเพิ่ม...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7A1 1 0 007 17h10m0 0a2 2 0 100 4 2 2 0 000-4zm-10 0a2 2 0 100 4 2 2 0 000-4z"
                          />
                        </svg>
                        {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full py-2.5 text-sm text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    ← กลับ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
