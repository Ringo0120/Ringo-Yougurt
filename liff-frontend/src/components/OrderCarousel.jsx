import { useRef } from "react";
import OrderCard from "./OrderCard";

export default function OrderCarousel({ orders }) {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
    };

    return (
        <div className="relative w-full">
            <button
                onClick={scrollLeft}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 btn btn-circle z-10"
            >
                ❮
            </button>

            <div
                ref={carouselRef}
                className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide px-4"
            >
                {orders.map((order, idx) => (
                    <div key={order.orderId} className="carousel-item flex-shrink-0">
                        <OrderCard
                            order={order}
                            index={idx}
                            isCompact={window.innerWidth < 768}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={scrollRight}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 btn btn-circle z-10"
            >
                ❯
            </button>
        </div>
    );
}
