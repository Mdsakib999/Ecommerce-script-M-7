import {
    CubeIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    FolderIcon,
    PhotoIcon,
    TagIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function UpdateProductForm({
  product,
  onProductUpdated,
  onCancel,
  token,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Populate form with product data
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price?.toString() || "");
      setCountInStock(product.countInStock?.toString() || "");
      setCategory(product.category || "");
      setPreview(product.imageUrl || ""); // show old image
      setImage(null);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("countInStock", countInStock);
      formData.append("category", category);

      // Only send image if user selected a new one
      if (image) {
        formData.append("image", image);
      }

      const { data: updatedProduct } = await api.put(
        `/api/products/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onProductUpdated?.(updatedProduct);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onCancel?.();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Update Product
        </h2>
        <p className="text-gray-600 text-sm">Edit product information</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm mb-6 animate-fade-in">
          Product updated successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <Input
            type="text"
            label="Product Name"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<TagIcon className="w-5 h-5" />}
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5 text-gray-400" />
                <span>Category</span>
              </div>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <Input
            type="number"
            label="Price (৳)"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            leftIcon={<CurrencyDollarIcon className="w-5 h-5" />}
            step="0.01"
            min="0"
            required
          />

          {/* Stock Count */}
          <Input
            type="number"
            label="Stock Quantity"
            placeholder="0"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            leftIcon={<CubeIcon className="w-5 h-5" />}
            min="0"
            required
          />
        </div>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mt-2 border"
          />
        )}

        <Input
          type="file"
          label="Product Image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
          leftIcon={<PhotoIcon className="w-5 h-5" />}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <span>Description</span>
            </div>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="flex-1"
          >
            Update Product
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
