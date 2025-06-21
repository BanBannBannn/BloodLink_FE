import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function NurseLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold text-xl mb-4">Nurse Dashboard</h2>
        <nav className="space-y-2">
          <Link to="/nurse" className="block p-2 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          <Link to="/nurse/blood-requests-table" className="block p-2 rounded hover:bg-gray-100">
            Lịch hiến máu
          </Link>
          <Link to="/nurse/blood-status" className="block p-2 rounded hover:bg-gray-100">
            Trạng thái 
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}
