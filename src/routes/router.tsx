import UserLayout from "@/layouts/UserLayout";
import HomePage from "@/pages/public/Home";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import BloodDonation from "@/pages/user/BloodDonation";
import ProfilePage from "@/pages/user/Profile";
import BloodDonationHistory from "@/pages/user/BloodDonationHistory";
import AdminLayout from "@/layouts/AdminLayout";

import AdminDashboard from "@/pages/admin/Dashboard";
import AccountManagement from "@/pages/admin/AccountManagement";

import SupervisorLayout from "@/layouts/SupervisorLayout";
import SupervisorDashboard from "@/pages/bloodStorage/Dashboard";
import BloodRawTable from "@/pages/bloodStorage/BloodRawTable";
import BloodComponentsTable from "@/pages/bloodStorage/BloodComponentsTable";
import BloodHistoryTable from "@/pages/bloodStorage/BloodHistoryTable";
import BloodRequestTable from "@/pages/bloodStorage/BloodRequestTable";

import BloodDonationScheduleTable from "@/pages/nurse/BloodDonationTable";
import BloodDonationRequestsTable from "@/pages/nurse/BloodDonationRequestsTable";
import NurseDashboard from "@/pages/nurse/Dashboard";
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
      { path: "blood-donation-table", element: <BloodDonationScheduleTable/> },
      { path: "blood-requests-table", element: <BloodDonationRequestsTable /> }
    ],
    
  }
]);
