import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import formatNumber from "../utils/format"

const apiBase = import.meta.env.VITE_API_BASE;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [tempDates, setTempDates] = useState({});
  const [showCalendar, setShowCalendar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/orders`);
      if (!res.ok) throw new Error("查無訂單");
      const data = await res.json();

      const uniqueData = Array.from(
        new Map(data.map((o) => [o.orderId, o])).values()
      );
      setOrders(uniqueData);

      const initDates = {};
      uniqueData.forEach((o) => {
        initDates[o.orderId] = o.deliverDate ? new Date(o.deliverDate) : null;
      });
      setTempDates(initDates);

      const memberIds = [...new Set(uniqueData.map((o) => o.memberId))];
      const memberMap = {};
      for (const id of memberIds) {
        try {
          const mRes = await fetch(`${apiBase}/api/members/${id}`);
          if (mRes.ok) {
            const mData = await mRes.json();
            memberMap[id] = mData.memberName || mData.name || "";
          }
        } catch { }
      }
      setMembers(memberMap);

      setCurrentPage(1);
    } catch (err) {
      console.error("取得訂單資料失敗", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (orderId, updates) => {
    try {
      const res = await fetch(`${apiBase}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("更新訂單失敗");
      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert("更新訂單失敗");
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">訂單管理</h1>
      {loading ? (
        <div className="text-center text-gray-500">載入中...</div>
      ) : (
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <table className="table table-compact">
            <thead>
              <tr>
                <th>#</th>
                <th>訂單末五碼</th>
                <th className="min-w-[100px]">訂購者</th>
                <th className="min-w-[100px]">收貨人</th>
                <th>訂單狀態</th>
                <th className="min-w-[120px]">預計配送日期</th>
                <th>出貨日期</th>
                <th className="min-w-[110px]">貨品狀態</th>
                <th>總金額</th>
                <th>地址</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((o, idx) => (
                <tr key={`${o.orderId}-${idx}`}>
                  <th>{startIndex + idx + 1}</th>
                  <td>{o.orderId.slice(-5)}</td>
                  <td>{members[o.memberId] || o.memberId}</td>
                  <td>{o.recipient}</td>
                  <td>{o.confirmedOrder}</td>
                  <td>{o.desiredDate}</td>
                  <td>
                    <input
                      readOnly
                      value={
                        tempDates[o.orderId]
                          ? tempDates[o.orderId].toISOString().slice(0, 10)
                          : ""
                      }
                      onClick={() => setShowCalendar(o.orderId)}
                      className="input input-bordered input-xs w-[110px] rounded-full cursor-pointer"
                      placeholder="選擇日期"
                    />
                    {showCalendar === o.orderId && (
                      <div className="modal modal-open">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg mb-2">選擇出貨日期</h3>
                          <DatePicker
                            inline
                            selected={tempDates[o.orderId]}
                            onChange={(date) =>
                              setTempDates((prev) => ({
                                ...prev,
                                [o.orderId]: date,
                              }))
                            }
                          />
                          <div className="modal-action">
                            <button
                              className="btn rounded-full"
                              onClick={() => setShowCalendar(null)}
                            >
                              取消
                            </button>
                            <button
                              className="btn btn-primary rounded-full text-[#e5e9f0]"
                              onClick={() => {
                                updateOrder(o.orderId, {
                                  deliverDate: tempDates[o.orderId]
                                    ? tempDates[o.orderId]
                                      .toISOString()
                                      .slice(0, 10)
                                    : "",
                                });
                                setShowCalendar(null);
                              }}
                            >
                              確定
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      className="select select-xs rounded-full border-2 border-[#4c566a]"
                      value={o.deliverStatus}
                      onChange={(e) =>
                        updateOrder(o.orderId, {
                          deliverStatus: e.target.value,
                        })
                      }
                    >
                      <option value="PREPARE">準備中</option>
                      <option value="DELIVERING">配送中</option>
                      <option value="DELIVERED">已送達</option>
                    </select>
                  </td>
                  <td>{formatNumber(o.totalFee)}</td>
                  <td>{o.address}</td>
                  <td className="flex gap-1">
                    <button
                      className="btn btn-xs btn-success text-[#eceff4] rounded-full"
                      onClick={() =>
                        updateOrder(o.orderId, { confirmedOrder: "接受" })
                      }
                    >
                      接受
                    </button>
                    <button
                      className="btn btn-xs btn-error text-[#eceff4] rounded-full"
                      onClick={() =>
                        updateOrder(o.orderId, { confirmedOrder: "取消" })
                      }
                    >
                      取消
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
        </div>
      )}
    </Layout>
  );
}
