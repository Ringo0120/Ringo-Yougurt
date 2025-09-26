import { useEffect, useState } from "react";
import liff from "@line/liff";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Cart() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await liff.ready;
                if (!liff.isLoggedIn()) {
                    liff.login();
                    return;
                }
                const profile = await liff.getProfile();
                const lineId = profile.userId;

                const resMember = await fetch(`${apiBase}/api/members/by-line/${lineId}`);
                if (!resMember.ok) throw new Error("查無會員");
                const member = await resMember.json();

                const resOrders = await fetch(`${apiBase}/api/orders/by-member/${member.memberId}`);
                if (!resOrders.ok) throw new Error("查無訂單");
                const data = await resOrders.json();
                setOrders(data);
            } catch (err) {
                console.error("查詢訂單失敗：", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center mt-12">載入中...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-base-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">我的訂單</h2>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>訂單編號</th>
                            <th>下訂日期</th>
                            <th>預計配送日期</th>
                            <th>訂單品項</th>
                            <th>收件人</th>
                            <th>地址</th>
                            <th>確認狀態</th>
                            <th>出貨狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center text-gray-500">
                                    尚無訂單
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, idx) => (
                                <tr key={order.orderId}>
                                    <td>{idx + 1}</td>
                                    <td>{order.orderId}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.desiredDate || "－"}</td>
                                    <td>
                                        {Array.isArray(order.items)
                                            ? order.items.map((it) => `${it.name} x${it.qty}`).join("、")
                                            : ""}
                                    </td>
                                    <td>{order.recipient || "－"}</td>
                                    <td>{order.address || "－"}</td>
                                    <td>{order.status || "－"}</td>
                                    <td>{order.deliverStatus || "－"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Link
                to="/order"
                className="btn btn-circle btn-primary fixed bottom-10 right-10 shadow-lg"
            >
                下訂
            </Link>
        </div>
    );
}
