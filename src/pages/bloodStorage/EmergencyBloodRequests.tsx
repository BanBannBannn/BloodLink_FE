import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Request = {
  id: string;
  code: string;
  status: number;
  address: string;
  volume: number;
  bloodGroup: {
    displayName: string;
    id: string;
  };
  bloodComponent: {
    name: string;
    id: string;
  };
};

export default function EmergencyBloodRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [componentFilter, setComponentFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const [bloodComponents, setBloodComponents] = useState<any[]>([]);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/emergency-blood-requests");
      setRequests(res.data.records || []);
    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [componentsRes, groupsRes] = await Promise.all([
        axiosInstance.get("/summary/all-components"),
        axiosInstance.get("/summary/all-blood-groups"),
      ]);
      setBloodComponents(componentsRes.data || []);
      setBloodGroups(groupsRes.data || []);
    } catch (error) {
      console.error("Error loading filters", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFilters();
  }, []);

  const filtered = requests.filter((r) => {
    const matchComponent =
      componentFilter === "all" || r.bloodComponent?.id === componentFilter;
    const matchGroup =
      groupFilter === "all" || r.bloodGroup?.id === groupFilter;
    return matchComponent && matchGroup;
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Danh sách yêu cầu xuất máu khẩn cấp</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Select value={componentFilter} onValueChange={setComponentFilter}>
            <SelectTrigger className="w-56 pl-10">
              <SelectValue placeholder="Lọc theo loại chế phẩm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại chế phẩm</SelectItem>
              {bloodComponents.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-56 pl-10">
              <SelectValue placeholder="Lọc theo nhóm máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhóm máu</SelectItem>
              {bloodGroups.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Mã</th>
              <th className="px-4 py-2">Địa chỉ</th>
              <th className="px-4 py-2">Thể tích</th>
              <th className="px-4 py-2">Nhóm máu</th>
              <th className="px-4 py-2">Loại chế phẩm</th>
              <th className="px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{req.code}</td>
                  <td className="px-4 py-2">{req.address}</td>
                  <td className="px-4 py-2">{req.volume} ml</td>
                  <td className="px-4 py-2">{req.bloodGroup?.displayName}</td>
                  <td className="px-4 py-2">{req.bloodComponent?.name}</td>
                  <td className="px-4 py-2">
                    {req.status === 0
                      ? "Đang chờ"
                      : req.status === 2
                      ? "Đang xử lý"
                      : "Hoàn thành"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
