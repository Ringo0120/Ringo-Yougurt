import { useEffect, useState } from "react";
import liff from "@line/liff";
import { Link, useNavigate } from "react-router-dom";
import OrderCarousel from "../components/OrderCarousel";
import LoadingOverlay from "../components/LoadingOverlay";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Cart() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        const resMember = await fetch(`${apiBase}/api/members/login-or-bind`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineId,
            displayName: profile.displayName,
            address: "",
          }),
        });
        if (!resMember.ok) throw new Error("查無會員");
        const data = await resMember.json();
        const member = data.member;

        if (!member.memberName || !member.phone || !member.address) {
          navigate("/profile", { state: { forceEdit: true } });
          return;
        }

        const resOrders = await fetch(`${apiBase}/api/orders/by-member/${member.memberId}`);
        if (!resOrders.ok) throw new Error("查無訂單");
        const orderData = await resOrders.json();
        setOrders(orderData);
      } catch (err) {
        console.error("查詢訂單失敗：", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 relative">
      <LoadingOverlay show={loading} />
      {!loading && (
        <>
          <h2 className="text-xl font-bold mb-4">我的訂單</h2>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500">尚無訂單</div>
          ) : (
            <OrderCarousel orders={orders} />
          )}
          <Link
            to="/order"
            className="btn btn-circle btn-primary fixed bottom-6 right-6 shadow-lg text-[#ece9f0]"
          >
            +
          </Link>
        </>
      )}
    </div>
  );
}
