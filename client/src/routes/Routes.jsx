import { createBrowserRouter, Navigate } from "react-router";
import AdminHome from "../components/Admin/AdminHome";
import AdminLayout from "../components/Admin/AdminLayout";
import CategoryAdmin from "../components/Admin/CategoryAdmin";
import OrderAdmin from "../components/Admin/OrderAdmin";
import ProductAdmin from "../components/Admin/ProductAdmin";
import RequireAdmin from "../components/Admin/RequireAdmin";
import UserAdmin from "../components/Admin/UserAdmin";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import RequireAuth from "../components/Dashboard/RequireAuth";
import Root from "../components/layout/Root";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import About from "../pages/About/About";
import CartPage from "../pages/CartPage";
import MyOrdersPage from "../pages/Dashboard/MyOrdersPage";
import ProfilePage from "../pages/Dashboard/ProfilePage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import OrderSuccess from "../pages/OrderSuccess";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ProductPage from "../pages/ProductsPage";
import Contact from "../pages/Contact/Contact";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "login",
        Component: LoginForm,
      },
      {
        path: "register",
        Component: RegisterForm,
      },
      {
        path: "products",
        Component: ProductPage,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "products/:id",
        Component: ProductDetailsPage,
      },
      {
        path: "cart",
        Component: CartPage,
      },
      {
        path: "order-success/:id",
        Component: OrderSuccess,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard/profile" replace /> },
      { path: "profile", Component: ProfilePage },
      { path: "orders", Component: MyOrdersPage },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: "products", Component: ProductAdmin },
      { path: "categories", Component: CategoryAdmin },
      { path: "orders", Component: OrderAdmin },
      { path: "users", Component: UserAdmin },
    ],
  },
]);
