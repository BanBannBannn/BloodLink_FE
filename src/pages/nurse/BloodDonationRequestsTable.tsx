// Bắt đầu file BloodDonationRequestsTable.tsx
import React, { useState } from "react";
import useBloodDonationRequests from "@/hooks/useBloodDonationRequests";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import HealthCheckFormModal from "./HealthCheckFormModal";
import { Calendar, Droplet, EyeIcon, Filter, MoreHorizontal, Search } from "lucide-react";
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
import BloodStatisticsDashboard from "./blood-statistics-dashboard";

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
        `/blood-donation-requests/status/${id}?status=2&rejectNote=${encodeURIComponent(rejectNote.trim())}`
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
    const matchStatus =
      statusFilter === "all" || `${item.status}` === statusFilter;
    const matchSearch = item.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-600 font-medium text-sm">Đang chờ</span>;
      case 1:
        return <span className="text-green-600 font-medium text-sm">Đã duyệt</span>;
      case 2:
        return <span className="text-red-600 font-medium text-sm">Từ chối</span>;
      default:
        return <span>-</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yêu cầu hiến máu</h1>
          <p className="text-gray-600">Quản lý danh sách yêu cầu hiến máu và kiểm tra sức khỏe</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên người hiến..."
                value={searchQuery}
                onChange={(e) => {
                  setPageIndex(0);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v);
                setPageIndex(0);
              }}>
                <SelectTrigger className="w-48 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Tổng yêu cầu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredData.filter(d => d.status === 0).length}
              </div>
              <div className="text-sm text-gray-600">Đang chờ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.filter(d => d.status === 1).length}
              </div>
              <div className="text-sm text-gray-600">Đã duyệt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredData.filter(d => d.status === 2).length}
              </div>
              <div className="text-sm text-gray-600">Từ chối</div>
            </div>

          </div>

        </div>

        {alertMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="text-left px-6 py-3">Người hiến</th>
                <th className="text-center px-4 py-3">Nhóm máu</th>
                <th className="text-center px-4 py-3">Ngày hiến máu</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.fullName}</div>
                      <div className="text-xs text-gray-500">Mã: {item.code}</div>
                    </td>
                    <td className="text-center px-4 py-4">
                      <div className="inline-flex items-center gap-1 text-sm text-red-600 font-semibold">
                        <Droplet className="w-4 h-4" />
                        {bloodTypes[item.bloodType] || "-"}
                      </div>
                    </td>
                    <td className="text-center px-4 py-4 text-sm text-gray-700">
                      <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                      {new Date(item.donatedDateRequest).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="text-center px-4 py-4">
                      {renderStatus(item.status)}
                    </td>
                    <td className="text-center px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {item.status === 0 && (
                          <button
                            onClick={() => setViewHealthForm(item)}
                            className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-xs font-medium"
                          >
                            Điền form
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setExpandedRowId(expandedRowId === item.id ? null : item.id)
                          }
                          className="text-gray-500 hover:text-black"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Row */}
                  {expandedRowId === item.id && (
                    <tr className="bg-gray-50 text-left">
                      <td colSpan={5} className="px-6 py-4">
                        <p><strong>Giới tính:</strong> {item.gender ? "Nam" : "Nữ"}</p>
                        <p><strong>Tuổi:</strong> {item.age || "-"}</p>
                        <p><strong>Mã định danh:</strong> {item.identityId || "-"}</p>
                        <p><strong>Ghi chú:</strong> {item.reasonReject || item.healthCheckForm?.note || "-"}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          {item.frontUrlIdentity && (
                            <div>
                              <img src={item.frontUrlIdentity} alt="CCCD mặt trước" className="w-full max-h-[250px] object-contain border rounded" />
                              <p className="text-sm text-center mt-1">CCCD mặt trước</p>
                            </div>
                          )}
                          {item.backUrlIdentity && (
                            <div>
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
          <div className="flex justify-between items-center p-4">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span>Trang {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize) || 1}</span>
            <button
              disabled={(pageIndex + 1) * pageSize >= filteredData.length}
              onClick={() => setPageIndex(pageIndex + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>

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
    </div>
  );
}
