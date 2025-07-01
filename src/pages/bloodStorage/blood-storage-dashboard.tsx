"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Shield, AlertTriangle, XCircle } from "lucide-react";

// Import your actual API functions
import {
  getAllBloodGroupId,
  getAllComponentId,
  bloodStorangeSummary,
} from "@/api/summaryApi";

interface BloodComponent {
  id: string;
  name: string;
}

interface BloodGroup {
  id: string;
  displayName: string;
}

interface BloodVolumeStatistics {
  totalVolume: number;
  safeVolume: number;
  warningVolume: number;
  expiredVolume: number;
}

export default function BloodStorageDashboard() {
  const [statistics, setStatistics] = useState<BloodVolumeStatistics | null>(
    null
  );
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [components, setComponents] = useState<BloodComponent[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("all");
  const [selectedComponent, setSelectedComponent] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dropdown options
  useEffect(() => {
    const loadFilterOptions = async () => {
      setLoadingFilters(true);
      try {
        const [bloodGroupsResponse, componentsResponse] = await Promise.all([
          getAllBloodGroupId(),
          getAllComponentId(),
        ]);

        // Only extract id and displayName for blood groups
        const bloodGroupsData = bloodGroupsResponse.data.map((bg: any) => ({
          id: bg.id,
          displayName: bg.displayName,
        }));

        // Only extract id and name for components
        const componentsData = componentsResponse.data.map((comp: any) => ({
          id: comp.id,
          name: comp.name,
        }));

        setBloodGroups(bloodGroupsData);
        setComponents(componentsData);
      } catch (err) {
        console.error("Error loading filter options:", err);
        setError("Không thể tải danh sách bộ lọc");
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Load statistics when filters change
  useEffect(() => {
    if (!loadingFilters) {
      fetchStatistics();
    }
  }, [selectedBloodGroup, selectedComponent, loadingFilters]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const bloodGroupId =
        selectedBloodGroup === "all" ? "" : selectedBloodGroup;
      const componentId = selectedComponent === "all" ? "" : selectedComponent;

      const response = await bloodStorangeSummary(bloodGroupId, componentId);
      setStatistics(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê kho máu");
      console.error("Error fetching storage statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBloodGroupChange = (value: string) => {
    setSelectedBloodGroup(value);
  };

  const handleComponentChange = (value: string) => {
    setSelectedComponent(value);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium">{error}</p>
              <Button
                onClick={fetchStatistics}
                className="mt-4 bg-transparent"
                variant="outline"
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kho máu</h1>
          <p className="text-gray-600 mt-1">
            Tổng quan về tình trạng kho máu theo nhóm máu và thành phần
          </p>
        </div>

        <Button
          onClick={fetchStatistics}
          variant="outline"
          disabled={loading || loadingFilters}
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhóm máu
          </label>
          <Select
            value={selectedBloodGroup}
            onValueChange={handleBloodGroupChange}
            disabled={loadingFilters}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhóm máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhóm máu</SelectItem>
              {bloodGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thành phần máu
          </label>
          <Select
            value={selectedComponent}
            onValueChange={handleComponentChange}
            disabled={loadingFilters}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thành phần máu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thành phần</SelectItem>
              {components.map((component) => (
                <SelectItem key={component.id} value={component.id}>
                  {component.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Volume */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng thể tích
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {loading ? "..." : `${statistics?.totalVolume || 0}ml`}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Tổng lượng máu trong kho
            </p>
          </CardContent>
        </Card>

        {/* Safe Volume */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Thể tích an toàn
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {loading ? "..." : `${statistics?.safeVolume || 0}ml`}
            </div>
            <p className="text-xs text-green-600 mt-1">Còn hạn sử dụng tốt</p>
          </CardContent>
        </Card>

        {/* Warning Volume */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Thể tích cảnh báo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {loading ? "..." : `${statistics?.warningVolume || 0}ml`}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Không đạt chuẩn</p>
          </CardContent>
        </Card>

        {/* Expired Volume */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Thể tích hết hạn
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {loading ? "..." : `${statistics?.expiredVolume || 0}ml`}
            </div>
            <p className="text-xs text-red-600 mt-1">Đã hết hạn sử dụng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
