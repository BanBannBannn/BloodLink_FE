import React from "react";

export default function SupervisorDashboard() {
  const totalBlood = 1200;
  const totalProcessed = 800;
  const totalInStock = 400;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tổng quan kho máu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-2">Tổng nhập kho</h2>
          <p className="text-3xl font-bold">{totalBlood} đơn vị</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-2">Tổng xuất chế phẩm</h2>
          <p className="text-3xl font-bold">{totalProcessed} đơn vị</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-2">Tồn kho hiện tại</h2>
          <p className="text-3xl font-bold">{totalInStock} đơn vị</p>
        </div>
      </div>
    </div>
  );
}
