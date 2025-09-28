import { Link } from "react-router-dom";
import { FaUsers, FaShoppingCart } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="bg-base-200 min-h-full w-80 p-4 pl-6">
      <h2 className="text-xl font-bold mb-4 text-base-content mt-6">功能列</h2>

      <ul className="menu text-base-content text-lg">
        <li>
          <Link to="/members" className="flex items-center gap-2">
            <FaUsers className="text-xl mr-2" />
            會員管理
          </Link>
        </li>

        <li>
          <Link to="/orders" className="flex items-center gap-2">
            <FaShoppingCart className="text-xl mr-2" />
            訂單管理
          </Link>
        </li>
      </ul>
    </div>
  );
}
