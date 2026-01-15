import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });
  const [categories, setCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // First load
  const [filterLoading, setFilterLoading] = useState(false); // Filter changes
  const [error, setError] = useState();
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const currentSort = queryParams.get("sort") || "";
  const currentCategory = queryParams.get("category") || "all";
  const currentPage = parseInt(queryParams.get("page")) || 1;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        // Use filterLoading for subsequent loads, initialLoading only for first
        if (initialLoading) {
          setInitialLoading(true);
        } else {
          setFilterLoading(true);
        }

        // Build query params
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (currentSort) params.append("sort", currentSort);
        if (currentCategory && currentCategory !== "all") {
          params.append("category", currentCategory);
        }
        params.append("page", currentPage);
        params.append("limit", 12);

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
        const { data } = await api.get(url);

        if (!mounted) return;
        setProducts(data.products);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products"
        );
      } finally {
        if (mounted) {
          setInitialLoading(false);
          setFilterLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [keyword, currentSort, currentCategory, currentPage]);

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(location.search);
    if (e.target.value) {
      newParams.set("sort", e.target.value);
    } else {
      newParams.delete("sort");
    }
    newParams.delete("page"); // Reset to page 1
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleCategoryChange = (categoryName) => {
    const newParams = new URLSearchParams(location.search);
    if (categoryName === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryName);
    }
    newParams.delete("page"); // Reset to page 1
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", newPage);
    navigate(`?${newParams.toString()}`, { replace: true });
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (initialLoading)
    return (
      <div className="min-h-screen pt-20">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="p-6">
        <Message type="error">{error}</Message>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {keyword ? `Search Results for "${keyword}"` : "Products"}
        </h1>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
          {/* Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                disabled={filterLoading}
              >
                <option value="">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="trending">Trending</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {products.length} of {pagination.totalProducts} products
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  disabled={filterLoading}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentCategory === "all"
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat.name)}
                    disabled={filterLoading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      currentCategory === cat.name
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid with Loading Overlay */}
        <div className="relative">
          {filterLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
                <span className="text-gray-700 font-medium">Loading...</span>
              </div>
            </div>
          )}
          
          {products.length === 0 && !filterLoading && <Message>No products found</Message>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage || filterLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - currentPage) <= 1;

                  if (!showPage && pageNum === 2) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                  }
                  if (!showPage && pageNum === pagination.totalPages - 1) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                  }
                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={filterLoading}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-cyan-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } disabled:opacity-50`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage || filterLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
