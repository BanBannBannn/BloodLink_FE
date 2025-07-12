import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowsUpDownIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function SupervisorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r px-2 py-6 text-nowrap shadow-md flex flex-col">
        <h2 className="font-bold text-center text-xl mb-6 tracking-wide text-primary">
          BloodLink
        </h2>
        <div className="flex-1">
          <nav className="space-y-3 flex-1 flex flex-col">
            <Link
              to="/supervisor"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
                location.pathname === "/supervisor"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <ChartPieIcon className="w-5 h-5" />
              Tổng quan
            </Link>
            <Link
              to="/supervisor/blood-donation-history"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
                location.pathname === "/supervisor/blood-donation-history"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <ArrowsUpDownIcon className="w-5 h-5" />
              Lịch sử nhận máu
            </Link>
            <Link
              to="/supervisor/blood-sotage"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
                location.pathname === "/supervisor/blood-sotage"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Kho máu
            </Link>
            <Link
              to="/supervisor/emergency-blood-requests"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
                location.pathname === "/supervisor/emergency-blood-requests"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Máu khẩn cấp
            </Link>
            <Link
              to="/supervisor/export-blood-requests"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 ${
                location.pathname === "/supervisor/export-blood-requests"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Yêu cầu xuất máu
            </Link>
          </nav>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button
              asChild
              variant={"ghost"}
              className="w-full justify-start text-lg hover:bg-red-50"
            >
              <div className="flex items-center gap-2 text-red-600">
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-96">
            <DialogHeader className="text-xl">
              Bạn chắc chắc đang muốn đăng xuất?
            </DialogHeader>
            <DialogFooter className="">
              <Button onClick={() => setOpen(false)}>Hủy</Button>
              <Button onClick={handleLogout}>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
