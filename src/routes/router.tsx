import UserLayout from "@/layouts/UserLayout";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);
