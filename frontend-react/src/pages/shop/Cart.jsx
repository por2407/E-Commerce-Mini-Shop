import Navbar from "../../components/Navbar.jsx";
import { orderApi } from "../../api/order.api.js";
import { useState, useEffect } from "react";
import useCartStore from "../../store/cartStore.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/products");
    }
  }, [user, navigate]);


  async function handleCheckout(item) {
    if (isProcessing) return;

    setIsProcessing(item._id);
    try {
      const orderData = {
        items: [{ product: item._id, quantity: item.quantity }],
      };

      await orderApi.create(orderData);
      removeFromCart(item._id);
      navigate("/history");
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setIsProcessing(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ตะกร้าสินค้า
              </h1>
              <span className="text-slate-500 font-medium">
                {cartItems.length} รายการ
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  ตะกร้าของคุณยังว่างเปล่า
                </h2>
                <p className="text-slate-500 mb-8">
                  เริ่มเลือกช้อปสินค้าที่คุณชอบได้เลย!
                </p>
                <Link
                  to="/home"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
                >
                  ไปที่หน้าสินค้า
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md group"
                  >
                    <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">
                        ราคา: ฿{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                          จำนวน: {item.quantity}
                        </span>
                        <p className="font-bold text-indigo-600">
                          รวม: ฿{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleCheckout(item)}
                        disabled={isProcessing === item._id}
                        className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                          isProcessing === item._id
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                        }`}
                      >
                        {isProcessing === item._id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          "ชำระเงิน"
                        )}
                      </button>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                        title="ลบออกจากตะกร้า"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



