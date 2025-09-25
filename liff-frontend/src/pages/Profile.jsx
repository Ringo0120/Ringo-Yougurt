import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { memberId } = useParams();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/members/${memberId}`);
        if (!res.ok) throw new Error("找不到會員資料");
        const data = await res.json();
        setInfo(data);
      } catch (err) {
        console.error(err);
        setInfo(null);
      }
    };

    fetchMember();
  }, [memberId]);

  if (!info) {
    return <div className="text-center mt-12">載入中...</div>;
  }

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
