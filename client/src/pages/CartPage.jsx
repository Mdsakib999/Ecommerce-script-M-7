import {
    ArrowRightIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { placeOrder } from "../api/order";
import CartItem from "../components/CartItem";
import Button from "../components/ui/Button";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, clearCart, removeFromCart } = useCart();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, updateProfile } = useAuth();
  
  const [confirmModal, setConfirmModal] = useState({ 
    open: false, 
    type: null, // "remove" | "clear"
    itemId: null 
  });

  const [shippingInfo, setShippingInfo] = useState({
    phoneNumber: user?.phoneNumber || "",
    district: user?.district || "",
    address: user?.address || "",
  });

  // Update local state when user loads
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        phoneNumber: user.phoneNumber ?? prev.phoneNumber,
        district: user.district ?? prev.district,
        address: user.address ?? prev.address,
      }));
    }
  }, [user]);

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ৳1000
  const total = subtotal + shipping;

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^01\d{9}$/;
    if (!number) return "Phone number is required";
    if (!phoneRegex.test(number)) {
      return "Phone number must be 11 digits and start with '01'";
    }
    return "";
  };

  // Intercept input while typing:
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, ""); // remove non-digit chars
    // If user typed a prefix that can't be valid, block the change and show helpful error
    let error = "";

    if (digits.length > 0 && !digits.startsWith("01")) {
      error = "Phone number must start with 01";
    } else if (digits.length > 11) {
      error = "Phone number cannot exceed 11 digits";
    }
    // if (error) {
    //   setErrors((prev) => ({ ...prev, phoneNumber: error }));
    //   return;
    // }

    // Clear phone-specific errors while user types valid partial input
    setErrors((prev) => ({ ...prev, phoneNumber: error }));
    setShippingInfo((prev) => ({
      ...prev,
      phoneNumber: digits,
    }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!user) return toast.error("Please log in to checkout");

    if (
      !shippingInfo.phoneNumber ||
      !shippingInfo.district ||
      !shippingInfo.address
    ) {
      return toast.error("Please fill in all shipping information");
    }
    const error = validatePhoneNumber(shippingInfo.phoneNumber);
    if (error) {
      setErrors((prev) => ({ ...prev, phoneNumber: error }));

      return;
    }

    const orderItems = cart.map((i) => ({
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      price: i.price,
      imageUrl: i.imageUrl,
    }));
    setLoading(true);
    try {
      // Update profile if info changed
      if (
        user.phoneNumber !== shippingInfo.phoneNumber ||
        user.district !== shippingInfo.district ||
        user.address !== shippingInfo.address
      ) {
        await updateProfile(shippingInfo);
      }

      const order = await placeOrder(orderItems, shippingInfo, "Cash on Delivery");
      toast.success("Order placed successfully!");
      clearCart();
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (id) => {
    setConfirmModal({ open: true, type: "remove", itemId: id });
  };

  const handleClearCartClick = () => {
    setConfirmModal({ open: true, type: "clear", itemId: null });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.type === "remove" && confirmModal.itemId) {
      removeFromCart(confirmModal.itemId);
      toast.success("Item removed from cart");
    } else if (confirmModal.type === "clear") {
      clearCart();
      toast.success("Cart cleared");
    }
    setConfirmModal({ open: false, type: null, itemId: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length === 0
              ? "Your cart is empty"
              : `${cart.length} item${
                  cart.length !== 1 ? "s" : ""
                } in your cart`}
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet. Start
                shopping to fill it up!
              </p>
              <Link to="/products">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                >
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Shipping + Items) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="w-6 h-6 text-cyan-600" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="e.g. 01700000000"
                    value={shippingInfo.phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    type="tel"
                    pattern="^01\d{9}$"
                    error={errors.phoneNumber}
                    helperText="Must start with 01 and be 11 digits"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <select
                      value={shippingInfo.district}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          district: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                      required
                    >
                      <option value="">Select District</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      rows={2}
                      placeholder="e.g. House 12, Road 5, Dhanmondi"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in"
                  >
                    <CartItem item={item} onRemove={handleRemoveClick} />
                  </div>
                ))}

                {/* Clear Cart Button */}
                <Button
                  onClick={handleClearCartClick}
                  variant="ghost"
                  className="w-auto ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 hover:border-red-400"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>
                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-y border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
                      {shipping === 0 ? "FREE" : `৳${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && subtotal < 1000 && (
                    <p className="text-xs text-gray-500">
                      Add ৳{(1000 - subtotal).toFixed(2)} more for free
                      shipping!
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    ৳{total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={
                    loading ||
                    !user ||
                    !shippingInfo.phoneNumber ||
                    !shippingInfo.district ||
                    !shippingInfo.address ||
                    errors.phoneNumber
                  }
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                >
                  {!user ? "Login to Checkout" : "Proceed to Checkout"}
                </Button>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <span>Secure Checkout</span>
                </div>

                {/* Continue Shopping */}
                <Link to="/products">
                  <Button variant="ghost" size="md" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === "clear" ? "Clear Cart" : "Remove Item"}
        message={
          confirmModal.type === "clear"
            ? "Are you sure you want to remove all items from your cart?"
            : "Are you sure you want to remove this item from your cart?"
        }
        confirmText="Remove"
      />
    </div>
  );
}
