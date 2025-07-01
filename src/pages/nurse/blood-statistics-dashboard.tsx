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
import { Activity, Clock, CheckCircle, XCircle, Heart } from "lucide-react";
import { bloodRequestSummary } from "@/api/summaryApi";

interface BloodDonationStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  donated: number;
}

export default function BloodStatisticsDashboard() {
  const [statistics, setStatistics] = useState<BloodDonationStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<number>(3);

  const fetchStatistics = async (range: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bloodRequestSummary(range);
      setStatistics(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê");
      console.error("Error fetching statistics:", err);
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
      <div>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Danh sách yêu cầu hiến máu
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng quan về các yêu cầu hiến máu
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Total Requests */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng yêu cầu
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

        {/* Pending Requests */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Đang chờ duyệt
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {loading ? "..." : statistics?.pending || 0}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Cần xử lý</p>
          </CardContent>
        </Card>

        {/* Approved Requests */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đã duyệt
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {loading ? "..." : statistics?.approved || 0}
            </div>
            <p className="text-xs text-green-600 mt-1">Đã xử lí</p>
          </CardContent>
        </Card>

        {/* Rejected Requests */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Từ chối
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {loading ? "..." : statistics?.rejected || 0}
            </div>
            <p className="text-xs text-red-600 mt-1">Không phù hợp</p>
          </CardContent>
        </Card>

        {/* Donated */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Đã hiến máu
            </CardTitle>
            <Heart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {loading ? "..." : statistics?.donated || 0}
            </div>
            <p className="text-xs text-purple-600 mt-1">Đã hiến thành công</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
