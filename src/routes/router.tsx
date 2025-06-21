import UserLayout from "@/layouts/UserLayout";
import HomePage from "@/pages/public/Home";
import LoginPage from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import BloodDonation from "@/pages/user/BloodDonation";
import ProfilePage from "@/pages/user/Profile";
import BloodDonationHistory from "@/pages/user/BloodDonationHistory";
import FAQ from "@/pages/public/FAQ";
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
]);
