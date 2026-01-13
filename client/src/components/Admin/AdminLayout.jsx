import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-gray-100 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <ShoppingBagIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Athletora
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div onClick={() => setIsSidebarOpen(false)}> 
            <AdminSidebar />
        </div>
        <div className="p-4 border-t border-gray-700 text-sm mt-auto">
          © {new Date().getFullYear()} Athletora Limited
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex bg-gray-800 text-white items-center justify-between p-4 shadow lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hover:text-gray-700 focus:outline-none"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="font-semibold text-gray-300">Admin Dashboard</span>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          {/* Nested admin pages render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
