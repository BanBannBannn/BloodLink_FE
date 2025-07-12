// pages/bloodStorage/BloodExportPage.tsx
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

  const fetchRequests = async () => {
    const res = await axiosInstance.get("/api/emergency-blood-requests");
    setRequests(res.data.records.filter((r: any) => r.status === 2));
  };

  const fetchAvailableBloods = async (requestId: string) => {
    const res = await axiosInstance.get(`/api/blood-storage/available-bloods?emergencyBloodRequestId=${requestId}`);
    setAvailableBloods(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirmExport = async () => {
    try {
      await axiosInstance.post(`/api/blood-storage/issue`, {
        emergencyBloodRequestId: selectedRequest.id,
        bloodUnitIds: selectedIds,
      });
      setConfirmOpen(false);
      setSelectedRequest(null);
      setSelectedIds([]);
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.title || "Lỗi khi xuất máu!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Duyệt phiếu xuất máu</h1>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-6 py-3">Mã yêu cầu</th>
              <th className="text-center px-4 py-3">Nhóm máu</th>
              <th className="text-center px-4 py-3">Chế phẩm</th>
              <th className="text-center px-4 py-3">Thể tích (ml)</th>
              <th className="text-center px-4 py-3">Địa chỉ</th>
              <th className="text-center px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <React.Fragment key={r.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{r.code}</td>
                  <td className="text-center px-4 py-4">{r.bloodGroup?.displayName}</td>
                  <td className="text-center px-4 py-4">{r.bloodComponent?.name}</td>
                  <td className="text-center px-4 py-4">{r.volume}</td>
                  <td className="text-center px-4 py-4">{r.address}</td>
                  <td className="text-center px-4 py-4">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        setExpandedId(expandedId === r.id ? null : r.id);
                        if (expandedId !== r.id) {
                          await fetchAvailableBloods(r.id);
                          setSelectedRequest(r);
                          setSelectedIds([]);
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
                          <p className="text-sm text-gray-600">Không tìm thấy túi máu phù hợp.</p>
                        ) : (
                          availableBloods.map((b) => (
                            <div key={b.id} className="border p-3 rounded flex items-center gap-3">
                              <Checkbox
                                checked={selectedIds.includes(b.id)}
                                onCheckedChange={() => handleCheckboxChange(b.id)}
                              />
                              <div>
                                <p><strong>Mã:</strong> {b.code}</p>
                                <p><strong>Nhóm:</strong> {b.bloodGroup?.displayName}</p>
                                <p><strong>Loại:</strong> {b.bloodComponent?.name}</p>
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
                            className="bg-purple-600 text-white"
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

      {/* Popup xác nhận */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xuất máu?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExport}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
