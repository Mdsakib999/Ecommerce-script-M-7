import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import Message from "../Message";
import Button from "../ui/Button";
import CreateProductForm from "./CreateProductForm";
import UpdateProductForm from "./UpdateProductForm";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { token } = useAuth();

  // Fetch Products
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Request a large limit for admin panel to show 'all' products until admin pagination is implemented
        const { data } = await api.get("/api/products?limit=1000");
        if (!mounted) return;
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle Product Created
  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowCreateForm(false);
  };

  // Handle Product Updated
  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  // Handle Delete Product
  function handleDelete(id) {
    toast("Are you sure you want to delete this product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/api/products/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Remove deleted product from state list
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success("Product deleted successfully");
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
          }
        }
      },
      cancel: {
        label: "Cancel"
      }
    });
  }

  if (loading) return <Loader fullPage />;

  if (error) return <Message type="error">{error}</Message>;

  // Show Create Form
  if (showCreateForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setShowCreateForm(false)}
          className="mb-6"
        >
          ← Back to Products
        </Button>
        <CreateProductForm onProductCreated={handleProductCreated} token={token} />
      </div>
    );
  }

  // Show Update Form
  if (editingProduct) {
    return (
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setEditingProduct(null)}
          className="mb-6"
        >
          ← Back to Products
        </Button>
        <UpdateProductForm
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
          onCancel={() => setEditingProduct(null)}
          token={token}
        />
      </div>
    );
  }

  // Products List
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Products</h1>
           <p className="mt-1 text-sm text-gray-500">Manage your product inventory ({products.length})</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} leftIcon={<PlusIcon className="w-5 h-5" />}>
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {product.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.isFeatured ? (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ৳{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.discountPrice > 0 ? (
                       <span className="text-red-600 font-bold">৳{product.discountPrice.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.countInStock > 10
                          ? "bg-green-100 text-green-800"
                          : product.countInStock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.countInStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                        leftIcon={<PencilIcon className="w-4 h-4" />}
                        className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        leftIcon={<TrashIcon className="w-4 h-4" />}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateForm(true)}
              className="mt-4"
              leftIcon={<PlusIcon className="w-5 h-5" />}
            >
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
