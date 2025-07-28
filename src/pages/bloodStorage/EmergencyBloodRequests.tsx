import React, { useEffect, useState } from "react";
import useEmergencyRequests, { type EmergencyRequest } from "@/hooks/useEmergencyBloodRequests";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MoreHorizontal } from "lucide-react";
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
  const [availableBloods, setAvailableBloods] = useState<DisplayBag[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Lấy các túi máu available
  const fetchAvailable = async (reqId: string) => {
    try {
      const res = await axiosInstance.get(
        `/blood-storage/available-bloods?emergencyBloodRequestId=${reqId}`
      );
      const records = res.data.records || [];
      setAvailableBloods(
        records.map((b: any) => ({
          id: b.id,
          code: b.code,
          volume: b.volume,
          bloodGroup: typeof b.bloodGroup === "string"
            ? b.bloodGroup
            : b.bloodGroup.displayName,
          bloodComponent: b.bloodComponent.name,
        }))
      );
    } catch {
      setAvailableBloods([]);
    }
  };

  // Mở chi tiết / xuất máu
  const openDetails = (req: EmergencyRequest) => {
    setExpandedId(req.id);
    fetchAvailable(req.id);
    const already = (req.bloodIssues || []).map((i: { bloodStorageId: any; }) => i.bloodStorageId);
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
        setSuccessMessage("Cập nhật túi máu thành công!");
      } else {
        await axiosInstance.post(
          `/blood-issues`,
          { bloodStorageIds: selectedIds },
          { params: { EmergencyBloodRequestId: req.id } }
        );
        setSuccessMessage(`Xuất ${selectedIds.length} túi thành công!`);
      }

      await refresh();
      setIsSuccessDialogOpen(true);
      setExpandedId(null);

    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Có lỗi xảy ra";
      setErrorMessage(msg);
      setIsErrorDialogOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };




  const handleStatusChange = async (reqId: string, newStatus: number, label: string) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/emergency-blood-requests/${reqId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(`${label} thành công!`);
      await refresh();
      setIsSuccessDialogOpen(true);
    } catch (err: any) {
      setIsErrorDialogOpen(true);
    } finally {
      setIsUpdating(false);
      setExpandedId(null);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Yêu cầu xuất máu khẩn cấp</h1>
      <table className="w-full text-sm bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Mã</th>
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
                <td className="px-4 py-2 text-right space-x-2">
                  {req.status === 2 && (
                    <>
                      {(!req.bloodIssues || req.bloodIssues.length === 0) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetails(req)}
                        >
                          Xuất máu
                        </Button>
                      )}

                      {req.bloodIssues && req.bloodIssues.length > 0 && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetails(req)}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(req.id, 3, "Hoàn tất")
                            }
                            disabled={isUpdating}
                          >
                            Hoàn tất
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusChange(req.id, 4, "Hủy")
                            }
                            disabled={isUpdating}
                          >
                            Hủy
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {req.status === 3 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetails(req)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> Xem
                    </Button>
                  )}
                </td>
              </tr>

              {/* phần chi tiết xuất máu */}
              {expandedId === req.id && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-4">
                    <h3 className="font-semibold mb-2">
                      Chọn túi máu
                      {req.status === 3 ? "Túi máu đã xuất" : "Chọn túi máu"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(() => {
                        // Luôn chỉ lấy bloodIssues khi status===3
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

                        if (req.status === 3) {
                          // chỉ show chosen
                          return chosen;
                        }

                        // status !== 3 mới merge thêm availableBloods
                        const rest: DisplayBag[] = availableBloods
                          .filter(b => !chosen.find(c => c.id === b.id))
                          .map(b => ({
                            id: b.id,
                            code: b.code,
                            volume: b.volume,
                            bloodGroup: b.bloodGroup,
                            bloodComponent: b.bloodComponent,
                          }));
                        return [...chosen, ...rest];
                      })().map(bag => (
                        <label key={bag.id} className="border rounded-lg p-4 flex items-start space-x-4">
                          <Checkbox
                            checked={selectedIds.includes(bag.id)}
                            disabled={req.status === 3}
                            onCheckedChange={() => {
                              if (req.status !== 3) {
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
                    {req.status !== 3 && (
                      <div className="mt-4 text-right">
                        <Button
                          onClick={() => handleCreateOrUpdate(req)}
                          disabled={isUpdating || selectedIds.length === 0}
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

      {/* Dialog lỗi */}
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
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog thành công */}
      <AlertDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cập nhật công</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>
              Đóng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}
