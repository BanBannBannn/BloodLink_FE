import React, { useState } from "react";
import useBloodDonationRequests from "@/hooks/useBloodDonationRequests";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import HealthCheckFormModal from "./HealthCheckFormModal";
import { EyeIcon, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BloodDonationRequestsTable() {
  const { data, loading, error, refresh } = useBloodDonationRequests();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewHealthForm, setViewHealthForm] = useState<any | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleReject = async (id: string) => {
    const rejectNote = prompt("Nhập lý do từ chối:");
    if (!rejectNote || rejectNote.trim() === "") {
      setAlertMessage("Vui lòng nhập lý do từ chối để tiếp tục.");
      return;
    }

    try {
      await axiosInstance.put(
        `/api/blood-donation-requests/status/${id}?status=2&rejectNote=${encodeURIComponent(
          rejectNote.trim()
        )}`
      );
      refresh();
    } catch (error) {
      setAlertMessage("Đã xảy ra lỗi khi từ chối yêu cầu.");
    }
  };

  const handleOpenForm = (request: any) => {
    setSelectedRequest(request);
    setShowHealthForm(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu cầu hiến máu</h1>

      {alertMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Nhóm máu</th>
              <th className="p-2">Ngày yêu cầu</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="border-t text-center">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.fullName}</td>
                  <td className="p-2">{["O", "A", "B", "AB"][item.bloodType]}</td>
                  <td className="p-2">
                    {new Date(item.donatedDateRequest).toLocaleDateString("vi-VN")}
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
                  <td className="p-2 flex gap-2 justify-center">
                    {item.status === 0 && !item.healthCheckForm && (
                      <Button onClick={() => handleOpenForm(item)}>
                        Điền form
                      </Button>
                    )}
                    {item.status === 0 && item.healthCheckForm && (
                      <>
                        <Button
                          onClick={() => handleReject(item.id)}
                          className="text-red-500 border border-red-500 hover:bg-red-100"
                        >
                          Từ chối
                        </Button>
                        <Button
                          onClick={() => {
                            axiosInstance
                              .put(`/api/blood-donation-requests/status/${item.id}?status=1`)
                              .then(refresh)
                              .catch(() => setAlertMessage("Cập nhật trạng thái thất bại!"));
                          }}
                          className="text-green-500 border border-green-500 hover:bg-green-100"
                        >
                          Duyệt
                        </Button>
                      </>
                    )}
                    {item.healthCheckForm && (
                      <Button
                        variant="outline"
                        className="p-2"
                        onClick={() => setViewHealthForm(item)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="p-2"
                      onClick={() =>
                        expandedRowId === item.id
                          ? setExpandedRowId(null)
                          : setExpandedRowId(item.id)
                      }
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
                {expandedRowId === item.id && (
                  <tr className="border-t bg-gray-50">
                    <td colSpan={6} className="p-4 text-left text-sm">
                      <p><strong>Họ tên:</strong> {item.fullName}</p>
                      <p><strong>Giới tính:</strong> {item.gender ? "Nam" : "Nữ"}</p>
                      <p><strong>Tuổi:</strong> {item.age || "-"}</p>
                      <p><strong>Mã định danh:</strong> {item.identityId || "-"}</p>
                      <p><strong>Nhóm máu:</strong> {[
                        "O",
                        "A",
                        "B",
                        "AB",
                      ][item.bloodType]}</p>
                      <p><strong>Ngày yêu cầu:</strong> {new Date(
                        item.donatedDateRequest
                      ).toLocaleDateString("vi-VN")}</p>
                      <p><strong>Ghi chú:</strong> {item.reasonReject || item.healthCheckForm?.note || "-"}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {selectedRequest && showHealthForm && (
        <HealthCheckFormModal
          request={selectedRequest}
          onClose={() => {
            setShowHealthForm(false);
            setSelectedRequest(null);
            refresh();
          }}
        />
      )}

      {viewHealthForm && (
        <HealthCheckFormModal
          request={viewHealthForm}
          onClose={() => setViewHealthForm(null)}
        />
      )}
    </div>
  );
}
