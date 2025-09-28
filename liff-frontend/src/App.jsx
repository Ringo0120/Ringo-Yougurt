import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import liff from "@line/liff";

function App() {
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        await liff.getProfile();
      } catch (err) {
        console.error("LIFF 初始化失敗", err);
      }
    };

    initLiff();
  }, []);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
