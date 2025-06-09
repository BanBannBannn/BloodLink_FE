import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
    
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold text-xl mb-4">Admin Dashboard</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block p-2 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          <Link to="/admin/accounts" className="block p-2 rounded hover:bg-gray-100">
            Quản lý tài khoản
          </Link>
        </nav>
      </aside>

    
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
