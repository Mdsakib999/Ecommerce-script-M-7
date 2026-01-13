import {
  CubeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  FolderIcon,
  MinusIcon,
  PhotoIcon,
  PlusIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function CreateProductForm({ onProductCreated, token }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [image, setImage] = useState(null);
  const [countInStock, setCountInStock] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);
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

  const handleAddField = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    const values = [...specifications];
    values.splice(index, 1);
    setSpecifications(values);
  };

  const handleSpecChange = (index, event) => {
    const values = [...specifications];
    values[index][event.target.name] = event.target.value;
    setSpecifications(values);
  };

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
      if (discountPrice) {
        formData.append("discountPrice", discountPrice);
      }
      formData.append("countInStock", countInStock);
      formData.append("category", category);
      formData.append("isFeatured", isFeatured);
      formData.append("image", image); // MUST match upload.single("image")

      // Filter out empty specs and stringify
      const filteredSpecs = specifications.filter(
        (s) => s.key.trim() && s.value.trim()
      );
      formData.append("specifications", JSON.stringify(filteredSpecs));

      const { data: newProduct } = await api.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (onProductCreated) {
        onProductCreated(newProduct);
      }

      setSuccess(true);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setImage(null);
      setCountInStock("");
      setCategory("");
      setIsFeatured(false);
      setSpecifications([{ key: "", value: "" }]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Product
        </h2>
        <p className="text-gray-600 text-sm">
          Add a new product to your inventory
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm mb-6 animate-fade-in">
          Product created successfully!
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

          {/* Discount Price */}
          <Input
            type="number"
            label="Discount Price (৳) (Optional)"
            placeholder="0.00"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            leftIcon={<CurrencyDollarIcon className="w-5 h-5" />}
            step="0.01"
            min="0"
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

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 border-gray-300"
            />
            <span className="text-gray-700 font-medium">Feature this product</span>
          </label>
        </div>

        {/* Image Upload */}
        <Input
          type="file"
          label="Product Image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          leftIcon={<PhotoIcon className="w-5 h-5" />}
          required
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

        {/* Specifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Technical Specifications
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddField}
              leftIcon={<PlusIcon className="w-4 h-4" />}
              className="text-cyan-600"
            >
              Add Detail
            </Button>
          </div>

          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="flex gap-3 items-center animate-scale-in"
              >
                <input
                  name="key"
                  placeholder="e.g. Material"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, e)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                />
                <input
                  name="value"
                  placeholder="e.g. 100% Cotton"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, e)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                />
                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create Product
        </Button>
      </form>
    </div>
  );
}
