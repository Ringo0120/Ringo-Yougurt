import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

const apiBase = import.meta.env.VITE_API_BASE;

function Navbar() {
  const [info, setInfo] = useState(null);
  const [avatarSvg, setAvatarSvg] = useState("");
  const [cart, setCart] = useState({ items: [], total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        await liff.ready;
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const profile = await liff.getProfile();
        const lineId = profile.userId;

        const res = await fetch(`${apiBase}/api/members/by-line/${lineId}`);
        if (!res.ok) return;
        const data = await res.json();
        setInfo(data);

        const seed = data.avatar || "Jack";
        const svg = createAvatar(lorelei, { seed }).toString();
        setAvatarSvg(svg);

        fetchCart(data.memberId);
      } catch (err) {
        console.error("Navbar 抓取會員資料失敗：", err);
      }
    };

    fetchMember();

    const handleAvatarUpdate = (e) => {
      const seed = e.detail;
      const svg = createAvatar(lorelei, { seed }).toString();
      setAvatarSvg(svg);
      setInfo((prev) => ({ ...prev, avatar: seed }));
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  const fetchCart = async (memberId) => {
    try {
      const res = await fetch(`${apiBase}/api/cart/${memberId}`);
      if (!res.ok) return;
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("抓購物車失敗：", err);
    }
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Yougurt
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.items.length > 0 && (
                <span className="badge badge-sm indicator-item">
                  {cart.items.length}
                </span>
              )}
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">{cart.items.length} Items</span>
              <span className="text-info">Subtotal: ${cart.total}</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block" onClick={handleViewCart}>
                  View cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div
              className="w-10 rounded-full border"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            ></div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
