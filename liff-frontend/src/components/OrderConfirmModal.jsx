export default function OrderConfirmModal({
  show,
  onClose,
  onConfirm,
  member,
  recipient,
  address,
  desiredDate,
  cart,
  products,
  totalCount,
}) {
  if (!show) return null;

  return (
    <dialog id="confirm_modal" className="modal modal-open">
      <div className="modal-box max-w-md shadow-lg border rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">優格商店</h2>
        <hr className="mb-4" />

        <div className="flex justify-between text-sm mb-4">
          <div>
            <p><strong>Invoice</strong></p>
          </div>
          <div className="text-right">
            <p>日期: {new Date().toLocaleDateString()}</p>
            <p>訂單編號: #TEMP123</p>
          </div>
        </div>

        <div className="mb-4 text-sm">
          <p className="font-bold">收件資訊:</p>
          <p>{recipient || member?.memberName}</p>
          <p>{address}</p>
          <p>{desiredDate}</p>
        </div>

        <div className="mb-4 text-sm">
          <p className="font-bold">訂單內容:</p>
          <div className="flex justify-between">
            <span className="font-semibold">商品</span>
            <span className="font-semibold">數量</span>
          </div>
          {Object.entries(cart)
            .filter(([_, g]) => g > 0)
            .map(([pid, groups]) => {
              const prod = products.find((p) => p.productId === pid);
              return (
                <div key={pid} className="flex justify-between">
                  <span>{prod ? prod.productName : pid}</span>
                  <span>{groups * 6}</span>
                </div>
              );
            })}
          <div className="flex justify-between font-bold mt-2">
            <span>總數量</span>
            <span>{totalCount}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500">感謝您的訂購！實際配送以物流為準。</p>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>返回修改</button>
          <button className="btn btn-primary" onClick={onConfirm}>確認送出</button>
        </div>
      </div>
    </dialog>
  );
}
