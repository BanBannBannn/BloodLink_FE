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
import { MoreHorizontal } from "lucide-react";
import SupervisorDonationSummaryDashboard from "./donation-summary-dashboard";

export default function BloodRawTable() {
  const { data, loading, error, refresh } = useBloodHistory();
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "1" | "3">("all");
  const [pageIndex, setPageIndex] = useState(0);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lịch sử nhận máu</h1>
      <SupervisorDonationSummaryDashboard />
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
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val as "all" | "1" | "3");
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="1">Chưa kiểm tra</SelectItem>
            <SelectItem value="3">Đã kiểm tra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Mã yêu cầu</th>
                <th className="p-2">Nhóm máu</th>
                <th className="p-2">Ngày nhận máu</th>
                <th className="p-2">Thể tích</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Ghi chú</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry, idx) => (
                <React.Fragment key={entry.id}>
                  <tr className="border-t text-center">
                    <td className="p-2">{entry.code || `${idx + 1}`}</td>
                    <td className="p-2">
                      {bloodTypes[entry.bloodType] || "-"}
                    </td>
                    <td className="p-2">
                      {new Date(entry.donationDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-2">{entry.volume} ml</td>
                    <td
                      className={`p-2 ${
                        entry.status === 3
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {entry.status === 3 ? "Đã kiểm tra" : "Chưa kiểm tra"}
                    </td>
                    <td className="p-2">{entry.description || "-"}</td>
                    <td className="p-2 flex justify-center gap-2">
                      {entry.status === 1 && (
                        <button
                          onClick={() => setSelectedDonation(entry)}
                          className="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-100"
                        >
                          Điền form
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setExpandedRowId(
                            expandedRowId === entry.id ? null : entry.id
                          )
                        }
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  {/* Details */}
                  {expandedRowId === entry.id && (
                    <tr className="bg-gray-50 text-left">
                      <td colSpan={7} className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>
                              <strong>Họ tên:</strong>{" "}
                              {entry.bloodDonationRequest?.fullName}
                            </p>
                            <p>
                              <strong>Giới tính:</strong>{" "}
                              {entry.bloodDonationRequest?.gender
                                ? "Nam"
                                : "Nữ"}
                            </p>
                            <p>
                              <strong>Tuổi:</strong>{" "}
                              {entry.bloodDonationRequest?.healthCheckForm
                                ?.age || "-"}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {entry.bloodDonationRequest?.email}
                            </p>
                            <p>
                              <strong>Địa chỉ:</strong>{" "}
                              {entry.bloodDonationRequest?.addresss}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <img
                                src={
                                  entry.bloodDonationRequest?.frontUrlIdentity
                                }
                                alt="CCCD mặt trước"
                                className="w-full max-h-[250px] object-contain border rounded"
                              />
                              <p className="mt-1 text-sm text-center">
                                CCCD mặt trước
                              </p>
                            </div>
                            <div className="flex-1">
                              <img
                                src={
                                  entry.bloodDonationRequest?.backUrlIdentity
                                }
                                alt="CCCD mặt sau"
                                className="w-full max-h-[250px] object-contain border rounded"
                              />
                              <p className="mt-1 text-sm text-center">
                                CCCD mặt sau
                              </p>
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

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span>
              Trang {pageIndex + 1} /{" "}
              {Math.ceil(filteredData.length / pageSize) || 1}
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
  );
}
