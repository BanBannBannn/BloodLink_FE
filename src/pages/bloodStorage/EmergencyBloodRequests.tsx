import React, { useEffect, useState } from "react";
import useEmergencyRequests, {
  type EmergencyRequest,
} from "@/hooks/useEmergencyBloodRequests";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { statusMapEmergencyRequest } from "@/constants/constants";

export default function EmergencyBloodRequestsPage() {
  const { data: requests, refresh, actionLoading } = useEmergencyRequests();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<EmergencyRequest | null>(null);
  const [availableBloods, setAvailableBloods] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const navigate = useNavigate();

  const fetchAvailable = async (reqId: string) => {
    const res = await axiosInstance.get(
      `/api/blood-storage/available-bloods?emergencyBloodRequestId=${reqId}`
    );

    setAvailableBloods(Array.isArray(res.data) ? res.data : []);
  };

  const handleApprove = async (req: EmergencyRequest) => {
    await axiosInstance.put(`/api/emergency-blood-requests/${req.id}`, {
      ...req,
      status: 2,
    });
    await refresh();
    navigate(`/blood-export/${req.id}`);
  };

  const handleReject = async (req: EmergencyRequest) => {
    await axiosInstance.put(`/api/emergency-blood-requests/${req.id}`, {
      ...req,
      status: 1,
    });
    await refresh();
  };

  const handleCreateIssue = async () => {
    if (!selectedRequest) return;
    const res = await axiosInstance.post(
      `/api/blood-issues?emergencyBloodRequestId=${selectedRequest.id}`,
      { bloodStorageIds: selectedIds }
    );
    setCurrentIssueId(res.data.id);
    await refresh();
    alert("Tạo phiếu xuất máu thành công!");
  };
  const handleUpdateIssue = async () => {
    if (!currentIssueId) return;
    await axiosInstance.put(`/api/blood-issues/${currentIssueId}`, {
      bloodStorageIds: selectedIds,
    });
    await refresh();
    alert("Cập nhật túi máu thành công!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Yêu cầu xuất máu khẩn cấp</h1>
      <table className="w-full table-auto text-sm bg-white shadow rounded-lg overflow-hidden">
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
          {requests.map((r) => (
            <React.Fragment key={r.id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{r.code}</td>
                <td className="px-4 py-2">{r.address}</td>
                <td className="px-4 py-2">{r.volume}</td>
                <td className="px-4 py-2">{r.bloodGroup.displayName}</td>
                <td className="px-4 py-2">{r.bloodComponent.name}</td>
                <td className="px-4 py-2">
                  {statusMapEmergencyRequest[r.status]}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  {r.status === 0 && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(r)}
                      >
                        Từ chối
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(r)}>
                        Xuất máu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExpandedId(r.id);
                          setSelectedRequest(r);
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        Chi tiết
                      </Button>
                    </>
                  )}
                  {r.status === 2 && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          setExpandedId(r.id);
                          setSelectedRequest(r);
                          setCurrentIssueId(
                            r.bloodIssues?.[0]?.id || null
                          );
                          setSelectedIds(
                            r.bloodIssues
                              ? r.bloodIssues.map((i: any) => i.bloodStorageId)
                              : []
                          );
                          fetchAvailable(r.id);
                        }}
                      >
                        Xuất máu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExpandedId(r.id);
                          setSelectedRequest(r);
                          setCurrentIssueId(
                            r.bloodIssues?.[0]?.id || null
                          );
                          setSelectedIds(
                            r.bloodIssues
                              ? r.bloodIssues.map((i: any) => i.bloodStorageId)
                              : []
                          );
                          fetchAvailable(r.id);
                        }}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          axiosInstance
                            .put(`/api/emergency-blood-requests/${r.id}`, {
                              ...r,
                              status: 3,
                            })
                            .then(refresh)
                        }
                      >
                        Hoàn tất
                      </Button>
                    </>
                  )}
                  {(r.status === 1 || r.status === 3) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setExpandedId(r.id);
                        setSelectedRequest(r);
                        setCurrentIssueId(r.bloodIssues?.[0]?.id || null);
                      }}
                    >
                      Chi tiết
                    </Button>
                  )}
                </td>
              </tr>

              {expandedId === r.id && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-4 py-4">
                    {r.status === 2 && (
                      <>
                        <h3 className="font-semibold mb-2">
                          Chọn túi máu để xuất
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          {availableBloods.map((b) => (
                            <label
                              key={b.id}
                              className="flex items-center border p-2 rounded"
                            >
                              <Checkbox
                                checked={selectedIds.includes(b.id)}
                                onCheckedChange={() =>
                                  setSelectedIds((prev) =>
                                    prev.includes(b.id)
                                      ? prev.filter((i) => i !== b.id)
                                      : [...prev, b.id]
                                  )
                                }
                              />
                              <div className="ml-2 text-sm">
                                <p>
                                  <strong>{b.code}</strong> – {b.volume}ml
                                </p>
                                <p>
                                  {b.bloodGroup.displayName} /{" "}
                                  {b.bloodComponent.name}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                        <div className="text-right space-x-2">
                          {!currentIssueId ? (
                            <Button
                              disabled={selectedIds.length === 0}
                              onClick={handleCreateIssue}
                            >
                              Xuất {selectedIds.length} túi
                            </Button>
                          ) : (
                            <Button
                              disabled={selectedIds.length === 0}
                              onClick={handleUpdateIssue}
                            >
                              Cập nhật xuất máu
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                    {(r.status === 1 || r.status === 3) && (
                      <>
                        <h3 className="font-semibold mb-2">
                          Lịch sử xuất máu
                        </h3>
                        <ul className="list-disc list-inside text-sm">
                          {r.bloodIssues?.length ? (
                            r.bloodIssues.map((i: any) => (
                              <li key={i.id}>
                                Issue #{i.id} —{" "}
                                {new Date(i.issuedDate).toLocaleString()} —{" "}
                                {i.details
                                  .map((d: any) => d.bloodStorageCode)
                                  .join(", ")}
                              </li>
                            ))
                          ) : (
                            <li>Chưa có bản ghi</li>
                          )}
                        </ul>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
