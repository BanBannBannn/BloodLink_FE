import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";

import AdminDashboard from "@/pages/public/admin/Dashboard";
import AccountManagement from "@/pages/public/admin/AccountManagement";

import SupervisorLayout from "@/layouts/SupervisorLayout";
import SupervisorDashboard from "@/pages/public/bloodStorage/Dashboard";
import BloodRawTable from "@/pages/public/bloodStorage/BloodRawTable";
import BloodComponentsTable from "@/pages/public/bloodStorage/BloodComponentsTable";
import BloodHistoryTable from "@/pages/public/bloodStorage/BloodHistoryTable";
import BloodRequestTable from "@/pages/public/bloodStorage/BloodRequestTable";


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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "accounts", element: <AccountManagement /> },
    ],
  },
  {
    path: "/supervisor",
    element: <SupervisorLayout />,
    children: [
      { path: "supervisor-dashboard", element: <SupervisorDashboard /> },
      { path: "blood-raw", element: <BloodRawTable /> },
      { path: "blood-components", element: <BloodComponentsTable /> },
      { path: "history", element: <BloodHistoryTable /> },
      { path: "blood-requests", element: <BloodRequestTable /> },
    ],
  }

]);
