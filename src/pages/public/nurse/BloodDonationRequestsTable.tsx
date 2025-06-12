import React, { useState } from "react";
import useBloodDonationRequests from "@/hooks/useBloodDonationRequests";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import HealthCheckFormModal from "./HealthCheckFormModal";
import { Eye } from "lucide-react";

export default function BloodDonationRequestsTable() {
  const { data, loading, error, refresh } = useBloodDonationRequests();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);

  const handleOpenHealthForm = (id: string) => {
    setSelectedId(id);
    setShowHealthForm(true);
  };

  const updateStatus = async (
    id: string,
    status: number,
    rejectNote?: string
  ) => {
    try {
      const url = `/api/blood-donation-requests/status/${id}?status=${status}`;
      const body = rejectNote ? { rejectNote } : {};
      await axiosInstance.put(url, body);
      alert("Cập nhật trạng thái thành công!");
      refresh();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleReject = async (id: string) => {
    const rejectNote = prompt("Nhập lý do từ chối:");
    if (!rejectNote || rejectNote.trim() === "") {
      alert("Vui lòng nhập lý do từ chối để tiếp tục.");
      return;
    }

    try {
      console.log("Gửi API từ chối với ID:", id); 
      console.log("Reject note:", rejectNote);

      const encodedNote = encodeURIComponent(rejectNote.trim());

      await axiosInstance.put(
        `/api/blood-donation-requests/status/${id}?status=2&rejectNote=${encodedNote}`
      );

      console.log("✅ API gọi thành công!");
      alert("Đã từ chối thành công.");
      refresh();
    } catch (error: any) {
      console.error("❌ Lỗi khi gọi API:", error.response?.data || error.message);
      alert("Cập nhật trạng thái thất bại!");
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu cầu hiến máu</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Nhóm máu</th>
              <th className="p-2">Ngày yêu cầu</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Ghi chú</th>
              <th className="p-2">Hành động</th>
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
                <td
                  className={`p-2 capitalize ${item.status === 0
                    ? "text-yellow-600"
                    : item.status === 1
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {item.status === 0
                    ? "Đang chờ"
                    : item.status === 1
                      ? "Đã duyệt"
                      : "Từ chối"}
                </td>
                <td className="p-2">{item.rejectNote || "-"}</td>
                <td className="p-2">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenHealthForm(item.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {item.status === 0 && (
                      <>
                        <Button variant="outline"
                          onClick={() => handleOpenHealthForm(item.id)}
                          className="text-green-500 hover:bg-green-100 bg-white"
                        >
                          Duyệt
                        </Button>
                        <Button variant="outline"
                          onClick={() => handleReject(item.id)}
                          className="text-red-500 hover:bg-red-100 bg-white"
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedId && showHealthForm && (
        <HealthCheckFormModal
          request={data.find((item) => item.id === selectedId)}
          onClose={() => {
            setSelectedId(null);
            setShowHealthForm(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
