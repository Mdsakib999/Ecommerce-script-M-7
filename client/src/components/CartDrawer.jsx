import { MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import Button from "./ui/Button";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQty, removeFromCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900 opacity-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex top-0 z-100">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 animate-slide-in-right">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6 text-cyan-600" />
                Your Cart
              </h2>
              <button
                type="button"
                className="p-2 -mr-2 text-gray-400 hover:text-gray-500 transition-colors"
                onClick={closeCart}
              >
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCartIcon className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <Button 
                    variant="ghost" 
                    className="mt-4"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-4 whitespace-nowrap">৳{(item.price * item.qty).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex-1 flex items-end justify-between text-sm">
                          {/* Qty Controls */}
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(item.productId, item.qty - 1)}
                              className="p-1 px-2 hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-gray-900 font-medium">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.productId, item.qty + 1)}
                              className="p-1 px-2 hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="flex items-center gap-1 font-medium text-red-600 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-6 sm:px-6 bg-gray-50/50">
                <div className="flex justify-between text-base font-bold text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>৳{subtotal.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="space-y-3">
                  <Link to="/cart" onClick={closeCart}>
                    <Button variant="primary" className="w-full py-4 text-base">
                      Checkout Now
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
