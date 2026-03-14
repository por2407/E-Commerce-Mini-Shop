import Navbar from "../../components/Navbar.jsx";
import { orderApi } from "../../api/order.api.js";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/orders");
    }
  }, [user, navigate]);


  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getByUser(user._id);
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user?._id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { label: 'ยืนยันแล้ว', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: 'M5 13l4 4L19 7' };
      case 'delivered':
        return { label: 'จัดส่งแล้ว', color: 'text-green-600 bg-green-50 border-green-100', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' };
      case 'cancelled':
        return { label: 'ยกเลิกแล้ว', color: 'text-red-600 bg-red-50 border-red-100', icon: 'M6 18L18 6M6 6l12 12' };
      default:
        return { label: 'รอดำเนินการ', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ประวัติการสั่งซื้อ</h1>
            <p className="text-slate-500 mt-1">ติดตามสถานะและดูประวัติการสั่งซื้อทั้งหมดของคุณ</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">กำลังโหลดรายการ...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">คุณยังไม่มีประวัติการสั่งซื้อ</h2>
            <p className="text-slate-500 mb-8">เมื่อคุณสั่งซื้อสินค้า รายการจะปรากฏที่นี่</p>
            <Link to="/home" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200">
              ไปที่หน้าหลัก
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => {
              const status = getStatusInfo(order.status);
              return (
                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                  {/* Order Header */}
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        #{order._id.slice(-8)}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
                      </svg>
                      {status.label}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            <img src={item.product?.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{item.product?.name}</h4>
                            <p className="text-slate-500 text-xs">฿{item.product?.price?.toLocaleString()} × {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">฿{(item.product?.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-slate-500 text-sm">รวมรายการสั่งซื้อทั้งหมด</div>
                      <div className="text-xl font-extrabold text-indigo-600">
                        ฿{order.total?.toLocaleString() || order.items.reduce((sum, i) => sum + (i.product?.price * i.quantity), 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

