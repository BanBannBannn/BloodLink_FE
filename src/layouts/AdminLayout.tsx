import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r p-6 text-nowrap shadow-md">
        <h2 className="font-bold text-center text-xl mb-6 tracking-wide text-primary">
          Admin Dashboard
        </h2>
        <nav className="space-y-3 flex flex-col">
          <Link
            to="/admin"
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
              location.pathname === "/admin"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700"
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/admin/accounts"
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
              location.pathname === "/admin/accounts"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700"
            }`}
          >
            <UsersIcon className="w-5 h-5" />
            Quản lý tài khoản
          </Link>
          <Link
            to="/admin/nurse-management"
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
              location.pathname === "/admin/nurse-management"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700"
            }`}
          >
            <UserGroupIcon className="w-5 h-5" />
            Quản lý y tá
          </Link>
          <Button
            variant={"ghost"}
            className="flex items-center gap-3 justify-start p-2 rounded-lg hover:bg-red-50 text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </Button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
