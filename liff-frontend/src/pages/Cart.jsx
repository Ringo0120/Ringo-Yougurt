import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import liff from "@line/liff";
import OrderCard from "../components/OrderCard";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Cart() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await liff.ready;
                if (!liff.isLoggedIn()) {
                    liff.login();
                    return;
                }
                const profile = await liff.getProfile();
                const lineId = profile.userId;

                const resMember = await fetch(`${apiBase}/api/members/by-line/${lineId}`);
                if (!resMember.ok) throw new Error("查無會員");
                const member = await resMember.json();

                const resOrders = await fetch(`${apiBase}/api/orders/by-member/${member.memberId}`);
                if (!resOrders.ok) throw new Error("查無訂單");
                const data = await resOrders.json();
                setOrders(data);
            } catch (err) {
                console.error("查詢訂單失敗：", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center mt-12">載入中...</div>;

    return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-xl font-bold mb-4">我的訂單</h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">尚無訂單</div>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, idx) => (
              <OrderCard key={order.orderId} order={order} index={idx} />
            ))}
          </div>

          <div className="md:hidden">
            <div className="carousel w-full space-x-4 rounded-box">
              {orders.map((order, idx) => (
                <div key={order.orderId} className="carousel-item">
                  <OrderCard order={order} index={idx} isCompact />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
