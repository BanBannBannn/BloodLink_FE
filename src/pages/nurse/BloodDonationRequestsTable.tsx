import React, { useState } from "react";
import useBloodDonationRequests from "@/hooks/useBloodDonationRequests";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import HealthCheckFormModal from "./HealthCheckFormModal";
import { EyeIcon, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { bloodTypes } from "@/constants/constants";

export default function BloodDonationRequestsTable() {
  const { data, loading, error, refresh } = useBloodDonationRequests();

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewHealthForm, setViewHealthForm] = useState<any | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 8;

  const handleReject = async (id: string) => {
    const rejectNote = prompt("Nhập lý do từ chối:");
    if (!rejectNote?.trim()) {
      setAlertMessage("Vui lòng nhập lý do từ chối để tiếp tục.");
      return;
    }

    try {
      await apiClient.put(
        `/blood-donation-requests/status/${id}?status=2&rejectNote=${encodeURIComponent(
          rejectNote.trim()
        )}`
      );
      refresh();
    } catch {
      setAlertMessage("Đã xảy ra lỗi khi từ chối yêu cầu.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.put(`/blood-donation-requests/status/${id}?status=1`);
      refresh();
    } catch {
      setAlertMessage("Cập nhật trạng thái thất bại!");
    }
  };

  const handleOpenForm = (request: any) => {
    setSelectedRequest(request);
    setShowHealthForm(true);
  };

  const filteredData = data.filter((item) => {
    const matchStatus = statusFilter === "all" || `${item.status}` === statusFilter;
    const matchSearch = item.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu cầu hiến máu</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm theo tên..."
          value={searchQuery}
          onChange={(e) => {
            setPageIndex(0);
            setSearchQuery(e.target.value);
          }}
          className="w-48"
        />
        <Select value={statusFilter} onValueChange={(v) => {
          setStatusFilter(v);
          setPageIndex(0);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="0">Đang chờ</SelectItem>
            <SelectItem value="1">Đã duyệt</SelectItem>
            <SelectItem value="2">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
        <>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Mã yêu cầu</th>
                <th className="p-2">Tên</th>
                <th className="p-2">Nhóm máu</th>
                <th className="p-2">Ngày yêu cầu</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className="border-t text-center">
                    <td className="p-2">{item.code ||pageIndex * pageSize + index + 1}</td>
                    <td className="p-2">{item.fullName}</td>
                    <td className="p-2">{bloodTypes[item.bloodType]}</td>
                    <td className="p-2">
                      {new Date(item.donatedDateRequest).toLocaleDateString("vi-VN")}
                    </td>
                    <td className={`p-2 capitalize ${item.status === 0 ? "text-yellow-600" : item.status === 1 ? "text-green-600" : "text-red-600"}`}>
                      {item.status === 0 ? "Đang chờ" : item.status === 1 ? "Đã duyệt" : "Từ chối"}
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      {item.status === 0 && !item.healthCheckForm && (
                        <Button onClick={() => handleOpenForm(item)} className="text-blue-500 border border-blue-500 hover:bg-blue-100 bg-white">Điền form</Button>
                      )}
                      {item.status === 0 && item.healthCheckForm && (
                        <>
                          <Button onClick={() => handleReject(item.id)} className="text-red-500 border border-red-500 hover:bg-red-100 bg-white">Từ chối</Button>
                          <Button onClick={() => handleApprove(item.id)} className="text-green-500 border border-green-500 hover:bg-green-100 bg-white">Duyệt</Button>
                        </>
                      )}
                      {item.healthCheckForm && (
                        <Button variant="outline" className="p-2" onClick={() => setViewHealthForm(item)}>
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" className="p-2" onClick={() =>
                        setExpandedRowId((prev) => (prev === item.id ? null : item.id))
                      }>
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
                        <p><strong>Nhóm máu:</strong> {bloodTypes[item.bloodType]}</p>
                        <p><strong>Ngày yêu cầu:</strong> {new Date(item.donatedDateRequest).toLocaleDateString("vi-VN")}</p>
                        <p><strong>Ghi chú:</strong> {item.reasonReject || item.healthCheckForm?.note || "-"}</p>

                        <div className="flex gap-4 mt-4">
                          {item.frontUrlIdentity && (
                            <div className="flex-1">
                              <img src={item.frontUrlIdentity} alt="CCCD mặt trước" className="w-full max-h-[250px] object-contain border rounded" />
                              <p className="text-sm text-center mt-1">CCCD mặt trước</p>
                            </div>
                          )}
                          {item.backUrlIdentity && (
                            <div className="flex-1">
                              <img src={item.backUrlIdentity} alt="CCCD mặt sau" className="w-full max-h-[250px] object-contain border rounded" />
                              <p className="text-sm text-center mt-1">CCCD mặt sau</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span>
              Trang {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize) || 1}
            </span>
            <button
              disabled={(pageIndex + 1) * pageSize >= filteredData.length}
              onClick={() => setPageIndex(pageIndex + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </>
      )}

      {/* Modals */}
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
