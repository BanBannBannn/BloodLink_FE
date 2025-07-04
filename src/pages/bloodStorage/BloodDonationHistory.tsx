import React, { useState } from "react";
import useBloodHistory from "@/hooks/useBloodHistory";
import BloodCheckFormModal from "@/pages/bloodStorage/BloodCheckFormModal";
import { bloodTypes } from "@/constants/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Droplet, Filter, MoreHorizontal, Search, TestTube, Droplets } from "lucide-react";

export default function BloodRawTable() {
  const { data, loading, error, refresh } = useBloodHistory();
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "1" | "0" | "3">("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const pageSize = 5;

  const filteredData = data.filter((entry) => {
    const matchesName = entry.bloodDonationRequest?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || entry.status.toString() === statusFilter;
    return matchesName && matchesStatus;
  });

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const getStatusBadge = (status: number) => {
    if (status === 3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <TestTube className="w-3 h-3 mr-1" />
          Đã kiểm tra
        </span>
      );
    }
    if (status === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
          <TestTube className="w-3 h-3 mr-1" />
          Đang hiến máu
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <Calendar className="w-3 h-3 mr-1" />
        Chưa kiểm tra
      </span>
    );
  };


  const handleOpenForm = async (entry: any) => {
    setProcessingId(entry.id);
    setAlertMessage(null);
    try {
      setSelectedDonation(entry);
    } catch (err: any) {
      const msg = err.response?.data?.title || "Có lỗi xảy ra khi mở form!";
      setAlertMessage(msg);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Kho Máu</h1>
          <p className="text-gray-600">Theo dõi và quản lý lịch sử nhận máu từ các tình nguyện viên</p>
        </div>

        {/* Filters */}
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
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val as "all" | "1" | "0" | "3");
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-48 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="0">Đang hiến máu</SelectItem>
                  <SelectItem value="1">Chưa kiểm tra</SelectItem>
                  <SelectItem value="3">Đã kiểm tra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Tổng mẫu máu</div>
            </div>
              <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredData.filter(d => d.status === 0).length}
              </div>
              <div className="text-sm text-gray-600">Đang hiến máu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredData.filter(d => d.status === 1).length}
              </div>
              <div className="text-sm text-gray-600">Chưa kiểm tra</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.filter(d => d.status === 3).length}
              </div>
              <div className="text-sm text-gray-600">Đã kiểm tra</div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Có lỗi xảy ra</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {alertMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="text-left px-6 py-3">Thông tin </th>
                    <th className="text-center px-4 py-3">Nhóm máu</th>
                    <th className="text-center px-4 py-3">Ngày nhận</th>
                    <th className="text-center px-4 py-3">Thể tích</th>
                    <th className="text-center px-4 py-3">Trạng thái</th>
                    <th className="text-center px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((entry) => (
                    <React.Fragment key={entry.id}>
                      <tr className="border-t hover:bg-gray-50 transition">
                        {/* Basic Info */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{entry.bloodDonationRequest?.fullName || "Không rõ"}</div>
                          <div className="text-xs text-gray-500">Mã: {entry.code}</div>
                        </td>

                        {/* Blood type */}
                        <td className="text-center px-4 py-4">
                          <div className="inline-flex items-center gap-1 text-sm text-red-600 font-semibold">
                            <Droplet className="w-4 h-4" />
                            {bloodTypes[entry.bloodType] || "Chưa rõ"}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                          {new Date(entry.donationDate).toLocaleDateString("vi-VN")}
                        </td>

                        {/* Volume */}
                        <td className="text-center px-4 py-4 text-sm text-gray-800">
                          <Droplets className="inline w-4 h-4 mr-1" />
                          {entry.volume} ml
                        </td>

                        {/* Status */}
                        <td className="text-center px-4 py-4">
                          {getStatusBadge(entry.status)}
                        </td>

                        {/* Actions */}
                        <td className="text-center px-4 py-4">
                          <div className="flex justify-center items-center gap-2">
                            {entry.status === 1 && (
                              <button
                                onClick={() => handleOpenForm(entry)}
                                disabled={processingId === entry.id}
                                className={`px-3 py-1 text-xs font-medium rounded ${processingId === entry.id
                                  ? "border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
                                  : "border border-blue-500 text-blue-600 hover:bg-blue-50"
                                  }`}
                              >
                                {processingId === entry.id ? "Đang mở..." : "Điền form"}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setExpandedRowId(expandedRowId === entry.id ? null : entry.id)
                              }
                              className="text-gray-500 hover:text-black"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row */}
                      {expandedRowId === entry.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center">
                                  🧾 Chi tiết thông tin
                                </h3>
                                <p><strong>Họ tên:</strong> {entry.bloodDonationRequest?.fullName}</p>
                                <p><strong>Giới tính:</strong> {entry.bloodDonationRequest?.gender ? "Nam" : "Nữ"}</p>
                                <p><strong>Tuổi:</strong> {entry.bloodDonationRequest?.healthCheckForm?.age || "-"}</p>
                                <p><strong>SDT:</strong> {entry.bloodDonationRequest?.phoneNo}</p>
                                <p><strong>Email:</strong> {entry.bloodDonationRequest?.email}</p>
                                <p><strong>Số cccd:</strong> {entry.bloodDonationRequest?.identityId}</p>
                                <p><strong>Địa chỉ:</strong> {entry.bloodDonationRequest?.addresss}</p>
                                <div>
                                  <h3 className="text-sm font-semibold mb-2 text-gray-700">📌 Ghi chú</h3>
                                  <p> <strong>{entry.bloodDonationRequest?.description}</strong></p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-semibold mb-2 text-gray-700"> Hình ảnh CCCD</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <img
                                      src={entry.bloodDonationRequest?.frontUrlIdentity}
                                      alt="CCCD mặt trước"
                                      className="w-full max-h-[250px] object-contain border rounded"
                                    />
                                    <p className="mt-1 text-sm text-center">CCCD mặt trước</p>
                                  </div>
                                  <div>
                                    <img
                                      src={entry.bloodDonationRequest?.backUrlIdentity}
                                      alt="CCCD mặt sau"
                                      className="w-full max-h-[250px] object-contain border rounded"
                                    />
                                    <p className="mt-1 text-sm text-center">CCCD mặt sau</p>
                                  </div>
                                </div>
                              </div>
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
        </div>

        {/* Form Modal */}
        {selectedDonation && (
          <BloodCheckFormModal
            donation={selectedDonation}
            onClose={() => {
              setSelectedDonation(null);
              refresh();
            }}
          />
        )}
      </div>
    </div >
  );
}
