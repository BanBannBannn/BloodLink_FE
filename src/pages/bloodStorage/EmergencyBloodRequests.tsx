import React, { useEffect, useState } from "react";
import useEmergencyRequests from "@/hooks/useEmergencyBloodRequests";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import SupervisorExportSummaryDashboard from "./emergency-request-summary-dashboard";

export default function EmergencyBloodRequestsPage() {
  const { data: requests, refresh } = useEmergencyRequests();
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    axiosInstance
      .get("/blood-groups")
      .then((res) => setBloodGroups(res.data || []))
      .catch((err) => console.error("Error fetching blood groups", err));
  }, []);
  const token = localStorage.getItem("token");
  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      await axiosInstance.put(
        `/emergency-blood-requests/${selectedRequest.id}`,
        {
          address: selectedRequest.address,
          volume: selectedRequest.volume,
          bloodComponentId: selectedRequest.bloodComponent?.id,
          bloodGroupId: selectedRequest.bloodGroup?.id,
          reasonReject: "",
          status: 2,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await refresh();
      alert("Đã chuyển sang trạng thái 'Đang xử lý'");
    } catch (error: any) {
      alert(
        error.response?.data?.title ||
          error.response?.data?.message ||
          "Có lỗi xảy ra khi từ duyệt!"
      );
    }
    console.log("Token:", localStorage.getItem("token"));
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    try {
      await axiosInstance.put(
        `/emergency-blood-requests/${selectedRequest.id}`,
        {
          address: selectedRequest.address,
          volume: selectedRequest.volume,
          bloodComponentId: selectedRequest.bloodComponent?.id,
          bloodGroupId: selectedRequest.bloodGroup?.id,
          reasonReject: "",
          status: 1,
        }
      );

      setShowRejectPopup(false);
      setSelectedRequest(null);
      await refresh();
      alert("Từ chối yêu cầu thành công!");
    } catch (error: any) {
      console.error("Error rejecting", error);
      alert(
        error.response?.data?.title ||
          error.response?.data?.message ||
          "Có lỗi xảy ra khi từ chối!"
      );
    }
  };

  const filtered = requests.filter((r) => {
    const matchGroup =
      groupFilter === "all" || r.bloodGroup?.id === groupFilter;
    const matchStatus =
      statusFilter === "all" || String(r.status) === statusFilter;
    return matchGroup && matchStatus;
  });

  const paginatedData = filtered.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Yêu cầu xuất máu khẩn cấp</h1>
      <SupervisorExportSummaryDashboard />
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-56 pl-10">
              <SelectValue placeholder="Lọc theo nhóm máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhóm máu</SelectItem>
              {bloodGroups.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-56 pl-10">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="0">Đang chờ</SelectItem>
              <SelectItem value="1">Từ chối</SelectItem>
              <SelectItem value="2">Đang xử lý</SelectItem>
              <SelectItem value="3">Đã hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg border">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Mã</th>
              <th className="px-4 py-2">Địa chỉ</th>
              <th className="px-4 py-2">Thể tích</th>
              <th className="px-4 py-2">Nhóm máu</th>
              <th className="px-4 py-2">Loại chế phẩm</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedData.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {req.code}
                  </td>
                  <td className="px-4 py-2">{req.address}</td>
                  <td className="px-4 py-2">{req.volume} ml</td>
                  <td className="px-10 py-4 text-red-600 font-semibold">
                    {req.bloodGroup.displayName}
                  </td>
                  <td className="px-4 py-2">{req.bloodComponent.name}</td>
                  <td className="px-4 py-2">
                    {req.status === 0
                      ? "Đang chờ"
                      : req.status === 1
                      ? "Từ chối"
                      : req.status === 2
                      ? "Đang xử lý"
                      : "Hoàn thành"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {req.status === 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRequest(req)}
                      >
                        Xuất máu
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
          Trang {pageIndex + 1} / {Math.ceil(filtered.length / pageSize) || 1}
        </span>
        <button
          disabled={(pageIndex + 1) * pageSize >= filtered.length}
          onClick={() => setPageIndex(pageIndex + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      <AlertDialog
        open={!!selectedRequest && !showRejectPopup}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xử lý yêu cầu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn muốn xử lý yêu cầu <strong>{selectedRequest?.code}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 justify-between">
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => setShowRejectPopup(true)}
            >
              Từ chối
            </Button>
            <AlertDialogAction onClick={handleApprove}>Duyệt</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectPopup} onOpenChange={setShowRejectPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nhập lý do từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng nhập lý do từ chối yêu cầu{" "}
              <strong>{selectedRequest?.code}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full border mt-2 px-2 py-1 rounded text-sm"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRejectPopup(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
