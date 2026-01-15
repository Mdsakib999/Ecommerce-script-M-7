import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import Loader from "../Loader";
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      try {
        const { data } = await api.get(`/api/products?keyword=${query}`);
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      }
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full relative">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      {/* Search Results Dropdown - Fixed z-index for mobile */}
      {focused && query && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-9999 max-h-80 overflow-auto">
          {products.length === 0 ? (
            <li className="px-4 py-6 text-center text-gray-500 font-serif">
              No products found. Try a different search.
            </li>
          ) : (
            products.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all border-b border-gray-50 last:border-0"
                onMouseDown={() => {
                  navigate(`/products/${product._id}`);
                  setFocused(false);
                  setQuery("");
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-xs md:text-sm truncate max-w-48">
                      {product.name.slice(0, 15)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600">
                    ৳{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      ৳{product.price}
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
