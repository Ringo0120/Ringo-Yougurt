import { useState } from "react";

import BlueberryImg from "../assets/images/products/TOP - Blueberry.png";
import BrownSugarImg from "../assets/images/products/TOP - brownsugar longan.png";
import HoneyImg from "../assets/images/products/TOP - Honey.png";
import MangoImg from "../assets/images/products/TOP - Mango.png";
import OrangeImg from "../assets/images/products/TOP - Orange.png";
import PlainImg from "../assets/images/products/TOP - Plain.png";
import RaspberryImg from "../assets/images/products/TOP - Raspberry.png";
import StrawberryImg from "../assets/images/products/TOP - Strawberry.png";

const images = [
  { src: PlainImg, alt: "Plain Yogurt", title: "鮮奶口味" },
  { src: HoneyImg, alt: "Honey Yogurt", title: "蜂蜜脆片口味" },
  { src: BlueberryImg, alt: "Blueberry Yogurt", title: "藍莓口味" },
  { src: StrawberryImg, alt: "Strawberry Yogurt", title: "草莓口味" },
  { src: BrownSugarImg, alt: "Brown Sugar Longan Yogurt", title: "黑糖桂圓口味" },
  { src: MangoImg, alt: "Mango Yogurt", title: "芒果口味" },
  { src: RaspberryImg, alt: "Raspberry Yogurt", title: "覆盆子口味" },
  { src: OrangeImg, alt: "Orange Yogurt", title: "香桔口味" },
];

function Home() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

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
          <div className="relative w-full max-w-md rounded-box">
            <img
              src={images[index].src}
              alt={images[index].alt}
              className="w-auto max-h-72 mx-auto object-contain"
              loading="lazy"
            />
            <p className="text-center mt-3 text-lg font-semibold text-gray-800">
              {images[index].title}
            </p>

            <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
              <button onClick={prev} className="btn btn-circle">❮</button>
              <button onClick={next} className="btn btn-circle">❯</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
