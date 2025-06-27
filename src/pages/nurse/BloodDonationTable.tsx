import React, { useState } from "react";
import useBloodDonation from "@/hooks/useBloodDonation";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient"; 
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";

export default function BloodDonationTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, loading, error, totalRecords, refresh } = useBloodDonation({});

  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: number) => {
    try {
      await apiClient.put(`/blood-donations/${id}/status?status=${status}`);
      alert("Cập nhật trạng thái thành công!");
      refresh();
    } catch (err: any) {
      alert(err.response?.data?.title || "Lỗi khi cập nhật trạng thái!");
    }
  };

  const filteredData = data.filter((item) => {
    const nameMatch = item.bloodDonationRequest?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const statusMatch =
      statusFilter === "all" || item.status.toString() === statusFilter;

    return nameMatch && statusMatch;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách hiến máu</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm theo tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="0">Đang hiến máu</SelectItem>
            <SelectItem value="1">Đã hiến máu</SelectItem>
            <SelectItem value="2">Hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">STT</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Nhóm máu</th>
              <th className="p-2">Ngày yêu cầu</th>
              <th className="p-2">Thể tích</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr className="border-t text-center">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.bloodDonationRequest?.fullName}</td>
                  <td className="p-2">{["O", "A", "B", "AB"][item.bloodType]}</td>
                  <td className="p-2">
                    {new Date(item.donationDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-2">{item.volume} ml</td>
                  <td
                    className={`p-2 capitalize ${item.status === 0
                        ? "text-yellow-600"
                        : item.status === 1
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                  >
                    {item.status === 0
                      ? "Đang hiến máu"
                      : item.status === 1
                        ? "Đã hiến máu"
                        : "Hủy"}
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    {item.status === 0 && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(item.id, 1)}
                          className="text-green-500 border border-green-500 hover:bg-green-100 bg-white"
                        >
                          Hoàn thành
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(item.id, 2)}
                          className="text-red-500 border border-red-500 hover:bg-red-100 bg-white"
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSelectedDetail(selectedDetail === item.id ? null : item.id)
                      }
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </td>
                </tr>

                {selectedDetail === item.id && (
                  <tr className="bg-gray-50 text-left">
                    <td colSpan={7} className="p-4">
                      <div>
                        <p>
                          <strong>Họ tên:</strong>{" "}
                          {item.bloodDonationRequest?.fullName}
                        </p>
                        <p>
                          <strong>Giới tính:</strong>{" "}
                          {item.bloodDonationRequest?.gender ? "Nam" : "Nữ"}
                        </p>
                        <p>
                          <strong>Tuổi:</strong>{" "}
                          {item.bloodDonationRequest?.healthCheckForm?.age || "-"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {item.bloodDonationRequest?.email}
                        </p>
                        <p>
                          <strong>Địa chỉ:</strong>{" "}
                          {item.bloodDonationRequest?.addresss}
                        </p>
                        <p>
                          <strong>Mô tả:</strong> {item.description}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      <p className="mt-2 text-sm text-gray-500">
        Tổng số yêu cầu hiến máu: {totalRecords}
      </p>
    </div>
  );
}
