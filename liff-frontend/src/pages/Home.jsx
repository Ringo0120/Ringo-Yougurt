import BlueberryImg from "../assets/images/products/TOP - Blueberry.png";
import BrownSugarImg from "../assets/images/products/TOP - brownsugar longan.png";
import HoneyImg from "../assets/images/products/TOP - Honey.png";
import MangoImg from "../assets/images/products/TOP - Mango.png";
import OrangeImg from "../assets/images/products/TOP - Orange.png";
import PlainImg from "../assets/images/products/TOP - Plain.png";
import RaspberryImg from "../assets/images/products/TOP - Raspberry.png";
import StrawberryImg from "../assets/images/products/TOP - Strawberry.png";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl leading-tight text-gray-900 font-rampart font-extrabold text-outline">
            品菓優格，<br />
            Ringo Yogurt
          </h1>
          <p className="text-lg text-gray-600">
            每一口都是新鮮與美味的結合，嚴選優質原料製成。
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="carousel rounded-box w-full max-w-md">
            <div className="carousel-item">
              <img src={BlueberryImg} alt="Blueberry Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={BrownSugarImg} alt="Brown Sugar Longan Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={HoneyImg} alt="Honey Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={MangoImg} alt="Mango Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={OrangeImg} alt="Orange Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={PlainImg} alt="Plain Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={RaspberryImg} alt="Raspberry Yogurt" className="w-full h-auto" />
            </div>
            <div className="carousel-item">
              <img src={StrawberryImg} alt="Strawberry Yogurt" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
