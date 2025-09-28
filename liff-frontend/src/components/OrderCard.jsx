export default function OrderCard({ order, index, isCompact = false }) {
  return (
    <div className="card w-80 bg-base-100 shadow-md flex-shrink-0">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <span className="badge badge-sm badge-info">
            {order.status || "待確認"}
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
          {!isCompact && (
            <li>下訂日：{order.orderDate}</li>
          )}
        </ul>

        <div className="mt-4">
          <button
            className="btn btn-outline btn-sm btn-block"
            onClick={() =>
              document.getElementById(`order_modal_${index}`).showModal()
            }
          >
            查看詳情
          </button>
        </div>

        <dialog id={`order_modal_${index}`} className="modal">
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
    </div>
  );
}
