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
import { Activity, Clock, Heart, CheckCircle, XCircle } from "lucide-react";

// Import your actual API function
import { getSupervisorDonationSummary } from "@/api/summaryApi";

interface BloodDonationHistoryStatistics {
  total: number;
  inProgress: number;
  donated: number;
  checked: number;
}

export default function SupervisorDonationSummaryDashboard() {
  const [statistics, setStatistics] =
    useState<BloodDonationHistoryStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<number>(3);

  const fetchStatistics = async (range: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSupervisorDonationSummary(range);
      setStatistics(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê giám sát");
      console.error("Error fetching supervisor summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(selectedRange);
  }, [selectedRange]);

  const handleRangeChange = (value: string) => {
    const range = Number.parseInt(value);
    setSelectedRange(range);
  };

  const getRangeLabel = (range: number) => {
    switch (range) {
      case 0:
        return "Hôm nay";
      case 1:
        return "Tuần này";
      case 2:
        return "Tháng này";
      case 3:
        return "Tất cả";
      default:
        return "Tất cả";
    }
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
                onClick={() => fetchStatistics(selectedRange)}
                className="mt-4"
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
          <p className="text-gray-600 mt-1">
            Tổng quan về tình trạng hiến máu dành cho giám sát viên
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={selectedRange.toString()}
            onValueChange={handleRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Hôm nay</SelectItem>
              <SelectItem value="1">Tuần này</SelectItem>
              <SelectItem value="2">Tháng này</SelectItem>
              <SelectItem value="3">Tất cả</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => fetchStatistics(selectedRange)}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng số
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {loading ? "..." : statistics?.total || 0}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {getRangeLabel(selectedRange)}
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Đang hiến máu
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {loading ? "..." : statistics?.inProgress || 0}
            </div>
            <p className="text-xs text-orange-600 mt-1">Đang thực hiện</p>
          </CardContent>
        </Card>

        {/* Donated */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đã hiến máu
            </CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {loading ? "..." : statistics?.donated || 0}
            </div>
            <p className="text-xs text-green-600 mt-1">Chưa kiểm tra</p>
          </CardContent>
        </Card>

        {/* Checked */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Đã kiểm tra
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {loading ? "..." : statistics?.checked || 0}
            </div>
            <p className="text-xs text-purple-600 mt-1">Đã xác nhận</p>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}
