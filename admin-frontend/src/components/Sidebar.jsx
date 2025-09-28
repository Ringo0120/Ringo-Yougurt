import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <li><Link to="/members">會員管理</Link></li>
      <li><Link to="/orders">訂單管理</Link></li>
    </ul>
  );
}
