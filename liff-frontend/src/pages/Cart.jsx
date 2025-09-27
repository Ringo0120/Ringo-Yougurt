import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <div className="max-w-5xl mx-auto mt-10 p-6">
            <h2 className="text-xl font-bold mb-4">我的訂單</h2>

            <div className="hidden md:block overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow">
                <table className="table table-zebra">
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
                                    <td>{order.orderId.slice(-5)}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.desiredDate || "－"}</td>
                                    <td className="whitespace-pre-line">{order.orders || "－"}</td>
                                    <td>{order.recipient || "－"}</td>
                                    <td className="truncate max-w-xs">{order.address || "－"}</td>
                                    <td>{order.status || "－"}</td>
                                    <td>{order.deliverStatus || "－"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden">
                {orders.length === 0 ? (
                    <div className="text-center text-gray-500">尚無訂單</div>
                ) : (
                    <div className="carousel w-full space-x-4 rounded-box">
                        {orders.map((order, idx) => (
                            <div key={order.orderId} className="carousel-item">
                                <div className="card w-80 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <div className="flex justify-between items-center">
                                            <span className="badge badge-sm badge-info">
                                                {order.status || "PENDING"}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                #{order.orderId.slice(-5)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between mt-2">
                                            <h2 className="text-lg font-bold">
                                                配送 {order.desiredDate || "－"}
                                            </h2>
                                            <span className="text-sm font-semibold text-primary">
                                                ${order.totalFee || 0}
                                            </span>
                                        </div>

                                        <ul className="mt-4 flex flex-col gap-2 text-sm">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                收件人：{order.recipient || "－"}
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                地址：{order.address || "－"}
                                            </li>
                                        </ul>

                                        <div className="mt-4">
                                            <button
                                                className="btn btn-outline btn-sm btn-block"
                                                onClick={() =>
                                                    document
                                                        .getElementById(`order_modal_${idx}`)
                                                        .showModal()
                                                }
                                            >
                                                查看詳情
                                            </button>
                                        </div>

                                        <dialog id={`order_modal_${idx}`} className="modal">
                                            <div className="modal-box">
                                                <form method="dialog">
                                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                                        ✕
                                                    </button>
                                                </form>
                                                <h3 className="font-bold text-lg mb-4">
                                                    訂單詳情
                                                </h3>
                                                <ul className="space-y-2 text-sm">
                                                    <li>
                                                        <span className="font-semibold">訂單編號：</span>
                                                        {order.orderId}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">下訂日期：</span>
                                                        {order.orderDate}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">預計配送：</span>
                                                        {order.desiredDate || "－"}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">收件人：</span>
                                                        {order.recipient || "－"}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">地址：</span>
                                                        {order.address || "－"}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">品項：</span>
                                                        {order.orders || "－"}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">狀態：</span>
                                                        {order.status || "－"} / {order.deliverStatus || "－"}
                                                    </li>
                                                    <li>
                                                        <span className="font-semibold">總金額：</span>
                                                        ${order.totalFee || 0}
                                                    </li>
                                                </ul>
                                            </div>
                                        </dialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
