import { useEffect, useState } from "react";
import liff from "@line/liff";
import { Pencil } from "lucide-react";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Profile() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ memberName: "", phone: "" });
  const [showAlert, setShowAlert] = useState(false);

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
        setForm({ memberName: data.memberName, phone: data.phone || "" });
      } catch (err) {
        console.error("查詢會員失敗：", err);
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!info?.memberId) return;
    try {
      const res = await fetch(`${apiBase}/api/members/${info.memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberName: form.memberName, phone: form.phone }),
      });
      if (!res.ok) throw new Error("更新失敗");
      setShowAlert(true);
      setEditing(false);
      setInfo((prev) => ({ ...prev, ...form }));
    } catch (err) {
      console.error("更新會員失敗：", err);
      alert("更新失敗，請稍後再試。");
    }
  };

  if (loading) return <div className="text-center mt-12">載入中...</div>;

  if (!info) return <div className="text-center mt-12 text-red-500">查無會員資訊</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-base-200 p-6 rounded-lg shadow-md">
      {showAlert && (
        <div
          role="alert"
          className="alert"
          style={{ backgroundColor: "#72a2dc", color: "#e5e9f0" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>會員資料已成功更新！</span>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white border border-gray-300 mb-4"></div>

        {!editing ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{info.memberName}</h2>
              <button onClick={() => setEditing(true)}>
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">📱 {info.phone || "－"}</p>
          </>
        ) : (
          <>
            <input
              type="text"
              name="memberName"
              className="input input-bordered w-full mb-2"
              value={form.memberName}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              className="input input-bordered w-full"
              placeholder="輸入電話"
              value={form.phone}
              onChange={handleChange}
            />
            <button className="btn btn-primary mt-4 w-full" onClick={handleSubmit}>
              儲存修改
            </button>
          </>
        )}
      </div>

      <div className="mt-6 space-y-2">
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
