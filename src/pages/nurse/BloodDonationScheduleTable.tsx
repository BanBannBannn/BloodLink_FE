import React from "react";
import useBloodDonation from "@/hooks/useBloodDonation";
import { Button } from "@/components/ui/button";

export default function BloodDonationTable() {
  const { data, loading, error, totalRecords } = useBloodDonation({});

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách hiến máu</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Mã yêu cầu</th>
              <th className="p-2">Nhóm máu</th>
              <th className="p-2">Ngày yêu cầu</th>
              <th className="p-2">Thể tích</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.bloodType}</td>
                <td className="p-2">
                  {new Date(item.donatedDateRequest).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {item.healthCheckForm?.volumeBloodDonated ?? "-"} ml
                </td>
                <td
                  className={`p-2 capitalize ${
                    item.status === 0
                      ? "text-yellow-600"
                      : item.status === 1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status === 0
                    ? "Đang hiến máu"
                    : item.status === 1
                    ? "Đã hiến máu"
                    : "Từ chối"}
                </td>
                <td className="p-2">{item.reasonReject || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-2 text-sm text-gray-500">
        Tổng số bản ghi: {totalRecords}
      </p>
    </div>
  );
}
