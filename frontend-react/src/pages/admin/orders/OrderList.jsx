import { orderApi } from "../../../api/order.api";
import { useState, useEffect } from "react";
import AdminNavbar from "../../../components/AdminNavbar.jsx";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAll();
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function handleUpdateStatus(orderId, status) {
    try {
      await orderApi.updateStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'delivered': return 'จัดส่งแล้ว';
      case 'cancelled': return 'ยกเลิกแล้ว';
      default: return 'รอดำเนินการ';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">จัดการรายการสั่งซื้อ</h1>
            <p className="text-slate-500 mt-1">ดูและอัปเดตสถานะการสั่งซื้อของลูกค้าทั้งหมด</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            รีเฟรชข้อมูล
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">ไม่มีรายการสั่งซื้อ</h3>
            <p className="text-slate-500">ยังไม่มีข้อมูลการสั่งซื้อในระบบขณะนี้</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">รหัสคำสั่งซื้อ</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">ลูกค้า</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">วันที่-เวลา</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">ยอดรวม</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          #{order._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{order.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-indigo-600">฿{order.total?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1">
                          {order.status !== 'confirmed' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'confirmed')} 
                              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-bold text-xs"
                              title="ยืนยันการสั่งซื้อ"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              ยืนยัน
                            </button>
                          )}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'delivered')} 
                              className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all font-bold text-xs"
                              title="เปลี่ยนเป็นจัดส่งแล้ว"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              ส่งแล้ว
                            </button>
                          )}
                          {order.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'cancelled')} 
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-xs"
                              title="ยกเลิกออเดอร์"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              ยกเลิก
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

