import Navbar from "../../components/Navbar.jsx";
import { orderApi } from "../../api/order.api.js";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.js";

export default function OrderHistory() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const Cart = async () => {
    try {
      const response = await orderApi.getByUser(user._id);
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Cart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">ประวัติการสั่งซื้อ</h1>
        <p>นี่คือหน้าประวัติการสั่งซื้อของคุณ</p>
      </div>

      <table className="w-full mt-6 bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ลำดับ</th>
            <th className="p-3">สินค้า</th>
            <th className="p-3">ราคา</th>
            <th className="p-3">จำนวน</th>
            <th className="p-3">รวม</th>
            <th className="p-3">วันที่สั่งซื้อ</th>
            <th className="p-3">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                ไม่มีสินค้าในตะกร้า
              </td>
            </tr>
          ) : (
            orders.map((order, index) =>
              order.items.map((item, itemIndex) => (
                <tr key={`${index}-${itemIndex}`} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.product.name}</td>
                  <td className="p-3">฿{item.product.price}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">฿{item.quantity * item.product.price}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">
                    {order.status === "pending" && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        รอดำเนินการ
                      </span>
                    )}
                    {order.status === "completed" && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        เสร็จสิ้น
                      </span>
                    )}
                    {order.status === "canceled" && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        ยกเลิก
                      </span>
                    )}
                  </td>
                </tr>
              )),
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
