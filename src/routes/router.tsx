import UserLayout from "@/layouts/UserLayout";
import BlogManagement from "@/pages/admin/BlogManagement";
import BlogDetail from "@/pages/public/BlogDetail";
import BlogList from "@/pages/public/BlogList";
import FAQ from "@/pages/public/FAQ";
import HomePage from "@/pages/public/Home";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import BloodDonation from "@/pages/user/BloodDonation";
import BloodDonationHistory from "@/pages/user/BloodDonationHistory";
import ProfilePage from "@/pages/user/Profile";

import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AccountManagement from "@/pages/admin/MemberManagement";

import SupervisorLayout from "@/layouts/SupervisorLayout";
import BloodRawTable from "@/pages/bloodStorage/BloodDonationHistory";
import BloodHistoryTable from "@/pages/bloodStorage/BloodHistoryTable";
import BloodRequestTable from "@/pages/bloodStorage/BloodRequestTable";
import BloodComponentsTable from "@/pages/bloodStorage/BloodSotage";
import SupervisorDashboard from "@/pages/bloodStorage/Dashboard";

import NurseLayout from "@/layouts/NurseLayout";
import BloodDonationRequestsTable from "@/pages/nurse/BloodDonationRequestsTable";
import BloodDonationScheduleTable from "@/pages/nurse/BloodDonationTable";
import NurseDashboard from "@/pages/nurse/Dashboard";

import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import NurseManagement from "@/pages/admin/NurseManagement";
import SupervisorManagement from "@/pages/admin/SupervisorManagement";
import EmergencyRequest from "@/pages/nurse/EmergencyRequest";
import Unauthorized from "@/pages/public/Unauthorized";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <UserLayout />
      </PublicRoute>
    ),
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
        element: (
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <BloodDonation />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/blood-donation-history",
        element: <BloodDonationHistory />,
      },
      {
        path: "/blogs",
        element: <BlogList />,
      },
      {
        path: "/blogs/:id",
        element: <BlogDetail />,
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
      { path: "blog-management", element: <BlogManagement /> },
    ],
  },

  {
    path: "/supervisor",
    element: (
      <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
        <SupervisorLayout />
      </ProtectedRoute>
    ),
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
      { path: "blood-emergency-requests", element: <EmergencyRequest /> },
    ],
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
