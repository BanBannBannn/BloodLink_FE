import React, { useState } from "react";
import useEmergencyRequests, { type EmergencyRequest } from "@/hooks/useEmergencyBloodRequests";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
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
  const [available, setAvailable] = useState<DisplayBag[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [showOk, setShowOk] = useState(false);

  const loadAvailable = async (reqId: string) => {
    const res = await axiosInstance.get(
      `/blood-storage/available-bloods?emergencyBloodRequestId=${reqId}`
    );
    setAvailable(
      (res.data.records || []).map((b: any) => ({
        id: b.id,
        code: b.code,
        volume: b.volume,
        bloodGroup:
          typeof b.bloodGroup === "string" ? b.bloodGroup : b.bloodGroup.displayName,
        bloodComponent: b.bloodComponent.name,
      }))
    );
  };

  const openPanel = (req: EmergencyRequest) => {
    setExpandedId(req.id);
    setSelectedIds((req.bloodIssues || []).map((i: { bloodStorageId: any; }) => i.bloodStorageId));
    if (req.status < 3) loadAvailable(req.id);
  };

  const changeStatus = async (reqId: string, newStatus: number, label: string) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token") || "";
      await axiosInstance.put(
        `/emergency-blood-requests/${reqId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg(`${label} thành công!`);
      await refresh();
    } catch (e: any) {
      setMsg(e.response?.data?.message || e.message);
    } finally {
      setShowOk(true);
      setIsUpdating(false);
      setExpandedId(null);
    }
  };


  const upsertIssues = async (req: EmergencyRequest) => {
    setIsUpdating(true);
    try {
      if (req.bloodIssues && req.bloodIssues.length) {
        await axiosInstance.put(
          `/blood-issues/${req.bloodIssues[0].id}`,
          { bloodStorageIds: selectedIds }
        );
        setMsg("Cập nhật túi thành công!");
      } else {
        await axiosInstance.post(
          `/blood-issues?EmergencyBloodRequestId=${req.id}`,
          { bloodStorageIds: selectedIds }
        );
        setMsg(`Xuất ${selectedIds.length} túi thành công!`);
      }
      await refresh();
    } catch (e: any) {
      setMsg(e.response?.data?.message || e.message);
    } finally {
      setShowOk(true);
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Yêu cầu xuất máu khẩn cấp</h1>

      <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {["Mã", "Địa chỉ", "Vol (ml)", "Nhóm", "Chế phẩm", "Trạng thái", "Hành động"].map(h => (
              <th key={h} className="px-4 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <React.Fragment key={req.id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{req.code}</td>
                <td className="text-center px-4 py-4">{req.address}</td>
                <td className="text-center px-4 py-4">{req.volume}</td>
                <td className="text-center px-4 py-4">{req.bloodGroup.displayName}</td>
                <td className="text-center px-4 py-4">{req.bloodComponent.name}</td>
                <td className="text-center px-4 py-4">
                  {["Chờ xác nhận", "Từ chối", "Đang xử lý", "Hoàn tất", "Hủy"][req.status]}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  {req.status === 0 && (
                    <>
                      <Button
                        size="sm" variant="outline"
                        disabled={isUpdating}
                        onClick={() => changeStatus(req.id, 2, "Duyệt")}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="sm" variant="destructive"
                        disabled={isUpdating}
                        onClick={() => changeStatus(req.id, 4, "Hủy xác nhận")}
                      >
                        Hủy
                      </Button>
                    </>
                  )}
                  {req.status === 2 && !req.bloodIssues?.length && (
                    <Button
                      size="sm" variant="outline"
                      onClick={() => openPanel(req)}
                    >
                      Xuất máu
                    </Button>
                  )}
                  {req.status === 2 && req.bloodIssues?.length > 0 && (
                    <>
                      <Button
                        size="sm" variant="outline"
                        onClick={() => openPanel(req)}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => changeStatus(req.id, 3, "Hoàn tất")}
                      >
                        Hoàn tất
                      </Button>
                    </>
                  )}
                  {(req.status === 3 || req.status === 4) && (
                    <Button
                      size="sm" variant="outline"
                      onClick={() => openPanel(req)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> Xem
                    </Button>
                  )}
                </td>
              </tr>

              {expandedId === req.id && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-4">
                    <h3 className="font-semibold mb-2">
                      {req.status === 3 || req.status === 4
                        ? "Túi máu đã xuất"
                        : "Chọn túi máu để xuất"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(() => {
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
                        if (req.status > 2) return chosen;
                        const rest = available.filter(b => !chosen.find(c => c.id === b.id));
                        return [...chosen, ...rest];
                      })().map(bag => (
                        <label
                          key={bag.id}
                          className="border rounded-lg p-4 flex items-start space-x-4"
                        >
                          <Checkbox
                            checked={selectedIds.includes(bag.id)}
                            disabled={req.status > 2}
                            onCheckedChange={() => {
                              if (req.status === 2) {
                                setSelectedIds(prev =>
                                  prev.includes(bag.id)
                                    ? prev.filter(x => x !== bag.id)
                                    : [...prev, bag.id]
                                );
                              }
                            }}
                          />
                          <div>
                            <p><strong>Mã:</strong> {bag.code}</p>
                            <p><strong>Nhóm:</strong> {bag.bloodGroup}</p>
                            <p><strong>Thể tích:</strong> {bag.volume} ml</p>
                            <p><strong>Loại:</strong> {bag.bloodComponent}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {req.status === 2 && (
                      <div className="mt-4 text-right">
                        <Button
                          onClick={() => upsertIssues(req)}
                          disabled={isUpdating || !selectedIds.length}
                        >
                          {req.bloodIssues?.length ? "Cập nhật" : `Xuất ${selectedIds.length} túi`}
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

      <AlertDialog open={showOk} onOpenChange={() => setShowOk(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thông báo</AlertDialogTitle>
            <AlertDialogDescription>{msg}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowOk(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
