"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Activity,
  Package,
  Droplets,
  RefreshCw,
  Shield,
  AlertTriangle,
  Package2,
} from "lucide-react";
import { getNurseDashboard, type NurseDashboardStats } from "@/api/nurseApi";

export default function CleanNurseDashboard() {
  // const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [dashboardData, setDashboardData] =
    useState<NurseDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lấy dữ liệu dashboard
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getNurseDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Lỗi khi lấy dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu
  useEffect(() => {
    fetchDashboard();
  }, []);
  const refreshDashboard = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  if (!dashboardData) return <div className="p-6">Đang tải dashboard...</div>;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tổng quan
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleTimeString("vi-VN")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={refreshDashboard}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Đăng ký hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {dashboardData.todayRegistrations.total}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-yellow-600">
                Chờ: {dashboardData.todayRegistrations.pending}
              </span>
              <span className="text-green-600">
                Duyệt: {dashboardData.todayRegistrations.approved}
              </span>
              <span className="text-red-600">
                Từ chối: {dashboardData.todayRegistrations.rejected}
              </span>
              <span className="text-green-600">
                Hoàn thành: {dashboardData.todayRegistrations.finished}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Tiến trình hiến máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">
              {dashboardData.bloodProcess.inProgress}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-yellow-600">Đang tiến hành</span>
              <span className="text-green-600">
                Hoàn thành: {dashboardData.bloodProcess.completedToday}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Yêu cầu xuất máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">
              {dashboardData.exportRequests.pending}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-yellow-600">Chờ duyệt</span>
              <span className="text-red-600">
                Tổng: {dashboardData.exportRequests.total}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Người hiến máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">
              {dashboardData.donors.total}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600">
                Mới: +{dashboardData.donors.newThisMonth}
              </span>
              <span className="text-green-600">tháng này</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Blood Distribution - Chi tiết */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-red-600" />
            Phân bố nhóm máu chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dashboardData.bloodDistribution.map((bloodType) => (
              <Card
                key={bloodType.type}
                // className={`border text-red-600 bg-red-50 border-red-200`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-red-600 bg-red-50 border-red-200 border font-bold text-lg px-3 py-1`}
                      >
                        {bloodType.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Thể tích */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Tổng thể tích:
                      </span>
                      <span className="font-semibold text-lg">
                        {bloodType.totalVolume}ml
                      </span>
                    </div>
                    An toàn vs Không an toàn
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          An toàn:
                        </span>
                        <span className="font-medium text-green-700">
                          {bloodType.safeVolume}ml
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Không đạt chuẩn:
                        </span>
                        <span className="font-medium text-red-700">
                          {bloodType.unsafeVolume}ml
                        </span>
                      </div>
                    </div>
                    {/* Số túi máu */}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Package2 className="h-3 w-3" />
                          Tổng túi:
                        </span>
                        <span className="font-semibold">
                          {bloodType.totalBags} túi
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">
                          An toàn: {bloodType.safeBags} túi
                        </span>
                        <span className="text-red-600">
                          Không đạt: {bloodType.unsafeBags} túi
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
