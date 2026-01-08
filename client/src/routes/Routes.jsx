import { createBrowserRouter } from "react-router";
import Root from "../components/layout/Root";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import CartPage from "../pages/CartPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import OrderSuccess from "../pages/OrderSuccess";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ProductPage from "../pages/ProductsPage";
import RequireAdmin from "../components/Admin/RequireAdmin";
import AdminLayout from "../components/Admin/AdminLayout";
import ProductAdmin from "../components/Admin/ProductAdmin";
import OrderAdmin from "../components/Admin/OrderAdmin";
import UserAdmin from "../components/Admin/UserAdmin";
import CategoryAdmin from "../components/Admin/CategoryAdmin";
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
  },{
    path:"/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      {index: true, element: <div>Admin Home</div>},
      {path: "products", Component:ProductAdmin},
      {path: "categories", Component:CategoryAdmin},
      {path: "orders", Component: OrderAdmin},
      {path: "users", Component: UserAdmin},
    ]
  }
]);
