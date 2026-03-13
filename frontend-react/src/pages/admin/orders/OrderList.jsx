import { orderApi } from "../../../api/order.api";
import { useState, useEffect } from "react";
export default function OrderList() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAll();
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">รายการสั่งซื้อ</h1>
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">รหัสคำสั่งซื้อ</th>
              <th className="px-4 py-2">ลูกค้า</th>
              <th className="px-4 py-2">วันที่</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2">รวม</th>
              <th className="px-4 py-2">action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={`${index}-${order._id}`}>
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{order.name}</td>
                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">{order.total}</td>
                <td className="border px-4 py-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    ดูรายละเอียด
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
