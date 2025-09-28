import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${apiBase}/api/members`);
        if (!res.ok) throw new Error("查無會員");
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("取得會員資料失敗：", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">會員管理</h1>

      {loading ? (
        <div className="text-center text-gray-500">載入中...</div>
      ) : members.length === 0 ? (
        <div className="text-center text-gray-500">尚無會員資料</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Line ID</th>
                <th>姓名</th>
                <th>電話</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.memberId || m.id}>
                  <td>{m.memberId || m.id}</td>
                  <td>{m.lineId}</td>
                  <td>{m.memberName}</td>
                  <td>{m.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
