import UserLayout from "@/layouts/UserLayout";
import HomePage from "@/pages/public/Home";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import BloodDonation from "@/pages/user/BloodDonation";
import ProfilePage from "@/pages/user/Profile";
import BloodDonationHistory from "@/pages/user/BloodDonationHistory";
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

import BloodDonateRequestStatusTable from "@/pages/public/nurse/BloodDonateRequestStatusTable";
import BloodDonationScheduleTable from "@/pages/public/nurse/BloodDonationScheduleTable";
import NurseDashboard from "@/pages/public/nurse/Dashboard";
import NurseLayout from "@/layouts/NurseLayout";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/blood-donation",
        element: <BloodDonation />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/blood-donation-history",
        element: <BloodDonationHistory />,
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
  },

  {
    path: "/nurse",
    element: <NurseLayout />,
    children: [
      { path: "nurse-dashboard", element: <NurseDashboard /> },
      { path: "blood-status", element: <BloodDonateRequestStatusTable/> },
      { path: "blood-requests-table", element: <BloodDonationScheduleTable /> },
    ],
    
  }
]);
