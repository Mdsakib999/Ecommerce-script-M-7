import {
    ArrowRightIcon,
    ShieldCheckIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { placeOrder } from '../api/order';
import CartItem from '../components/CartItem';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const subtotal = useMemo(() => cart.reduce((s, i) => s + (i.price * i.qty), 0), [cart]);
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ৳1000
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    if (!user) return toast.error('Please log in to checkout');

    const orderItems = cart.map(i => ({
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      price: i.price,
      imageUrl: i.imageUrl
    }));

    try {
      setLoading(true);
      const order = await placeOrder(orderItems);
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length === 0 ? 'Your cart is empty' : `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}
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
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
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
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.productId} className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                  <CartItem item={item} />
                </div>
              ))}

              {/* Clear Cart Button */}
              <Button
                onClick={clearCart}
                variant="ghost"
                className="w-auto ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 hover:border-red-400"
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-y border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `৳${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Add ৳{(1000 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-gray-900">৳{total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={loading || !user}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                >
                  {!user ? 'Login to Checkout' : 'Proceed to Checkout'}
                </Button>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <span>Secure Checkout</span>
                </div>

                {/* Continue Shopping */}
                <Link to="/products">
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
