import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BloodRequest {
  id: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
}

const mockData: BloodRequest[] = [
  { id: 1, requestDate: "2025-06-02", status: "pending" },
  { id: 2, requestDate: "2025-06-01", status: "approved" },
];

export default function BloodRequestTable() {
  const [requests, setRequests] = useState<BloodRequest[]>(mockData);
  const [rejectNote, setRejectNote] = useState<string>("");

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
      <h1 className="text-2xl font-bold mb-4">Yêu cầu xuất kho máu</h1>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">STT</th>
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
              <td className="p-2">{req.requestDate}</td>
              <td className="p-2 capitalize">
                {req.status === "pending"
                  ? "Đang chờ"
                  : req.status === "approved"
                  ? "Đã duyệt"
                  : "Từ chối"}
              </td>
              <td className="p-2">{req.note || "-"}</td>
              <td className="p-2 flex justify-center gap-2">
                {req.status === "pending" && (
                  <>
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
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
