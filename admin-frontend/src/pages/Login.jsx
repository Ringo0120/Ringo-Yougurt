import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      user === import.meta.env.VITE_ADMIN_USER &&
      pass === import.meta.env.VITE_ADMIN_PASS
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/");
    } else {
      alert("帳號或密碼錯誤");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center rounded-full">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">管理員登入</h2>
        <input
          type="text"
          placeholder="帳號"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="input input-bordered w-full mb-2 rounded-full"
        />
        <input
          type="password"
          placeholder="密碼"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="input input-bordered w-full mb-4 rounded-full"
        />
        <button type="submit" className="btn btn-primary w-full rounded-full text-[#ece9f0]">
          登入
        </button>
      </form>
    </div>
  );
}
