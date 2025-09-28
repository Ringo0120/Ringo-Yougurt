import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import formatNumber from "../utils/format"

const apiBase = import.meta.env.VITE_API_BASE;

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLine, setFilterLine] = useState(false);
  const [filterValid, setFilterValid] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchMembers = async () => {
    try {
      setLoading(true);
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

  const handleAuthorize = async (memberId) => {
    if (!window.confirm("確定要授權這位會員嗎？")) return;

    try {
      const res = await fetch(`${apiBase}/api/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ validMember: "是" }),
      });

      if (!res.ok) {
        throw new Error("授權失敗");
      }

      await fetchMembers();
    } catch (err) {
      console.error("授權會員失敗", err);
      alert("授權會員失敗");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      alert("請輸入姓名與電話");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/members/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: newName,
          phone: newPhone,
          lineId: "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "新增失敗");
      }

      await fetchMembers();
      setShowModal(false);
      setNewName("");
      setNewPhone("");
    } catch (err) {
      console.error("新增會員失敗", err);
      alert("新增會員失敗：" + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const searchMatch =
      m.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.toLowerCase().includes(search.toLowerCase());

    const lineMatch = filterLine ? m.lineId : true;
    const validMatch = filterValid ? m.validMember === "是" : true;

    return searchMatch && lineMatch && validMatch;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">會員管理</h1>

      {loading ? (
        <div className="text-center text-gray-500">載入中...</div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end items-center gap-4 mb-2">
            <input
              type="text"
              placeholder="搜尋姓名或電話"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm rounded-full"
            />
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mr-1 rounded-full"
                checked={filterLine}
                onChange={(e) => setFilterLine(e.target.checked)}
              />
              <span className="label-text">Line用戶</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mr-1 rounded-full"
                checked={filterValid}
                onChange={(e) => setFilterValid(e.target.checked)}
              />
              <span className="label-text">合法會員</span>
            </label>
            <button
              className="btn btn-primary btn-sm rounded-full text-[#e5e9f0]"
              onClick={() => setShowModal(true)}
            >
              新增會員
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-compact">
              <thead>
                <tr>
                  <th>#</th>
                  <th>姓名</th>
                  <th>電話</th>
                  <th>Line 用戶</th>
                  <th>餘額</th>
                  <th>合法會員</th>
                  <th>銀行帳號</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((m, index) => (
                  <tr key={m.memberId || m.id}>
                    <th>{startIndex + index + 1}</th>
                    <td>{m.memberName}</td>
                    <td>{m.phone}</td>
                    <td>{m.lineId ? "是" : "否"}</td>
                    <td>{formatNumber(m.balance)}</td>
                    <td>{m.validMember === "是" ? "是" : "否"}</td>
                    <td>{m.bankAccount ? m.bankAccount : "現金"}</td>
                    <td>
                      {m.validMember !== "是" && (
                        <button
                          className="btn btn-xs btn-secondary text-[#e5e9f0] rounded-full"
                          onClick={() => handleAuthorize(m.memberId || m.id)}
                        >
                          授權會員
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="btn btn-sm"
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
              >
                上一頁
              </button>
              <span>
                第 {currentPage} / {totalPages} 頁
              </span>
              <button
                className="btn btn-sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                下一頁
              </button>
            </div>
          )}

          {showModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-2">新增會員</h3>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text">姓名</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    required
                    placeholder="會員姓名"
                    onChange={(e) => setNewName(e.target.value)}
                    className="input input-bordered rounded-full"
                  />
                </div>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text">電話</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    placeholder="範例：0912345678"
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="input input-bordered rounded-full"
                  />
                </div>
                <div className="modal-action">
                  <button
                    className="btn text-[#4c566a] rounded-3xl"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    取消
                  </button>
                  <button
                    className="btn btn-primary text-[#efe9f0] rounded-3xl"
                    onClick={handleAddMember}
                    disabled={submitting}
                  >
                    {submitting ? "新增中..." : "新增"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
