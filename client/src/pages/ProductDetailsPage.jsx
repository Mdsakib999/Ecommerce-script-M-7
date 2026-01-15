import {
    CheckCircleIcon,
    HomeIcon,
    MinusIcon,
    PlusIcon,
    ShoppingCartIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        if (!mounted) return;
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load product"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      // Add to cart with quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 500);
  };

  const incrementQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-20">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Message type="error">{error}</Message>
      </div>
    );
  if (!product)
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Message>Product not found</Message>
      </div>
    );

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link
            to="/"
            className="hover:text-purple-600 transition-colors flex items-center gap-1"
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-purple-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="animate-fade-in">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge
                    variant="error"
                    size="lg"
                    className="text-lg px-6 py-3"
                  >
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {product.discountPrice > 0 && (
                  <Badge
                    variant="success"
                    size="lg"
                    className="bg-red-500 text-white border-none shadow-sm"
                  >
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100
                    )}
                    % OFF SALE
                  </Badge>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge variant="warning" dot>
                    Only {product.countInStock} left!
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {!isOutOfStock && !isLowStock && (
                <Badge variant="success" className="mb-4">
                  In Stock
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="py-6 border-y border-gray-200">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  {product.discountPrice > 0 ? (
                    <>
                      <span className="text-5xl font-bold text-gray-900">
                        ৳{Number(product.discountPrice).toFixed(2)}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        ৳{Number(product.price).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-5xl font-bold text-gray-900">
                      ৳{Number(product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-2">
                  {product.countInStock > 0
                    ? `${product.countInStock} items available in stock`
                    : "Availability depends on stock"}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.countInStock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    Total:{" "}
                    <span className="font-bold text-gray-900">
                      ৳
                      {(
                        (product.discountPrice || product.price) * quantity
                      ).toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="space-y-3 pt-4">
              {justAdded ? (
                <Button
                  variant="success"
                  size="lg"
                  className="w-full bg-gradient-success"
                  disabled
                  leftIcon={<CheckCircleIcon className="w-6 h-6" />}
                >
                  Added to Cart!
                </Button>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  loading={isAdding}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={
                    !isAdding && <ShoppingCartIcon className="w-6 h-6" />
                  }
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              )}

              <Link to="/products">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Product Features */}
            <div className="bg-purple-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900">Product Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>Fast & Free Shipping</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>30-Day Easy Returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>Secure Payment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab
                    ? "text-purple-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 animate-scale-x-in"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Product Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                    <CheckCircleIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Original Product
                      </h4>
                      <p className="text-sm text-gray-600">
                        100% authentic item from authorized brand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                    <CheckCircleIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        Quality Assured
                      </h4>
                      <p className="text-sm text-gray-600">
                        Strictly inspected for quality before delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="animate-fade-in">
                {product.specifications?.length > 0 ? (
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {product.specifications.map((spec, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/3 border-r border-gray-100">
                              {spec.key}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 italic">
                      No technical specifications available for this product.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-fade-in">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Rating Summary */}
                  <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl h-fit">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-gray-900 mb-2">
                        {product.rating > 0 ? product.rating.toFixed(1) : "4.8"}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className="w-6 h-6 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm">
                        Based on{" "}
                        {product.reviews?.length > 0 ? product.reviews.length : "128"}{" "}
                        reviews
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-3 font-medium text-gray-600">
                            {rating}
                          </span>
                          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{
                                width: `${
                                  rating === 5 ? 85 : rating === 4 ? 10 : 5
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="w-10 text-right text-gray-400">
                            {rating === 5 ? "85%" : rating === 4 ? "10%" : "5%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="lg:col-span-2 space-y-6">
                    {(product.reviews?.length > 0
                      ? product.reviews
                      : [
                          {
                            _id: "1",
                            name: "Sarah Johnson",
                            rating: 5,
                            comment:
                              "Absolute game changer! The quality exceeded my expectations. Shipping was incredibly fast too.",
                            date: "2023-10-15",
                          },
                          {
                            _id: "2",
                            name: "Michael Chen",
                            rating: 4,
                            comment:
                              "Very solid build and performs as advertised. Minor delay in delivery but the product makes up for it.",
                            date: "2023-10-12",
                          },
                        ]
                    ).map((review) => (
                      <div
                        key={review._id}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold border-2 border-white shadow-sm">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {review.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(review.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) =>
                              star <= review.rating ? (
                                <StarIconSolid
                                  key={star}
                                  className="w-4 h-4 text-amber-400"
                                />
                              ) : (
                                <StarIcon
                                  key={star}
                                  className="w-4 h-4 text-gray-200"
                                />
                              )
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed italic">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
