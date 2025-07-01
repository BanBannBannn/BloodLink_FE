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
import { MoreHorizontal } from "lucide-react";
import BloodStorageDashboard from "./blood-storage-dashboard";

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

  const getStatusColorClass = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-600";
      case 1:
        return "text-green-600";
      case 2:
        return "text-red-600";
      case 3:
        return "text-orange-600";
      default:
        return "";
    }
  };

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
    const fullName =
      item.bloodDonate?.bloodDonationRequest?.fullName?.toLowerCase() || "";
    const statusMatch =
      statusFilter === "all" || String(item.status) === statusFilter;
    const bloodGroupId = item.bloodGroupId;
    const bloodTypeMatch =
      bloodTypeFilter === "all" || bloodGroupId === bloodTypeFilter;
    return (
      fullName.includes(searchQuery.toLowerCase()) &&
      statusMatch &&
      bloodTypeMatch
    );
  });

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  return (
    <div>
      <BloodStorageDashboard />
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm theo tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48"
        />

        <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lọc nhóm máu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhóm máu</SelectItem>
            {bloodGroups.map((group: any) => (
              <SelectItem key={group.id} value={group.id}>
                {group.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {BloodStorageStatus.map((label, index) => (
              <SelectItem key={index} value={index.toString()}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Mã</th>
                <th className="p-2">Họ tên</th>
                <th className="p-2">Nhóm máu</th>
                <th className="p-2">Thể tích</th>
                <th className="p-2">Loại chế phẩm</th>
                <th className="p-2">Ngày tạo</th>
                <th className="p-2">Ngày hết hạn</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry, idx) => {
                const donor = entry.bloodDonate?.bloodDonationRequest;
                const createdDate = new Date(
                  entry.createdDate
                ).toLocaleDateString("vi-VN");
                const expiredDate = new Date(
                  entry.expiredDate
                ).toLocaleDateString("vi-VN");
                const bloodGroupName =
                  bloodGroups.find((bg) => bg.id === entry.bloodGroupId)
                    ?.displayName || "-";

                return (
                  <React.Fragment key={entry.id}>
                    <tr className="border-t text-center">
                      <td className="p-2">
                        {entry.code || `${pageIndex * pageSize + idx + 1}`}
                      </td>
                      <td className="p-2">{donor?.fullName || "-"}</td>
                      <td className="p-2">{bloodGroupName}</td>
                      <td className="p-2">{entry.volume} ml</td>
                      <td className="p-2">
                        {entry.bloodComponent?.name || "-"}
                      </td>
                      <td className="p-2">{createdDate}</td>
                      <td className="p-2">{expiredDate}</td>
                      <td className="p-2 font-semibold">
                        <span className={getStatusColorClass(entry.status)}>
                          {BloodStorageStatus[entry.status]}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() =>
                            setExpandedRowId(
                              expandedRowId === entry.id ? null : entry.id
                            )
                          }
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>

                    {expandedRowId === entry.id && (
                      <tr className="bg-gray-50 text-left">
                        <td colSpan={9} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p>
                                <strong>Họ tên:</strong> {donor?.fullName}
                              </p>
                              <p>
                                <strong>Giới tính:</strong>{" "}
                                {donor?.gender ? "Nam" : "Nữ"}
                              </p>
                              <p>
                                <strong>Tuổi:</strong> {donor?.age || "-"}
                              </p>
                              <p>
                                <strong>Email:</strong> {donor?.email}
                              </p>
                              <p>
                                <strong>Địa chỉ:</strong> {donor?.addresss}
                              </p>
                              <p>
                                <strong>Mô tả:</strong>{" "}
                                {entry.bloodDonate?.description || "-"}
                              </p>
                            </div>
                            <div className="flex gap-4">
                              {donor?.frontUrlIdentity ? (
                                <div className="flex-1">
                                  <img
                                    src={donor.frontUrlIdentity}
                                    alt="CCCD mặt trước"
                                    className="w-full max-h-[250px] object-contain border rounded"
                                  />
                                  <p className="text-sm text-center mt-1">
                                    CCCD mặt trước
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm text-center text-red-500">
                                  Không có ảnh CCCD mặt trước
                                </p>
                              )}

                              {donor?.backUrlIdentity ? (
                                <div className="flex-1">
                                  <img
                                    src={donor.backUrlIdentity}
                                    alt="CCCD mặt sau"
                                    className="w-full max-h-[250px] object-contain border rounded"
                                  />
                                  <p className="text-sm text-center mt-1">
                                    CCCD mặt sau
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm text-center text-red-500">
                                  Không có ảnh CCCD mặt sau
                                </p>
                              )}
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

          <div className="flex justify-between items-center mt-4">
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
        </>
      )}
    </div>
  );
}
