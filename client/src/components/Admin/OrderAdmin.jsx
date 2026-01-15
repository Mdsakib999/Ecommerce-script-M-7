import { EyeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import Message from "../Message";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const promise = api.put(
      `/api/orders/${orderId}/status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.promise(promise, {
      loading: "Updating status...",
      success: (data) => {
        // Update with server response to be sure
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? data.data : order
          )
        );
        return `Order status updated to ${newStatus}`;
      },
      error: (err) => {
        // Revert on error
        fetchOrders();
        return err.response?.data?.message || "Failed to update status";
      },
    });
  };

  if (loading) return <Loader className="min-h-[60vh]" />;
  if (error) return <Message type="error">{error}</Message>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 px-4 sm:px-0">Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No orders found</p> 
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(20, 24)}...</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt?.substring(0, 10)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">৳{order.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled" disabled={order.status === 'Delivered'}>Cancelled</option>
                    </select>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.isDelivered ? (
                        <span className="text-green-600 font-bold">
                          {order.deliveredAt?.substring(0, 10)}
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="text-gray-600 hover:text-gray-800"
                                title="View Details"
                            >
                                <EyeIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ID - ${selectedOrder?._id}`}
        size="lg"
      >
        {selectedOrder && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Customer Info</h4>
                        <p className="text-sm text-gray-600">Email: {selectedOrder.userEmail}</p>
                        <p className="text-sm text-gray-600">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Order Info</h4>
                         <p className="text-sm text-gray-600">Total: ৳{selectedOrder.totalPrice.toFixed(2)}</p>
                         <p className="text-sm text-gray-600">Payment: {selectedOrder.paymentMethod || 'Cash On Delivery'}</p>
                         <p className="text-sm text-gray-600">Status: {selectedOrder.status}</p>
                    </div>
                </div>

                {selectedOrder.shippingAddress && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                            {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                        </p>
                    </div>
                )}

                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {selectedOrder.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 text-sm text-gray-900 flex items-center gap-3">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                            )}
                                            <span className="line-clamp-1">{item.name}</span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600 text-center">{item.qty}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 text-right">৳{item.price}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">৳{(item.price * item.qty).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
}
