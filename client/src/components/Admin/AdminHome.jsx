import {
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    TagIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const [prodRes, catRes, orderRes, userRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/categories"),
          api.get("/api/orders", config),
          api.get("/api/users", config),
        ]);

        setStats({
          products: prodRes.data.pagination?.totalProducts || 0,
          categories: catRes.data.length || 0,
          orders: orderRes.data.length || 0,
          users: userRes.data.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    {
      name: "Total Products",
      value: stats.products,
      icon: TagIcon,
      color: "bg-blue-500",
    },
    {
      name: "Total Categories",
      value: stats.categories,
      icon: Squares2X2Icon,
      color: "bg-purple-500",
    },
    {
      name: "Total Orders",
      value: stats.orders,
      icon: ClipboardDocumentListIcon,
      color: "bg-orange-500",
    },
    {
      name: "Total Users",
      value: stats.users,
      icon: UsersIcon,
      color: "bg-cyan-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to the Athletora Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <dt>
              <div className={`absolute rounded-xl p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats Info</h2>
        <div className="text-gray-600 text-sm leading-relaxed">
          <p>
            Your store currently has <span className="font-bold">{stats.products} products</span> distributed across <span className="font-bold">{stats.categories} categories</span>.
          </p>
          <p className="mt-2">
            You have received <span className="font-bold">{stats.orders} total orders</span> from <span className="font-bold">{stats.users} registered users</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
