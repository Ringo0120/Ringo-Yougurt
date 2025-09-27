function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            品菓優格，<br />
            Ringo Yogurt
          </h1>
          <p className="text-lg text-gray-600">
            我們相信天然的食材，有益於你的健康。
          </p>
          <p className="text-lg text-gray-600">
            我們相信單純的優格，能讓你享受美味。
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full h-64 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            預留圖片區域
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
