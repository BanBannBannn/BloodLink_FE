import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function SupervisorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold text-xl mb-4">Blood Store Supervisor</h2>
        <nav className="space-y-2">
          <Link to="/supervisor" className="block p-2 rounded hover:bg-gray-100">
            Tổng quan
          </Link>
          <Link to="/supervisor/blood-raw" className="block p-2 rounded hover:bg-gray-100">
            Lịch sử nhận máu
          </Link>
          <Link to="/supervisor/blood-components" className="block p-2 rounded hover:bg-gray-100">
            Kho máu
          </Link>
          <Link to="/supervisor/history" className="block p-2 rounded hover:bg-gray-100">
            Lịch sử xuất nhập
          </Link>
          <Link to="/supervisor/blood-requests" className="block p-2 rounded hover:bg-gray-100">
            Yêu cầu xuất kho
          </Link>
        </nav>

      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
