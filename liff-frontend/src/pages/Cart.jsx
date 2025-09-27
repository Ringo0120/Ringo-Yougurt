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
        <div className="max-w-6xl mx-auto mt-10 p-6">
            <h2 className="text-xl font-bold mb-4">我的訂單</h2>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500">尚無訂單</div>
            ) : (
                <>
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order, idx) => (
                            <div key={order.orderId} className="card bg-base-100 shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <span className="badge badge-sm badge-info">
                                        {order.status || "PENDING"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        #{order.orderId.slice(-5)}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold mt-3">
                                    配送 {order.desiredDate || "－"}
                                </h3>
                                <p className="text-sm text-gray-500">下訂日：{order.orderDate}</p>

                                <div className="mt-4 space-y-1 text-sm">
                                    <p><span className="font-semibold">收件人：</span>{order.recipient || "－"}</p>
                                    <p><span className="font-semibold">地址：</span>{order.address || "－"}</p>
                                    <p><span className="font-semibold">金額：</span>${order.totalFee || 0}</p>
                                </div>

                                <div className="mt-4">
                                    <button
                                        className="btn btn-outline btn-sm w-full"
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
                                    <div className="modal-box max-w-lg">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                                ✕
                                            </button>
                                        </form>
                                        <h3 className="font-bold text-lg mb-4">訂單詳情</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li><span className="font-semibold">訂單編號：</span>{order.orderId}</li>
                                            <li><span className="font-semibold">下訂日期：</span>{order.orderDate}</li>
                                            <li><span className="font-semibold">預計配送：</span>{order.desiredDate || "－"}</li>
                                            <li><span className="font-semibold">收件人：</span>{order.recipient || "－"}</li>
                                            <li><span className="font-semibold">地址：</span>{order.address || "－"}</li>
                                            <li><span className="font-semibold">品項：</span>{order.orders || "－"}</li>
                                            <li><span className="font-semibold">狀態：</span>{order.status || "－"} / {order.deliverStatus || "－"}</li>
                                            <li><span className="font-semibold">總金額：</span>${order.totalFee || 0}</li>
                                        </ul>
                                    </div>
                                </dialog>
                            </div>
                        ))}
                    </div>

                    <div className="md:hidden">
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
                                                <li>收件人：{order.recipient || "－"}</li>
                                                <li>地址：{order.address || "－"}</li>
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
