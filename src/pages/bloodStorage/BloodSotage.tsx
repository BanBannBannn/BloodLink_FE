import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { BloodStorageStatus } from "@/constants/constants";
import {
  Calendar,
  Droplet,
  Droplets,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import BloodStorageDashboard from "./blood-storage-dashboard";
import { getAllComponentId } from "@/api/summaryApi";

export default function BloodStorageTable() {
  const [data, setData] = useState<any[]>([]);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
  const [componentFilter, setComponentFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [preparingEntry, setPreparingEntry] = useState<any | null>(null);
  const [bloodComponents, setBloodComponents] = useState<any[]>([]);
  const [prepareVolume, setPrepareVolume] = useState<number>(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bloodStorageRes, bloodGroupRes, componentRes] = await Promise.all([
          axiosInstance.get("/blood-storage/search"),
          axiosInstance.get("/blood-groups"),
          getAllComponentId(),
        ]);
        setData(bloodStorageRes.data.records || []);
        setBloodGroups(bloodGroupRes.data || []);
        setAllComponents(componentRes.data || []);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const fullName =
      item.bloodDonate?.bloodDonationRequest?.fullName?.toLowerCase() || "";
    const statusMatch =
      statusFilter === "all" || String(item.status) === statusFilter;
    const bloodGroupId = item.bloodGroupId;
    const bloodTypeMatch =
      bloodTypeFilter === "all" || bloodGroupId === bloodTypeFilter;
    const componentMatch =
      componentFilter === "all" || item.bloodComponent?.name === componentFilter;

    return (
      fullName.includes(searchQuery.toLowerCase()) &&
      statusMatch &&
      bloodTypeMatch &&
      componentMatch
    );
  });
  const [allComponents, setAllComponents] = useState<any[]>([]);


  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const getStatusBadge = (status: number) => {
    const color =
      status === 1 ? "green" :
        status === 0 ? "yellow" :
          status === 2 ? "red" : "orange";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 border border-${color}-200`}>
        {BloodStorageStatus[status]}
      </span>
    );
  };

  const handleToggleRow = async (id: string) => {
    setProcessingId(id);
    setAlertMessage(null);
    try {
      setExpandedRowId(expandedRowId === id ? null : id);
    } catch (err: any) {
      setAlertMessage(err.response?.data?.title || "Có lỗi khi xử lý yêu cầu.");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePrepare = async (entry: any) => {
    setAlertMessage(null);
    try {
      const res = await axiosInstance.get("/blood-components");
      setBloodComponents(res.data || []);
      setPreparingEntry(entry);
      setPrepareVolume(0);
      setSelectedComponentId("");
    } catch {
      setAlertMessage("Không thể tải danh sách loại chế phẩm.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <BloodStorageDashboard />

      <div className="max-w-7xl mx-auto">

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên người hiến..."
                value={searchQuery}
                onChange={(e) => {
                  setPageIndex(0);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 border-gray-300"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select value={bloodTypeFilter} onValueChange={(val) => {
                setBloodTypeFilter(val);
                setPageIndex(0);
              }}>
                <SelectTrigger className="w-48 pl-10">
                  <SelectValue placeholder="Lọc nhóm máu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhóm máu</SelectItem>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>{group.displayName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select value={statusFilter} onValueChange={(val) => {
                setStatusFilter(val);
                setPageIndex(0);
              }}>
                <SelectTrigger className="w-48 pl-10">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {BloodStorageStatus.map((label, i) => (
                    <SelectItem key={i} value={i.toString()}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select value={componentFilter} onValueChange={(val) => {
                setComponentFilter(val);
                setPageIndex(0);
              }}>
                <SelectTrigger className="w-48 pl-10">
                  <SelectValue placeholder="Lọc loại chế phẩm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chế phẩm</SelectItem>
                  {allComponents.map((comp) => (
                    <SelectItem key={comp.id} value={comp.name}>{comp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* AlertDialogs */}
        <AlertDialog open={!!error} onOpenChange={(open: any) => !open && setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lỗi</AlertDialogTitle>
              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>Đóng</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!alertMessage} onOpenChange={(open: any) => !open && setAlertMessage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Thông báo</AlertDialogTitle>
              <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertMessage(null)}>Đóng</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg border">
          {loading ? (
            <p className="p-4">Đang tải dữ liệu...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="text-left px-6 py-3">Mã</th>
                    <th className="text-center px-4 py-3">Nhóm máu</th>
                    <th className="text-center px-4 py-3">Loại chế phẩm</th>
                    <th className="text-center px-4 py-3">Nhiệt độ bảo quản (℃)</th>
                    <th className="text-center px-4 py-3">Thể tích</th>
                    <th className="text-center px-4 py-3">Ngày tạo</th>
                    <th className="text-center px-4 py-3">Ngày hết hạn</th>
                    <th className="text-center px-4 py-3">Trạng thái</th>
                    <th className="text-center px-4 py-3">Chi tiết</th>

                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((entry) => {
                    const donor = entry.bloodDonate?.bloodDonationRequest;
                    const bloodGroupName = bloodGroups.find(bg => bg.id === entry.bloodGroupId)?.displayName || "-";
                    return (
                      <React.Fragment key={entry.id}>
                        <tr className="border-t hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {entry.code || "-"}
                          </td>
                          <td className="text-center px-4 py-4">
                            <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                              <Droplet className="w-4 h-4" />
                              {bloodGroupName}
                            </span>
                          </td>
                          <td className="text-center px-4 py-4 text-gray-700">
                            {entry.bloodComponent?.name || "-"}
                          </td>
                          <td className="text-center px-4 py-4 text-gray-700">
                            {entry.bloodComponent?.minStorageTemerature != null && entry.bloodComponent?.maxStorageTemerature != null
                              ? `${entry.bloodComponent.minStorageTemerature} - ${entry.bloodComponent.maxStorageTemerature} ℃`
                              : ""}
                          </td>
                          <td className="text-center px-4 py-4 text-gray-700">
                            <Droplets className="inline w-4 h-4 mr-1" />
                            {entry.volume} ml
                          </td>
                          <td className="text-center px-4 py-4">{new Date(entry.createdDate).toLocaleDateString("vi-VN")}</td>
                          <td className="text-center px-4 py-4">{new Date(entry.expiredDate).toLocaleDateString("vi-VN")}</td>
                          <td className="text-center px-4 py-4">{getStatusBadge(entry.status)}</td>
                          <td className="text-center px-4 py-4 flex justify-center gap-2">
                            {entry.bloodComponent?.name === "Máu toàn phần" && (
                              <button
                                onClick={() => handlePrepare(entry)}
                                className="ml-2 px-3 py-1 text-xs border border-blue-500 text-blue-600 rounded hover:bg-green-50"
                              >
                                Tạo chế phẩm
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleRow(entry.id)}
                              disabled={processingId === entry.id}
                              className={`px-2 py-1 rounded ${processingId === entry.id
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-gray-100"
                                }`}
                            >
                              {processingId === entry.id ? "Đang xử lý..." : (
                                <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-black" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {expandedRowId === entry.id && (
                          <tr className="bg-gray-50">
                            <td colSpan={8} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p><strong>Họ tên:</strong> {donor?.fullName}</p>
                                  <p><strong>Giới tính:</strong> {donor?.gender ? "Nam" : "Nữ"}</p>
                                  <p><strong>Tuổi:</strong> {donor?.age || "-"}</p>
                                  <p><strong>SĐT:</strong> {donor?.phoneNo}</p>
                                  <p><strong>Số CCCD:</strong> {donor?.identityId}</p>
                                  <p><strong>Email:</strong> {donor?.email}</p>
                                  <p><strong>Địa chỉ:</strong> {donor?.addresss}</p>
                                  <p><strong>Mô tả:</strong> {entry.bloodDonate?.description || "-"}</p>
                                </div>
                                <div className="flex gap-4">
                                  <div className="flex-1">
                                    <img src={donor?.frontUrlIdentity} alt="CCCD mặt trước" className="w-full max-h-[250px] object-contain border rounded" />
                                    <p className="text-sm text-center mt-1">CCCD mặt trước</p>
                                  </div>
                                  <div className="flex-1">
                                    <img src={donor?.backUrlIdentity} alt="CCCD mặt sau" className="w-full max-h-[250px] object-contain border rounded" />
                                    <p className="text-sm text-center mt-1">CCCD mặt sau</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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
                  Trang {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize)}
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

        {/* Modal điều chế */}
        {preparingEntry && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <h2 className="text-lg font-bold mb-4">Điều chế từ {preparingEntry.code}</h2>

              <div className="mb-3">
                <label className="block mb-1">Chọn loại chế phẩm</label>
                <select
                  value={selectedComponentId}
                  onChange={(e) => setSelectedComponentId(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- Chọn loại chế phẩm --</option>
                  {bloodComponents.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block mb-1">Thể tích điều chế (ml)</label>
                <Input
                  type="number"
                  value={prepareVolume}
                  onChange={(e) => setPrepareVolume(parseInt(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPreparingEntry(null)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={async () => {
                    if (!selectedComponentId || prepareVolume <= 0) {
                      setAlertMessage("Vui lòng chọn loại chế phẩm và nhập thể tích hợp lệ.");
                      return;
                    }
                    try {
                      await axiosInstance.post(`/blood-storage/blood-preparation/${preparingEntry.id}`, {
                        bloodComponentId: selectedComponentId,
                        volume: prepareVolume,
                      });
                      setAlertMessage("Điều chế thành công!");
                      setPreparingEntry(null);
                      setPageIndex(0);
                      setExpandedRowId(null);
                      window.location.reload();
                    } catch (err: any) {
                      setAlertMessage(err.response?.data?.title || "Điều chế thất bại!");
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
