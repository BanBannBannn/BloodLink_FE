import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface BloodDonateRequest {
  id: number;
  donorName: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
}

const initialData: BloodDonateRequest[] = [
  { id: 1, donorName: "Nguyễn ", requestDate: "2025-06-05", status: "pending" },
  { id: 2, donorName: "Nhân", requestDate: "2025-06-06", status: "pending" },
  { id: 3, donorName: "Hưng", requestDate: "2025-06-07", status: "rejected", note: "Không đạt yêu cầu sức khỏe" },
];

export default function BloodDonateRequestStatusTable() {
  const [requests, setRequests] = useState<BloodDonateRequest[]>(initialData);

  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "approved", note: "" } : req
      )
    );
  };

  const handleReject = (id: number) => {
    const note = prompt("Nhập lý do từ chối:");
    if (note !== null) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "rejected", note } : req
        )
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Trạng thái yêu cầu hiến máu</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Mã yêu cầu</th>
            <th className="p-2">Người hiến máu</th>
            <th className="p-2">Ngày yêu cầu</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Ghi chú</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t text-center">
              <td className="p-2">{req.id}</td>
              <td className="p-2">{req.donorName}</td>
              <td className="p-2">{req.requestDate}</td>
              <td
                className={`p-2 capitalize ${req.status === "pending"
                    ? "text-yellow-600"
                    : req.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
              >
                {req.status === "pending"
                  ? "Đang chờ"
                  : req.status === "approved"
                    ? "Đã duyệt"
                    : "Từ chối"}
              </td>
              <td className="p-2">
                {req.status === "rejected" ? req.note || "-" : "-"}
              </td>
              <td className="p-2 flex justify-center gap-2">
                <Button
                  variant="outline"
                  className="text-green-500 border-green-500 hover:bg-green-100"
                  onClick={() => handleApprove(req.id)}
                >
                  Duyệt
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-100"
                  onClick={() => handleReject(req.id)}
                >
                  Từ chối
                </Button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
