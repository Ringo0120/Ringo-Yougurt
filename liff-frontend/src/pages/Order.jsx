import { useEffect, useState, useRef } from "react";
import liff from "@line/liff";

import BlueberryImg from "../assets/images/products/TOP - Blueberry.png";
import BrownSugarImg from "../assets/images/products/TOP - brownsugar longan.png";
import HoneyImg from "../assets/images/products/TOP - Honey.png";
import MangoImg from "../assets/images/products/TOP - Mango.png";
import OrangeImg from "../assets/images/products/TOP - Orange.png";
import PlainImg from "../assets/images/products/TOP - Plain.png";
import RaspberryImg from "../assets/images/products/TOP - Raspberry.png";
import StrawberryImg from "../assets/images/products/TOP - Strawberry.png";

const productImages = {
  "鮮奶希臘式濃縮優格": PlainImg,
  "蜂蜜脆片希臘式濃縮優格": HoneyImg,
  "藍莓希臘式濃縮優格": BlueberryImg,
  "草莓希臘式濃縮優格": StrawberryImg,
  "黑糖桂圓希臘式濃縮優格": BrownSugarImg,
  "芒果希臘式濃縮優格": MangoImg,
  "香柑希臘式濃縮優格": OrangeImg,
  "覆盆子希臘式濃縮優格": RaspberryImg,
};

const apiBase = import.meta.env.VITE_API_BASE;

export default function Order() {
  const [member, setMember] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [desiredDate, setDesiredDate] = useState("");

  const carouselRef = useRef(null);

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
      setRecipient(m.memberName || "");
      setAddress(m.address || "");

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
    (sum, [_, groups]) => sum + groups * 6,
    0
  );

  const handleSubmit = async () => {
    if (!member) return;
    try {
      const orders = {};
      Object.entries(cart).forEach(([pid, groups]) => {
        if (groups > 0) orders[pid] = groups * 6;
      });

      const today = new Date().toISOString().slice(0, 10);

      const res = await fetch(`${apiBase}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineId: member.lineId,
          recipient: recipient || member.memberName,
          address,
          orders,
          paymentMethod: "CASH",
          desiredDate: desiredDate || today,
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

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleDateChange = (e) => {
    setDesiredDate(e.target.value);
    document.getElementById("date_modal").showModal();
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">選擇商品</h2>

      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          收件人
        </label>
        <input
          type="text"
          placeholder="收件人"
          className="input input-bordered w-full"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          收貨地址
        </label>
        <input
          type="text"
          placeholder="地址"
          className="input input-bordered w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          預計收貨日期
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          min={today}
          max={maxDateStr}
          value={desiredDate}
          onChange={handleDateChange}
        />
      </div>

      <label className="block text-sm font-light text-gray-400 mb-1">
        可以左右滑動選擇商品
      </label>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="btn btn-circle absolute left-0 top-1/2 -translate-y-1/2 z-10"
        >
          ❮
        </button>

        <div
          ref={carouselRef}
          className="carousel w-full space-x-4 rounded-box overflow-x-auto scroll-smooth"
        >
          {products.map((p) => (
            <div key={p.productId} className="carousel-item w-72 flex flex-col items-center">
              <div className="w-64 h-40 flex items-center justify-center">
                <img
                  src={productImages[p.productName] || PlainImg}
                  alt={p.productName}
                  className="object-contain h-full"
                />
              </div>
              <div className="mt-2 font-semibold">{p.productName}</div>
              <div className="text-lg text-gray-500">NT$ {p.price}</div>
              <div className="text-base text-gray-400">{p.category}</div>
              <div className="flex items-center mt-2">
                <button className="btn btn-circle btn-outline" onClick={() => updateQty(p.productId, -1)}>-</button>
                <span className="mx-4 text-lg font-bold">{cart[p.productId] || 0} 組</span>
                <button className="btn btn-circle btn-outline" onClick={() => updateQty(p.productId, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="btn btn-circle absolute right-0 top-1/2 -translate-y-1/2 z-10"
        >
          ❯
        </button>
      </div>

      <dialog id="date_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">提醒</h3>
          <p className="py-4">
            預計收貨日期不代表實際配送日期，實際以物流為準。
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">了解</button>
            </form>
          </div>
        </div>
      </dialog>

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
                <td colSpan="3" className="text-center text-gray-500">尚未選擇商品</td>
              </tr>
            ) : (
              Object.entries(cart).filter(([_, g]) => g > 0).map(([pid, groups]) => {
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
        <button className="btn btn-primary rounded-2xl text-[#ece9f0]" onClick={handleSubmit}>送出訂單</button>
      </div>
    </div>
  );
}
