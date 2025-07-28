import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";

export default function BloodExportPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [availableBloods, setAvailableBloods] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/emergency-blood-requests");
      setRequests(res.data.records.filter((r: any) => r.status === 2));
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu khẩn cấp:", err);
    }
  };

  const fetchAvailableBloods = async (id: string) => {
    try {
      const res = await axiosInstance.get(
        `/blood-storage/available-bloods?emergencyBloodRequestId=${id}`
      );
      const result = res.data;
      setAvailableBloods(Array.isArray(result.records) ? result.records : []);
    } catch (err) {
      console.error("Lỗi khi tải kho máu:", err);
      setAvailableBloods([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmExport = async () => {
    if (!selectedRequest || selectedIds.length === 0) return;

    try {
      await axiosInstance.post(
        `/blood-issues?EmergencyBloodRequestId=${selectedRequest.id}`,
        { bloodStorageIds: selectedIds }
      );
      setConfirmOpen(false);
      setExpandedId(null);
      setSelectedRequest(null);
      setSelectedIds([]);
      await fetchRequests();
    } catch (err: any) {
      const error =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Xuất máu thất bại!";
      setErrorMessage(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Trang xuất máu</h1>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-6 py-3">Mã yêu cầu</th>
              <th className="text-center px-4 py-3">Nhóm máu</th>
              <th className="text-center px-4 py-3">Chế phẩm</th>
              <th className="text-center px-4 py-3">Thể tích</th>
              <th className="text-center px-4 py-3">Địa chỉ</th>
              <th className="text-center px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <React.Fragment key={r.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.code}</td>
                  <td className="text-center px-4 py-4">{r.bloodGroup?.displayName}</td>
                  <td className="text-center px-4 py-4">{r.bloodComponent?.name}</td>
                  <td className="text-center px-4 py-4">{r.volume} ml</td>
                  <td className="text-center px-4 py-4">{r.address}</td>
                  <td className="text-center px-4 py-4">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const toggling = expandedId === r.id ? null : r.id;
                        setExpandedId(toggling);
                        setSelectedRequest(toggling ? r : null);
                        setSelectedIds([]);
                        if (toggling) {
                          await fetchAvailableBloods(r.id);
                        }
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>

                {expandedId === r.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <h3 className="font-semibold mb-2">Chọn các túi máu để xuất</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availableBloods.length === 0 ? (
                          <p className="text-sm text-gray-600">Không có túi máu phù hợp.</p>
                        ) : (
                          availableBloods.map((b) => (
                            <div key={b.id} className="border p-3 rounded flex items-start gap-3">
                              <Checkbox
                                checked={selectedIds.includes(b.id)}
                                onCheckedChange={() => handleCheckboxChange(b.id)}
                              />
                              <div>
                                <p><strong>Mã:</strong> {b.code}</p>
                                <p><strong>Nhóm:</strong> {typeof b.bloodGroup === "string" ? b.bloodGroup : b.bloodGroup?.displayName}</p>
                                <p><strong>Loại:</strong> {typeof b.bloodComponent === "string" ? b.bloodComponent : b.bloodComponent?.name}</p>
                                <p><strong>Thể tích:</strong> {b.volume} ml</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {availableBloods.length > 0 && (
                        <div className="mt-4 text-right">
                          <Button
                            disabled={selectedIds.length === 0}
                            onClick={() => setConfirmOpen(true)}
                            className="bg-blue-600 text-white"
                          >
                            Xác nhận xuất {selectedIds.length} túi máu
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Xác nhận xuất máu */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xuất máu?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="px-4 text-sm text-gray-700">
            Bạn có chắc chắn muốn xuất {selectedIds.length} túi máu cho yêu cầu{" "}
            <strong>{selectedRequest?.code}</strong>?
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExport}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hiển thị lỗi*/}
      <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lỗi</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>Đóng</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
