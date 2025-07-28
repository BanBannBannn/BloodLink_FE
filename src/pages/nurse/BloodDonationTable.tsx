import React, { useState } from "react";
import useBloodDonation from "@/hooks/useBloodDonation";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import { bloodTypes } from "@/constants/constants";
import BloodDonationHistoryDashboard from "./blood-donation-history-dashboard";

export default function BloodDonationTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const pageSize = 5;

  const { data,  refresh } = useBloodDonation({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: number) => {
    setProcessingId(id);
    setAlertMessage(null);
    try {
      await apiClient.put(`/blood-donations/${id}/status?status=${status}`);
      setSuccessMessage(status === 1 ? "Cập nhật trạng thái: Đã hiến máu" : "Đã từ chối thành công");
      await refresh();
    } catch (err: any) {
      const { message, detail } = err.response?.data || {};
      setAlertMessage(
        `${message || "Có lỗi xảy ra"}${detail ? `: ${detail}` : ""}`
      );
    } finally {
      setProcessingId(null);
    }
  };


  const filteredData = data.filter((item) => {
    const nameMatch = item.bloodDonationRequest?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const statusMatch =
      statusFilter === "all" || item.status.toString() === statusFilter;
    return nameMatch && statusMatch;
  });

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <BloodDonationHistoryDashboard />

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Tìm theo tên..."
                value={searchQuery}
                onChange={(e) => {
                  setPageIndex(0);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 border-gray-300"
              />
            </div>
            <div className="relative">
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="0">Đang hiến máu</SelectItem>
                  <SelectItem value="1">Đã hiến máu</SelectItem>
                  <SelectItem value="2">Hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <AlertDialog
          open={!!alertMessage}
          onOpenChange={(open) => !open && setAlertMessage(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lỗi</AlertDialogTitle>
              <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertMessage(null)}>
                Đóng
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="bg-white rounded-lg shadow-sm border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="text-left px-6 py-3">Mã</th>
                <th className="text-center px-4 py-3">Tên</th>
                <th className="text-center px-4 py-3">Nhóm máu</th>
                <th className="text-center px-4 py-3">Ngày hiến máu</th>
                <th className="text-center px-4 py-3">Thể tích</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.code || pageIndex * pageSize + index + 1}
                    </td>
                    <td className="text-center px-4 py-4">
                      {item.bloodDonationRequest?.fullName}
                    </td>
                    <td className="text-center px-4 py-4 text-red-600 font-semibold">
                      {bloodTypes[item.bloodType]}
                    </td>
                    <td className="text-center px-4 py-4">
                      {new Date(item.donationDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="text-center px-4 py-4">{item.volume} ml</td>
                    <td
                      className={`text-center px-4 py-4 capitalize ${item.status === 0
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
                          : "Hủy"}
                    </td>
                    <td className="text-center px-4 py-4 flex justify-center gap-2">
                      {item.status === 0 && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(item.id, 1)}
                            disabled={processingId === item.id}
                            className={`text-green-500 border border-green-500 hover:bg-green-100 bg-white ${processingId === item.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                              }`}
                          >
                            {processingId === item.id
                              ? "Đang xử lý..."
                              : "Hoàn thành"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(item.id, 2)}
                            disabled={processingId === item.id}
                            className={`text-red-500 border border-red-500 hover:bg-red-100 bg-white ${processingId === item.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                              }`}
                          >
                            {processingId === item.id ? "Đang xử lý..." : "Hủy"}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          setSelectedDetail(
                            selectedDetail === item.id ? null : item.id
                          )
                        }
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </td>
                  </tr>

                  {selectedDetail === item.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <p>
                              <strong>Họ tên:</strong>{" "}
                              {item.bloodDonationRequest?.fullName}
                            </p>
                            <p>
                              <strong>Giới tính:</strong>{" "}
                              {item.bloodDonationRequest?.gender ? "Nam" : "Nữ"}
                            </p>
                            <p>
                              <strong>Tuổi:</strong>{" "}
                              {item.bloodDonationRequest?.healthCheckForm
                                ?.age || "-"}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {item.bloodDonationRequest?.email}
                            </p>
                            <p>
                              <strong>Địa chỉ:</strong>{" "}
                              {item.bloodDonationRequest?.addresss}
                            </p>
                            <p>
                              <strong>Mô tả:</strong> {item.description}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700">
                              Hình ảnh CCCD
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {item.bloodDonationRequest?.frontUrlIdentity && (
                                <div className="min-w-[300px]">
                                  <img
                                    src={
                                      item.bloodDonationRequest.frontUrlIdentity
                                    }
                                    alt="CCCD mặt trước"
                                    className="w-full max-h-[250px] object-contain border rounded"
                                  />
                                  <p className="text-sm text-center mt-1">
                                    CCCD mặt trước
                                  </p>
                                </div>
                              )}
                              {item.bloodDonationRequest?.backUrlIdentity && (
                                <div className="min-w-[300px]">
                                  <img
                                    src={
                                      item.bloodDonationRequest.backUrlIdentity
                                    }
                                    alt="CCCD mặt sau"
                                    className="w-full max-h-[250px] object-contain border rounded"
                                  />
                                  <p className="text-sm text-center mt-1">
                                    CCCD mặt sau
                                  </p>
                                </div>
                              )}
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

          <div className="flex justify-between items-center p-4">
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
          
          <AlertDialog
            open={!!successMessage}
            onOpenChange={(open) => !open && setSuccessMessage(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Thành công</AlertDialogTitle>
                <AlertDialogDescription>{successMessage}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setSuccessMessage(null)}>Đóng</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
