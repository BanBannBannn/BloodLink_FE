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
import { bloodTypes, BloodStorageStatus } from "@/constants/constants";

export default function BloodStorageTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");

  const [pageIndex, setPageIndex] = useState(0);
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
      setError(null);
      try {
        const response = await axiosInstance.get("/blood-storage/search");
        setData(response.data.records || []);
      } catch (err: any) {
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
    const bloodType = item.bloodDonate?.bloodType;
    const bloodTypeMatch =
      bloodTypeFilter === "all" || String(bloodType) === bloodTypeFilter;
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
      <h1 className="text-2xl font-bold mb-4">Danh sách máu lưu trữ</h1>

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
            <SelectItem value="all">Nhóm máu</SelectItem>
            {bloodTypes.slice(0, 4).map((type, index) => (
              <SelectItem key={index} value={index.toString()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Trạng thái</SelectItem>
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
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry, idx) => {
                const donor = entry.bloodDonate?.bloodDonationRequest;
                const bloodTypeIndex = entry.bloodDonate?.bloodType;
                const createdDate = new Date(entry.createdDate).toLocaleDateString("vi-VN");
                const expiredDate = new Date(entry.expiredDate).toLocaleDateString("vi-VN");
                return (
                  <tr key={entry.id} className="border-t text-center">
                    <td className="p-2">{entry.code || `${pageIndex * pageSize + idx + 1}`}</td>
                    <td className="p-2">{donor?.fullName || "-"}</td>
                    <td className="p-2">{bloodTypes[bloodTypeIndex] || "-"}</td>
                    <td className="p-2">{entry.volume} ml</td>
                    <td className="p-2">{entry.bloodComponent?.name || "-"}</td>
                    <td className="p-2">{createdDate}</td>
                    <td className="p-2">{expiredDate}</td>
                    <td className="p-2">
                      <span className={`font-semibold ${getStatusColorClass(entry.status)}`}>
                        {BloodStorageStatus[entry.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paging */}
          <div className="bottom justify-between items-center mt-4">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span>
              Trang {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize) || 1}
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
