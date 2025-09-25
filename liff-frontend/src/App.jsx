import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import liff from "@line/liff";

function App() {
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
        console.log("LIFF 初始化完成");

        if (!liff.isLoggedIn()) {
          console.log("尚未登入，導向 LINE Login");
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        console.log("使用者資料：", profile);
      } catch (err) {
        console.error("LIFF 初始化失敗", err);
      }
    };

    initLiff();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}

export default App;
