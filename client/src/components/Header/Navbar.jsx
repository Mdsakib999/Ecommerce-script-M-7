import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    ChevronDownIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserCircleIcon,
    WrenchScrewdriverIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { logout } from "../../firebase";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { cart, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartCount = cart.length;

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-1000 border-b shadow-md transition-all duration-300 ${
        isScrolled ? "bg-white border-gray-200" : "glass border-white/20"
      }`}
    >
      <nav
        ref={mobileMenuRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Athletora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-gray-700 hover:text-cyan-600 transition-colors relative group ${
                location.pathname === "/" ? "text-cyan-600 font-semibold" : ""
              }`}
            >
              Home
              {location.pathname === "/" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-accent transform scale-x-100 transition-transform origin-left"></span>
              )}
            </Link>

            <Link
              to="/about"
              className={`text-gray-700 hover:text-cyan-600 transition-colors relative group ${
                location.pathname === "/about" ? "text-cyan-600 font-semibold" : ""
              }`}
            >
              About Us
              {location.pathname === "/about" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-accent transform scale-x-100 transition-transform origin-left"></span>
              )}
            </Link>

            <Link
              to="/products"
              className={`text-gray-700 hover:text-cyan-600 transition-colors relative group ${
                location.pathname === "/products"
                  ? "text-cyan-600 font-semibold"
                  : ""
              }`}
            >
              Products
              {location.pathname === "/products" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-accent transform scale-x-100 transition-transform origin-left"></span>
              )}
            </Link>

            <Link
              to="/contact"
              className={`text-gray-700 hover:text-cyan-600 transition-colors relative group ${
                location.pathname === "/contact" ? "text-cyan-600 font-semibold" : ""
              }`}
            >
              Contact
              {location.pathname === "/contact" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-accent transform scale-x-100 transition-transform origin-left"></span>
              )}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Right Side - Cart & Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Link */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-cyan-600 transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-secondary text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full border-2 border-cyan-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-fade-in-down z-[1001]">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      My Dashboard
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                      >
                        <WrenchScrewdriverIcon className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-block">
                <button className="px-4 py-2 bg-gradient-accent text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors">
                  Sign In
                </button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-down">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/about"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                About Us
              </Link>

              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/products"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Products
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/contact"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Contact
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCartIcon className="w-4 h-4" />
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-accent rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {!user && (
                <>
                  <hr className="my-2 border-gray-200" />
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-accent transition-colors text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
