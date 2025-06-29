import UserLayout from "@/layouts/UserLayout";
import HomePage from "@/pages/public/Home";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import BloodDonation from "@/pages/user/BloodDonation";
import ProfilePage from "@/pages/user/Profile";
import BloodDonationHistory from "@/pages/user/BloodDonationHistory";
import FAQ from "@/pages/public/FAQ";

import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AccountManagement from "@/pages/admin/MemberManagement";

import SupervisorLayout from "@/layouts/SupervisorLayout";
import SupervisorDashboard from "@/pages/bloodStorage/Dashboard";
import BloodRawTable from "@/pages/bloodStorage/BloodDonationHistory";
import BloodComponentsTable from "@/pages/bloodStorage/BloodComponentsTable";
import BloodHistoryTable from "@/pages/bloodStorage/BloodHistoryTable";
import BloodRequestTable from "@/pages/bloodStorage/BloodRequestTable";

import BloodDonationScheduleTable from "@/pages/nurse/BloodDonationTable";
import BloodDonationRequestsTable from "@/pages/nurse/BloodDonationRequestsTable";
import NurseDashboard from "@/pages/nurse/Dashboard";
import NurseLayout from "@/layouts/NurseLayout";

import { createBrowserRouter } from "react-router-dom";
import NurseManagement from "@/pages/admin/NurseManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import Unauthorized from "@/pages/public/Unauthorized";
import SupervisorManagement from "@/pages/admin/SupervisorManagement";

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
        path: "/faq",
        element: <FAQ />,
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
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "member-management", element: <AccountManagement /> },
      { path: "nurse-management", element: <NurseManagement /> },
      { path: "supervisor-management", element: <SupervisorManagement /> },
    ],
  },

  {
    path: "/supervisor",
    element: <SupervisorLayout />,
    children: [
      { path: "supervisor-dashboard", element: <SupervisorDashboard /> },
      { path: "blood-donation-history", element: <BloodRawTable /> },
      { path: "blood-sotage", element: <BloodComponentsTable /> },
      { path: "history", element: <BloodHistoryTable /> },
      { path: "blood-requests", element: <BloodRequestTable /> },
    ],
  },

  {
    path: "/nurse",
    element: (
      <ProtectedRoute allowedRoles={["NURSE"]}>
        <NurseLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "nurse-dashboard", element: <NurseDashboard /> },
      { path: "blood-donation-table", element: <BloodDonationScheduleTable /> },
      { path: "blood-requests-table", element: <BloodDonationRequestsTable /> },
    ],
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
