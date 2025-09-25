import { useEffect, useState } from "react";
import liff from "@line/liff";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Profile() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        await liff.ready;
        const profile = await liff.getProfile();
        const lineId = profile.userId;

        const res = await fetch(`${apiBase}/api/members/by-line/${lineId}`);
        if (!res.ok) throw new Error("查無會員");
        const data = await res.json();
        setInfo(data);
      } catch (err) {
        console.error("查詢會員失敗：", err);
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  if (loading) return <div className="text-center mt-12">載入中...</div>;

  if (!info) return <div className="text-center mt-12 text-red-500">查無會員資訊</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-base-200 p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white border border-gray-300 mb-4"></div>
        <h2 className="text-xl font-bold mb-1">{info.memberName}</h2>
        <p className="text-sm text-gray-500 mb-4">📱 {info.phone}</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>訂購方案</span>
          <span className="font-semibold">{info.orderType || "－"}</span>
        </div>
        <div className="flex justify-between">
          <span>餘額</span>
          <span className="font-semibold">${info.balance}</span>
        </div>
        <div className="flex justify-between">
          <span>剩餘運送次數</span>
          <span className="font-semibold">{info.remainDelivery}</span>
        </div>
        <div className="flex justify-between">
          <span>剩餘免運次數</span>
          <span className="font-semibold">{info.remainFreeQuota}</span>
        </div>
      </div>
    </div>
  );
}
