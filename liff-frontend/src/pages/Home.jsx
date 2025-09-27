import eatingYogurt from "../assets/images/landing/eating_yougurt.svg";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl leading-tight text-gray-900 font-rampart font-extrabold text-outline">
            品菓優格，<br />
            Ringo Yogurt
          </h1>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={eatingYogurt}
            alt="Eating Yogurt Illustration"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
