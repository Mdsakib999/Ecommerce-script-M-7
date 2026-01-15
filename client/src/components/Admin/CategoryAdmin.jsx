import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import Message from "../Message";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const { token } = useAuth();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/categories");
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const { data } = await api.put(
          `/api/categories/${editingCategory._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories((prev) =>
          prev.map((cat) => (cat._id === editingCategory._id ? data : cat))
        );
        toast.success("Category updated successfully");
      } else {
        const { data } = await api.post("/api/categories", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories((prev) => [...prev, data]);
        toast.success("Category created successfully");
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = (id) => {
    toast("Are you sure you want to delete this category?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/api/categories/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
            toast.success("Category deleted successfully");
          } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name || "" });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: ""});
  };

  if (loading) return <Loader className="min-h-[60vh]" />;
  if (error) return <Message type="error">{error}</Message>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product categories ({categories.length})
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          leftIcon={<PlusIcon className="w-5 h-5" />}
        >
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="text-cyan-600 hover:text-cyan-700"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
