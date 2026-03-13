import Navbar from "../../components/Navbar.jsx";
import { orderApi } from "../../api/order.api.js";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.js";
import useCartStore from "../../store/cartStore.js";

export default function Cart() {
  const { user } = useAuthStore();
  const { cartItems, removeFromCart } = useCartStore();

  async function handleCheckout(item) {
    if (cartItems.length === 0) return;
    try {
      await orderApi.create({
        userId: user._id,
        items: [{ product: item._id, quantity: item.quantity }],
      }).then(() =>{
        removeFromCart(item._id);
        console.log("Checkout successful");
      }).catch((err) => {
        console.error(err);
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h1>
        <p>นี่คือหน้าตะกร้าสินค้าของคุณ</p>

        {cartItems.length === 0 ? (
          <p>ตะกร้าสินค้าว่าง</p>
        ) : (
          <div className="mt-6 bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-32 h-32 object-cover mb-4"
                />
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500">ราคา: ฿{item.price}</p>
                <p className="text-gray-500">จำนวน: {item.quantity}</p>
                <p className="text-gray-800 font-bold">
                  รวม: ฿{item.price * item.quantity}
                </p>
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => handleCheckout(item)} className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    ชำระเงิน
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    ลบจากตะกร้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
