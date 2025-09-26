import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

const apiBase = import.meta.env.VITE_API_BASE;

function Navbar() {
  const [info, setInfo] = useState(null);
  const [avatarSvg, setAvatarSvg] = useState("");

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

        // 生成頭像
        const svg = createAvatar(lorelei, { seed: data.avatar || "Jack" }).toString();
        setAvatarSvg(svg);
      } catch (err) {
        console.error("Navbar 抓取會員資料失敗：", err);
      }
    };

    fetchMember();
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Yougurt
        </Link>
      </div>
      <div className="flex-none">
        {/* 購物車 dropdown 保留 */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div
              className="w-10 rounded-full border"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            ></div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
ㄋ