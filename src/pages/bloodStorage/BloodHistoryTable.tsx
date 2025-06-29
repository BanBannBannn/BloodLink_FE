import React from "react";
import useBloodHistory from "@/hooks/useBloodHistory";

export default function BloodHistoryTable() {
  const { data, loading, error } = useBloodHistory();

  const bloodTypeMap = ["O", "A", "B", "AB"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lịch sử nhập máu</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">STT</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Nhóm máu</th>
              <th className="p-2">Ngày yêu cầu</th>
              <th className="p-2">Thể tích</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={entry.id} className="border-t text-center">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{entry.bloodDonationRequest?.fullName}</td>
                <td className="p-2">{bloodTypeMap[entry.bloodType]}</td>
                <td className="p-2">{new Date(entry.donationDate).toLocaleDateString("vi-VN")}</td>
                <td className="p-2">{entry.volume} ml</td>
                <td className={`p-2 ${entry.status === 1 ? "text-green-600" : "text-yellow-600"}`}>
                  {entry.status === 1 ? "Đã nhập" : "Đang xử lý"}
                </td>
                <td className="p-2">{entry.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
