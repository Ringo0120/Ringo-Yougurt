import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function BindMemberForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/members/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberName: name,
          phone: phone,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("後端回傳非 JSON：" + text);
      }

      if (!res.ok) throw new Error(data.message || "綁定失敗，請重試");

      localStorage.setItem("member", JSON.stringify(data.member));

      setStatus({ type: "success", message: `綁定成功，歡迎 ${name}` });
      setName("");
      setPhone("");

      setTimeout(() => {
        navigate(`/profile/${data.memberId}`);
      }, 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="card w-96 bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🔐 綁定會員</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">姓名</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="請輸入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">電話</span>
            </label>
            <input
              type="tel"
              className="input input-bordered"
              placeholder="0912-345-678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            送出綁定
          </button>
        </form>

        {status && (
          <div
            className={`mt-4 alert ${status.type === "success" ? "alert-success" : "alert-error"
              }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
