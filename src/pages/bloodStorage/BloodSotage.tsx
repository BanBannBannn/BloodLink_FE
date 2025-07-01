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
import { BloodStorageStatus } from "@/constants/constants";
import {
  Calendar,
  Droplet,
  Droplets,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";

export default function BloodStorageTable() {
  const [data, setData] = useState<any[]>([]);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bloodStorageRes, bloodGroupRes] = await Promise.all([
          axiosInstance.get("/blood-storage/search"),
          axiosInstance.get("/blood-groups"),
        ]);
        setData(bloodStorageRes.data.records || []);
        setBloodGroups(bloodGroupRes.data || []);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const fullName = item.bloodDonate?.bloodDonationRequest?.fullName?.toLowerCase() || "";
    const statusMatch = statusFilter === "all" || String(item.status) === statusFilter;
    const bloodGroupId = item.bloodGroupId;
    const bloodTypeMatch = bloodTypeFilter === "all" || bloodGroupId === bloodTypeFilter;
    return fullName.includes(searchQuery.toLowerCase()) && statusMatch && bloodTypeMatch;
  });

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kho máu</h1>
        <p className="text-gray-600 mb-6">Quản lý danh sách máu đã lưu trữ từ người hiến máu</p>

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
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg border">
          {loading ? (
            <p className="p-4">Đang tải dữ liệu...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="text-left px-6 py-3">Thông tin</th>
                    <th className="text-center px-4 py-3">Nhóm máu</th>
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
                          <td className="px-6 py-4">
                            <div className="font-medium">{donor?.fullName || "-"}</div>
                            <div className="text-xs text-gray-500">Mã: {entry.code}</div>
                          </td>
                          <td className="text-center px-4 py-4">
                            <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                              <Droplet className="w-4 h-4" />
                              {bloodGroupName}
                            </span>
                          </td>
                          <td className="text-center px-4 py-4 text-gray-700">
                            <Droplets className="inline w-4 h-4 mr-1" />
                            {entry.volume} ml
                          </td>
                          <td className="text-center px-4 py-4">{new Date(entry.createdDate).toLocaleDateString("vi-VN")}</td>
                          <td className="text-center px-4 py-4">{new Date(entry.expiredDate).toLocaleDateString("vi-VN")}</td>
                          <td className="text-center px-4 py-4">{getStatusBadge(entry.status)}</td>
                          <td className="text-center px-4 py-4">
                            <button onClick={() => setExpandedRowId(expandedRowId === entry.id ? null : entry.id)}>
                              <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-black" />
                            </button>
                          </td>
                        </tr>

                        {expandedRowId === entry.id && (
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p><strong>Giới tính:</strong> {donor?.gender ? "Nam" : "Nữ"}</p>
                                  <p><strong>Tuổi:</strong> {donor?.age || "-"}</p>
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
      </div>
    </div>
  );
}
