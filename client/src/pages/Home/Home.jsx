import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  ArrowPathIcon,
  ArrowRightIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import "swiper/css";
import "swiper/css/effect-fade";
import api from "../../api/axios";
import heroImg1 from '../../assets/sports-hero-1.png';
import heroImg2 from '../../assets/sports-hero-2.png';
import heroImg3 from '../../assets/sports-hero-3.png';
import Loader from "../../components/Loader";
import ProductCard from "../../components/ProductCard";
import Button from "../../components/ui/Button";

// New Components
import BrandStory from "../../components/home/BrandStory";
import NewArrivals from "../../components/home/NewArrivals";
import OfferBanner from "../../components/home/OfferBanner";
import Testimonials from "../../components/home/Testimonials";
import TrendingProducts from "../../components/home/TrendingProducts";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products");
        // API now returns { products: [], pagination: {} }
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 text-white overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              {/* Premium Badge with Pulse */}
              <div 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-orange-400/30 shadow-lg animate-fade-in-down"
                style={{ animationDelay: '0.1s' }}
              >
                <SparklesIcon className="w-5 h-5 text-orange-300 animate-pulse" />
                <span className="text-sm font-semibold tracking-wide">2025 Sports Collection</span>
              </div>

              {/* Enhanced Headline with Gradient */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="block mb-3">Elevate Your</span>
                  <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Game
                  </span>
                </h1>
              </div>

              {/* Improved Value Proposition */}
              <p 
                className="text-xl sm:text-2xl text-slate-200 leading-relaxed max-w-xl font-light animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                Experience premium quality meets unbeatable value. Curated collections, 
                <span className="font-semibold text-white"> lightning-fast delivery</span>, and 
                world-class service.
              </p>

              {/* Enhanced CTAs */}
              <div 
                className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                style={{ animationDelay: '0.4s' }}
              >
                <Link to="/products" className="group">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    rightIcon={<ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  >
                    Shop Equipment
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 w-full sm:w-auto backdrop-blur-sm transition-all duration-300"
                  >
                    Explore All Sports
                  </Button>
                </Link>
              </div>

              {/* Premium Stats Section */}
              <div 
                className="flex justify-center sm:justify-start flex-wrap gap-12 pt-10 mt-4 border-t border-white/10 animate-fade-in-up"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="text-left group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">1,000+</div>
                  <div className="text-slate-300 text-sm mt-1 font-medium">Premium Products</div>
                </div>
                <div className="text-left group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">50K+</div>
                  <div className="text-slate-300 text-sm mt-1 font-medium">Sports Products</div>
                </div>
                <div className="text-left group">
                  <div className="flex items-center gap-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">4.9</span>
                    <span className="text-yellow-400 text-2xl">★</span>
                  </div>
                  <div className="text-slate-300 text-sm mt-1 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Enhanced Hero Visual */}
            <div 
              className="relative hidden lg:block animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="relative aspect-square">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-purple-500/40 to-orange-500/40 rounded-3xl blur-3xl animate-pulse"></div>
                
                {/* Main Visual Card */}
                <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-2 border border-white/20 h-full overflow-hidden shadow-2xl">
                  {/* Background Image Slider */}
                  <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
                    <Swiper
                      modules={[Autoplay, EffectFade]}
                      effect="fade"
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      loop
                      className="h-full w-full"
                    >
                      {[heroImg1, heroImg2, heroImg3].map((img, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="h-full w-full bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1] rounded-3xl" />

                  {/* Floating Badge - Top Right */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-xl backdrop-blur-sm border border-white/20">
                      <p className="text-white font-bold text-sm tracking-wide">TRENDING NOW</p>
                    </div>
                  </div>

                  {/* Bottom Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
                    <div className="text-left space-y-2">
                      <p className="text-3xl font-bold text-white drop-shadow-lg">
                        Performance Gear
                      </p>
                      <p className="text-cyan-200 text-lg font-medium">Built for Athletes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivals products={products} />

      {/* Offer Banner Section */}
      <OfferBanner />

      {/* Featured Products Section (Existing) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Top Performance Gear
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our best-selling sports equipment and apparel trusted by athletes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRightIcon className="w-5 h-5" />}
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <TrendingProducts products={products} />

      {/* Brand Story Section */}
      <BrandStory />

      {/* Benefits Section (Existing - moved down) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4 group-hover:bg-purple-200 transition-colors">
                <TruckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600 text-sm">On orders over ৳1000</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 group-hover:bg-green-200 transition-colors">
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600 text-sm">100% secure transactions</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                <PhoneIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600 text-sm">
                Dedicated customer service
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 group-hover:bg-amber-200 transition-colors">
                <ArrowPathIcon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}
