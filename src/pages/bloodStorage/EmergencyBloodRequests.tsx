import React, { useEffect, useState } from "react";
import useEmergencyRequests, { type EmergencyRequest } from "@/hooks/useEmergencyBloodRequests";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
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

interface DisplayBag {
  id: string;
  code: string;
  volume: number;
  bloodGroup: string;
  bloodComponent: string;
}

export default function EmergencyBloodRequestsPage() {
  const { data: requests, refresh } = useEmergencyRequests();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [availableBloods, setAvailableBloods] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const fetchAvailable = async (reqId: string) => {
    try {
      const res = await axiosInstance.get(
        `/blood-storage/available-bloods?emergencyBloodRequestId=${reqId}`
      );
      setAvailableBloods(res.data.records || []);
    } catch {
      setAvailableBloods([]);
    }
  };

  const openDetails = (req: EmergencyRequest) => {
    setExpandedId(req.id);
    fetchAvailable(req.id);
    const already = req.bloodIssues?.map((i: { bloodStorageId: any; }) => i.bloodStorageId) || [];
    setSelectedIds(already);
  };

  const handleCreateOrUpdate = async (req: EmergencyRequest) => {
    setIsUpdating(true);
    try {
      if (req.bloodIssues && req.bloodIssues.length > 0) {
        await axiosInstance.put(`/blood-issues/${req.id}`, {
          bloodStorageIds: selectedIds,
        },
        );
      } else {
        await axiosInstance.post(
          `/api/blood-issues?EmergencyBloodRequestId=${req.id}`,
          { bloodStorageIds: selectedIds },
        );

      }
      await refresh();
      setExpandedId(null);
    } catch (err: any) {
      setErrorMessage(err.response?.data ?? err.message);
      setIsErrorDialogOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Yêu cầu xuất máu khẩn cấp</h1>
      <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Mã yêu cầu</th>
            <th className="px-4 py-2">Địa chỉ</th>
            <th className="px-4 py-2">Vol (ml)</th>
            <th className="px-4 py-2">Nhóm</th>
            <th className="px-4 py-2">Chế phẩm</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <React.Fragment key={req.id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{req.code}</td>
                <td className="px-4 py-2">{req.address}</td>
                <td className="px-4 py-2">{req.volume}</td>
                <td className="px-4 py-2">{req.bloodGroup.displayName}</td>
                <td className="px-4 py-2">{req.bloodComponent.name}</td>
                <td className="px-4 py-2">
                  {{
                    0: "Chờ xác nhận",
                    1: "Từ chối",
                    2: "Đang xử lý",
                    3: "Hoàn tất",
                    4: "Hủy",
                  }[req.status]}
                </td>
                <td className="px-4 py-2 text-right">
                  {(req.status === 0 || req.status === 2) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetails(req)}
                    >
                      <MoreHorizontal className="w-4 h-4 mr-1" />
                      Chi tiết
                    </Button>
                  )}
                </td>
              </tr>

              {expandedId === req.id && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-4">
                    <h3 className="font-semibold mb-2">Chọn túi máu</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(() => {
                        // merge chosen + available
                        const chosen: DisplayBag[] = (req.bloodIssues || []).map((i: { bloodStorageId: any; bloodStorage: { code: any; bloodGroup: { displayName: any; }; bloodComponent: { name: any; }; }; volume: any; }) => ({
                          id: i.bloodStorageId,
                          code: i.bloodStorage.code,
                          volume: i.volume,
                          bloodGroup:
                            typeof i.bloodStorage.bloodGroup === "string"
                              ? i.bloodStorage.bloodGroup
                              : i.bloodStorage.bloodGroup.displayName,
                          bloodComponent: i.bloodStorage.bloodComponent.name,
                        }));
                        const rest: DisplayBag[] = availableBloods
                          .filter(b => !chosen.find(c => c.id === b.id))
                          .map(b => ({
                            id: b.id,
                            code: b.code,
                            volume: b.volume,
                            bloodGroup:
                              typeof b.bloodGroup === "string"
                                ? b.bloodGroup
                                : b.bloodGroup.displayName,
                            bloodComponent: b.bloodComponent.name,
                          }));
                        return [...chosen, ...rest];
                      })().map(bag => (
                        <label
                          key={bag.id}
                          className="border rounded-lg p-4 flex items-start space-x-4"
                        >
                          <Checkbox
                            checked={selectedIds.includes(bag.id)}
                            onCheckedChange={() =>
                              setSelectedIds(prev =>
                                prev.includes(bag.id)
                                  ? prev.filter(x => x !== bag.id)
                                  : [...prev, bag.id]
                              )
                            }
                          />
                          <div>
                            <p>
                              <strong>Mã yêu cầu:</strong> {bag.code}
                            </p>
                            <p>
                              <strong>Nhóm:</strong> {bag.bloodGroup}
                            </p>
                            <p>
                              <strong>Thể tích:</strong> {bag.volume} ml
                            </p>
                            <p>
                              <strong>Loại:</strong> {bag.bloodComponent}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <Button
                        onClick={() => handleCreateOrUpdate(req)}
                        disabled={isUpdating || selectedIds.length === 0}
                      >
                        {req.bloodIssues && req.bloodIssues.length > 0
                          ? "Cập nhật"
                          : `Xuất ${selectedIds.length} túi`}
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <AlertDialog
        open={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Có lỗi!</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsErrorDialogOpen(false)}
            >
              Đóng
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setIsErrorDialogOpen(false)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
