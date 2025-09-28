import { useState } from "react";

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
  const [errorMsg, setErrorMsg] = useState("");

  if (!show) return null;

  const handleConfirm = () => {
    if (!recipient.trim() || !address.trim() || !desiredDate.trim() || totalCount === 0) {
      setErrorMsg("請確認寄件資訊皆已填寫。");
      setTimeout(() => setErrorMsg(""), 1000);
      return;
    }
    onConfirm();
  };

  return (
    <dialog id="confirm_modal" className="modal modal-open">
      <div className="modal-box max-w-md shadow-lg border rounded-lg">
        <h2 className="text-2xl font-bold text-center text-[#89b434] mb-2">
          Ringo Yogurt 品菓優格
        </h2>
        <hr className="mb-4" />

        <div className="mb-4 text-sm">
          <p className="text-lg font-bold">收件資訊</p>
          <p className="text-base">訂購日期：{new Date().toLocaleDateString()}</p>
          <p className="text-base">收件人：{recipient || member?.memberName || "未填寫"}</p>
          <p className="text-base">收件地址：{address || "未填寫"}</p>
          <p className="text-base">預計收貨日期：{desiredDate || "未選擇"}</p>
        </div>

        <div className="mb-4 text-sm">
          <p className="text-lg font-bold mb-2">訂單內容</p>
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>商品</th>
                <th className="text-right">數量</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cart)
                .filter(([_, g]) => g > 0)
                .map(([pid, groups]) => {
                  const prod = products.find((p) => p.productId === pid);
                  return (
                    <tr key={pid}>
                      <td>{prod ? prod.productName : pid}</td>
                      <td className="text-right">{groups * 6}</td>
                    </tr>
                  );
                })}
              <tr className="font-bold">
                <td>總數量</td>
                <td className="text-right">{totalCount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {errorMsg && (
          <div role="alert" className="alert alert-error my-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#ece9f0]">{errorMsg}</span>
          </div>
        )}

        <p className="text-xs text-gray-500">
          感謝您的訂購！實際配送以物流為準。
        </p>

        <div className="modal-action">
          <button className="btn rounded-full" onClick={onClose}>
            返回修改
          </button>
          <button
            className="btn btn-primary rounded-full text-[#ece9f0]"
            onClick={handleConfirm}
          >
            確認送出
          </button>
        </div>
      </div>
    </dialog>
  );
}
