import { useEffect, useState } from "react";
import liff from "@line/liff";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Order() {
  const [member, setMember] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const init = async () => {
      await liff.ready;
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }
      const profile = await liff.getProfile();
      const lineId = profile.userId;

      const resMember = await fetch(`${apiBase}/api/members/by-line/${lineId}`);
      if (!resMember.ok) return;
      const m = await resMember.json();
      setMember(m);

      const resProd = await fetch(`${apiBase}/api/products`);
      if (!resProd.ok) return;
      const data = await resProd.json();
      setProducts(data);
    };
    init();
  }, []);

  const updateQty = (pid, delta) => {
    setCart((prev) => {
      const next = { ...prev, [pid]: Math.max((prev[pid] || 0) + delta, 0) };
      return next;
    });
  };

  const totalCount = Object.entries(cart).reduce(
    (sum, [pid, groups]) => sum + groups * 6,
    0
  );

  const handleSubmit = async () => {
    if (!member) return;
    try {
      const orders = {};
      Object.entries(cart).forEach(([pid, groups]) => {
        if (groups > 0) orders[pid] = groups * 6;
      });
      const res = await fetch(`${apiBase}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineId: member.lineId,
          recipient: member.memberName,
          address: "台北市某某路100號",
          orders,
          paymentMethod: "CASH",
          desiredDate: new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      alert("下訂成功！");
    } catch (err) {
      console.error("下訂失敗:", err);
      alert("下訂失敗，請稍後再試。");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">選擇商品</h2>

      <div className="carousel rounded-box space-x-4">
        {products.map((p) => (
          <div key={p.productId} className="carousel-item flex flex-col items-center">
            <div className="w-64 h-40 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">圖片待補</span>
            </div>
            <div className="mt-2 font-semibold">{p.productName}</div>
            <div className="flex items-center mt-2">
              <button
                className="btn btn-circle btn-outline"
                onClick={() => updateQty(p.productId, -1)}
              >
                -
              </button>
              <span className="mx-4 text-lg font-bold">{cart[p.productId] || 0} 組</span>
              <button
                className="btn btn-circle btn-outline"
                onClick={() => updateQty(p.productId, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>商品</th>
              <th>組數</th>
              <th>數量 (顆)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cart).filter(([_, g]) => g > 0).length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500">
                  尚未選擇商品
                </td>
              </tr>
            ) : (
              Object.entries(cart)
                .filter(([_, g]) => g > 0)
                .map(([pid, groups]) => {
                  const prod = products.find((p) => p.productId === pid);
                  return (
                    <tr key={pid}>
                      <td>{prod ? prod.productName : pid}</td>
                      <td>{groups}</td>
                      <td>{groups * 6}</td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-lg font-bold">總數量: {totalCount}</div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          送出訂單
        </button>
      </div>
    </div>
  );
}
