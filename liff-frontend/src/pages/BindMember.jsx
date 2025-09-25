import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";

export default function BindMemberForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const [lineId, setLineId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    liff.ready.then(async () => {
      const profile = await liff.getProfile();
      setLineId(profile.userId);
      localStorage.setItem("lineUserId", profile.userId);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lineId) {
      setStatus({ type: "error", message: "尚未完成 Line 登入，請稍後再試。" });
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/members/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberName: name, phone, lineId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "綁定失敗");

      setStatus({ type: "success", message: `綁定成功，歡迎 ${name}` });
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="card w-96 bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🔐 綁定會員</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="input input-bordered w-full" placeholder="姓名" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="tel" className="input input-bordered w-full" placeholder="電話" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <button type="submit" className="btn btn-primary w-full">送出綁定</button>
        </form>
        {status && (
          <div className={`mt-4 alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
