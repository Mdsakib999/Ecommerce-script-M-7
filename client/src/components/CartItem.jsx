import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import Button from "./ui/Button";

export default function CartItem({ item, onRemove }) {
  const { updateQty, removeFromCart } = useCart();

  const decrementQty = () => {
    if (item.qty > 1) {
      updateQty(item.productId, item.qty - 1);
    }
  };

  const incrementQty = () => {
    if (item.qty < (item.countInStock ?? 9999)) {
      updateQty(item.productId, item.qty + 1);
    }
  };

  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Product Image & Info */}
        <div className="flex items-center gap-4 flex-1">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate mb-1 text-base sm:text-lg">{item.name}</h3>
            <div className="text-base sm:text-lg font-bold text-cyan-600">
              ৳{Number(item.price).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Controls & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="flex items-center border-2 border-gray-300 rounded-lg">
            <button
              onClick={decrementQty}
              disabled={item.qty <= 1}
              className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-gray-900 min-w-[40px] text-center text-sm sm:text-base">
              {item.qty}
            </span>
            <button
              onClick={incrementQty}
              disabled={item.qty >= (item.countInStock ?? 9999)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right sm:w-28">
            <div className="text-xs text-gray-500 block sm:hidden">Total</div>
            <div className="font-bold text-gray-900 text-sm sm:text-base">
              ৳{(item.price * item.qty).toFixed(2)}
            </div>
          </div>

          <Button
            onClick={() => onRemove ? onRemove(item.productId) : removeFromCart(item.productId)}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
