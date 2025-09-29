import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import liff from "@line/liff";
import { Pencil } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import Alert from "../components/Alert";
import LoadingOverlay from "../components/LoadingOverlay";
import verifyPhone from "../utils/VerifyPhone";
import cityCountyData from "../data/CityCountyData.json";

const apiBase = import.meta.env.VITE_API_BASE;

export default function Profile() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    memberName: "",
    phone: "",
    city: "",
    area: "",
    detailAddress: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const location = useLocation();

  const avatarSvg = info?.avatar
    ? createAvatar(lorelei, { seed: info.avatar }).toString()
    : "";

  useEffect(() => {
    const fetchMember = async () => {
      try {
        await liff.ready;
        const profile = await liff.getProfile();
        const lineId = profile.userId;

        const res = await fetch(`${apiBase}/api/members/login-or-bind`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineId,
            displayName: profile.displayName,
            address: "",
          }),
        });
        if (!res.ok) throw new Error("查無會員");

        const data = await res.json();
        const member = data.member;

        let city = "";
        let area = "";
        let detailAddress = "";
        if (member.address) {
          const foundCity = cityCountyData.find((c) =>
            member.address.startsWith(c.CityName)
          );
          if (foundCity) {
            city = foundCity.CityName;
            const foundArea = foundCity.AreaList.find((a) =>
              member.address.includes(a.AreaName)
            );
            if (foundArea) {
              area = foundArea.AreaName;
              detailAddress = member.address
                .replace(city, "")
                .replace(area, "")
                .trim();
            } else {
              detailAddress = member.address.replace(city, "").trim();
            }
          } else {
            detailAddress = member.address;
          }
        }

        setInfo(member);
        setForm({
          memberName: member.memberName || "",
          phone: member.phone || "",
          city,
          area,
          detailAddress,
        });

        if (!member.memberName || !member.phone || !member.address) {
          setShowErrorAlert(true);
          setEditing(true);
        }

        if (location.state?.forceEdit) {
          setShowErrorAlert(true);
          setEditing(true);
        }
      } catch (err) {
        console.error("查詢會員失敗：", err);
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!info?.memberId) return;

    const fullAddress = `${form.city}${form.area}${form.detailAddress}`;

    if (!form.memberName || !verifyPhone(form.phone) || !fullAddress) {
      setShowErrorAlert(true);
      setEditing(true);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/members/${info.memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: form.memberName,
          phone: form.phone,
          address: fullAddress,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");

      const updated = { ...info, ...form, address: fullAddress };
      setInfo(updated);

      setShowErrorAlert(false);
      setEditing(false);
      setShowAlert(true);
    } catch (err) {
      console.error("更新會員失敗：", err);
      alert("更新失敗，請稍後再試。");
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-10 bg-base-200 p-6 rounded-lg shadow-md">
      <LoadingOverlay show={loading} />

      {!loading && (
        <>
          {showAlert && <Alert message="會員資料已成功更新！" />}

          {showErrorAlert && (
            <div role="alert" className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>請完整填寫姓名、電話與地址，才能繼續使用服務。</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <div
              className="w-24 h-24 rounded-full border border-gray-300 mb-4 cursor-pointer"
              onClick={() => setEditing(true)}
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            ></div>

            {!editing ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{info.memberName || "－"}</h2>
                  <button onClick={() => setEditing(true)}>
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">{info.phone || "－"}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {info.address || "－"}
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="memberName"
                  className="input input-bordered w-full mb-2 rounded-3xl"
                  placeholder="輸入姓名"
                  value={form.memberName}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  name="phone"
                  className={`input input-bordered w-full rounded-3xl mb-2 ${
                    form.phone && !verifyPhone(form.phone) ? "input-error" : ""
                  }`}
                  placeholder="輸入電話（09 開頭 10 碼）"
                  value={form.phone}
                  onChange={handleChange}
                />
                {form.phone && !verifyPhone(form.phone) && (
                  <p className="text-error text-sm mb-2">
                    請輸入正確的手機號碼（09 開頭，共 10 碼）。
                  </p>
                )}

                <select
                  className="select select-bordered w-full mb-2 rounded-3xl"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value, area: "" })
                  }
                >
                  <option value="">選擇縣市</option>
                  {cityCountyData.map((c) => (
                    <option key={c.CityName} value={c.CityName}>
                      {c.CityName}
                    </option>
                  ))}
                </select>

                {form.city && (
                  <select
                    className="select select-bordered w-full mb-2 rounded-3xl"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  >
                    <option value="">選擇鄉鎮市區</option>
                    {cityCountyData
                      .find((c) => c.CityName === form.city)
                      ?.AreaList.map((a) => (
                        <option key={a.ZipCode} value={a.AreaName}>
                          {a.AreaName}
                        </option>
                      ))}
                  </select>
                )}

                <input
                  type="text"
                  name="detailAddress"
                  className="input input-bordered w-full rounded-3xl"
                  placeholder="輸入詳細地址"
                  value={form.detailAddress}
                  onChange={handleChange}
                />

                <button
                  className="btn btn-primary mt-4 w-full rounded-3xl text-[#ece9f0]"
                  onClick={handleSubmit}
                >
                  儲存修改
                </button>
              </>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span>訂購方案</span>
              <span className="font-semibold">{info.orderType || "－"}</span>
            </div>
            <div className="flex justify-between">
              <span>餘額</span>
              <span className="font-semibold">${info.balance}</span>
            </div>
            <div className="flex justify-between">
              <span>剩餘運送次數</span>
              <span className="font-semibold">{info.remainDelivery}</span>
            </div>
            <div className="flex justify-between">
              <span>剩餘免運次數</span>
              <span className="font-semibold">{info.remainFreeQuota}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
