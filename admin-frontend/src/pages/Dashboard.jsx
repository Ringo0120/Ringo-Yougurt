import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const apiBase = import.meta.env.VITE_API_BASE;

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mRes = await fetch(`${apiBase}/api/members`);
        const oRes = await fetch(`${apiBase}/api/orders`);
        const mData = mRes.ok ? await mRes.json() : [];
        const oData = oRes.ok ? await oRes.json() : [];
        setMembers(mData);
        setOrders(oData);
      } catch (err) {
        console.error("取得資料失敗", err);
      }
    };
    fetchData();
  }, []);

  const groupByMonth = (arr, dateField, sumField = null) => {
    const map = {};
    arr.forEach((item) => {
      if (!item[dateField]) return;
      const d = new Date(item[dateField]);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!map[monthKey]) map[monthKey] = 0;
      map[monthKey] += sumField ? Number(item[sumField] || 0) : 1;
    });
    return map;
  };

  const membersByMonth = groupByMonth(members, "createAt");
  const memberMonths = Object.keys(membersByMonth).sort();
  const memberGrowth = memberMonths.map((month, i) => {
    if (i === 0) return 0;
    const prev = membersByMonth[memberMonths[i - 1]] || 0;
    const curr = membersByMonth[month] || 0;
    return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
  });

  const revenueByMonth = groupByMonth(orders, "orderDate", "totalFee");
  const revenueMonths = Object.keys(revenueByMonth).sort();
  const revenueGrowth = revenueMonths.map((month, i) => {
    if (i === 0) return 0;
    const prev = revenueByMonth[revenueMonths[i - 1]] || 0;
    const curr = revenueByMonth[month] || 0;
    return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
  });

  const nordBlue = "rgba(59,130,246,0.6)";
  const nordGreen = "rgba(34,197,94,0.6)";

  const memberBarData = {
    labels: memberMonths,
    datasets: [
      {
        label: "新增會員",
        data: memberMonths.map((m) => membersByMonth[m]),
        backgroundColor: nordBlue,
      },
    ],
  };

  const memberGrowthLine = {
    labels: memberMonths,
    datasets: [
      {
        label: "會員成長率(%)",
        data: memberGrowth,
        borderColor: nordBlue,
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const revenueLine = {
    labels: revenueMonths,
    datasets: [
      {
        label: "營收",
        data: revenueMonths.map((m) => revenueByMonth[m]),
        borderColor: nordGreen,
        backgroundColor: "rgba(34,197,94,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const revenueGrowthLine = {
    labels: revenueMonths,
    datasets: [
      {
        label: "營收成長率(%)",
        data: revenueGrowth,
        borderColor: nordGreen,
        backgroundColor: "rgba(34,197,94,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = useMemo(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const fontColor = isDark ? "#ece9f0" : "#4c566a";
    const gridColor = isDark ? "rgba(236,233,240,0.2)" : "rgba(76,86,106,0.2)";
    return {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: fontColor,
          },
        },
        title: {
          color: fontColor,
        },
        tooltip: {
          titleColor: fontColor,
          bodyColor: fontColor,
        },
      },
      scales: {
        x: {
          ticks: { color: fontColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: fontColor },
          grid: { color: gridColor },
        },
      },
    };
  }, [document.documentElement.className]);

  return (
    <Layout>
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-bold mt-10 mb-6 dark:text-[#e5e9f0]">
          管理系統首頁
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow p-4">
            <h2 className="text-lg font-bold mb-2 dark:text-[#e5e9f0]">
              各月新增會員數
            </h2>
            <Bar data={memberBarData} options={chartOptions} />
          </div>

          <div className="card bg-base-100 shadow p-4">
            <h2 className="text-lg font-bold mb-2 dark:text-[#e5e9f0]">
              會員數成長幅度(%)
            </h2>
            <Line data={memberGrowthLine} options={chartOptions} />
          </div>

          <div className="card bg-base-100 shadow p-4">
            <h2 className="text-lg font-bold mb-2 dark:text-[#e5e9f0]">
              各月營收
            </h2>
            <Line data={revenueLine} options={chartOptions} />
          </div>

          <div className="card bg-base-100 shadow p-4">
            <h2 className="text-lg font-bold mb-2 dark:text-[#e5e9f0]">
              營收成長幅度(%)
            </h2>
            <Line data={revenueGrowthLine} options={chartOptions} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
