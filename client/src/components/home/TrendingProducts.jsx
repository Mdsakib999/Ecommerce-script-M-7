import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import ProductCard from "../ProductCard";

const TrendingProducts = ({ products }) => {
  const scrollRef = useRef(null);

  // Simulate trending by taking a different slice, e.g., middle items
  // In a real app, this would come from an analytics endpoint
  // Sort by purchaseCount descending
  const trendingProducts = [...products]
    .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
    .slice(0, 10); // Show top 10 trending items

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-bold tracking-wide mb-4 border border-orange-200">
            HOT RIGHT NOW
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trending This Week
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover what everyone is talking about. These pieces are selling
            out fast.
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-cyan-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-300 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-cyan-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {trendingProducts.map((product, index) => (
              <div
                key={product._id}
                className="min-w-[280px] md:min-w-[320px] snap-center transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="h-full border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
