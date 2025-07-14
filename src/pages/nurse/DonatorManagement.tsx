"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Mail,
  Search,
  Filter,
  RefreshCw,
  Phone,
  MapPin,
  Droplets,
  Clock,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  getDonors,
  sendEmailToDonors,
  type DonorApiResponse,
  type DonorRecord,
} from "@/api/nurseApi";
import { getAllBloodGroupId, type BloodGroup } from "@/api/summaryApi";

// Processed donor interface for easier handling
interface ProcessedDonor {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodType: string;
  address: string;
  lastDonation: string;
  daysSinceLastDonation: number;
  status: "eligible" | "not_eligible" | "pending";
  gender: string;
  userStatus: string;
  dateOfBirth: string | null;
}

export default function DonorManagementPage() {
  const [donorData, setDonorData] = useState<DonorApiResponse>();
  const [processedDonors, setProcessedDonors] = useState<ProcessedDonor[]>([]);
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [bloodGroupMapping, setBloodGroupMapping] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("all");
  const [selectedAddress, setSelectedAddress] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [emailSending, setEmailSending] = useState(false);

  // Available addresses
  const addresses = [
    "Quận 1, TP.HCM",
    "Quận 2, TP.HCM",
    "Quận 3, TP.HCM",
    "Quận 4, TP.HCM",
    "Quận 5, TP.HCM",
    "Quận 6, TP.HCM",
    "Quận 7, TP.HCM",
    "Quận 8, TP.HCM",
    "Quận 9, TP.HCM",
    "Quận 10, TP.HCM",
    "Quận 11, TP.HCM",
    "Quận 12, TP.HCM",
    "Quận Tân Bình, TP.HCM",
    "Quận Tân Phú, TP.HCM",
    "Quận Bình Thạnh, TP.HCM",
    "Quận Phú Nhuận, TP.HCM",
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadBloodGroups();
  }, []);

  useEffect(() => {
    if (bloodGroups.length > 0) {
      fetchDonorData();
    }
  }, [
    currentPage,
    pageSize,
    searchTerm,
    selectedBloodType,
    selectedAddress,
    bloodGroups,
  ]);

  const loadBloodGroups = async () => {
    try {
      const response = await getAllBloodGroupId();
      const groups = response.data || response;
      setBloodGroups(groups);

      // Create mapping from display name to ID
      const mapping: Record<string, string> = {};
      groups.forEach((group: BloodGroup) => {
        mapping[group.displayName] = group.id;
      });
      setBloodGroupMapping(mapping);
    } catch (err) {
      console.error("Error loading blood groups:", err);
      setError("Không thể tải danh sách nhóm máu");
    }
  };

  const getBloodGroupIdByType = (bloodType: string): string => {
    return bloodGroupMapping[bloodType] || "";
  };

  const fetchDonorData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare API parameters
      const searchKey = searchTerm.trim() || null;
      const bloodGroupId =
        selectedBloodType !== "all"
          ? getBloodGroupIdByType(selectedBloodType)
          : null;
      const address = selectedAddress !== "all" ? selectedAddress : null;

      const response = await getDonors(
        searchKey,
        bloodGroupId,
        address,
        currentPage,
        pageSize
      );

      // Handle the response - it might be wrapped or direct
      const data = response;
      setDonorData(data);

      // Process donors for easier handling
      const processed: ProcessedDonor[] = data.records.map(
        (record: DonorRecord) => {
          const donor = record.user;
          const daysSince = record.lastDonationDaysAgo;

          return {
            id: donor.id,
            name: donor.fullName,
            phone: donor.phoneNo,
            email: donor.email,
            bloodType: donor.bloodGroupType,
            address: donor.addresss, // Note: API has typo
            lastDonation: new Date(record.lastDonationDate).toLocaleDateString(
              "vi-VN"
            ),
            daysSinceLastDonation: daysSince,
            status: getDonationStatus(daysSince),
            gender: donor.gender ? "Nam" : "Nữ",
            userStatus: donor.status,
            dateOfBirth: donor.dateOfBirth,
          };
        }
      );

      setProcessedDonors(processed);
    } catch (err) {
      console.error("Error fetching donor data:", err);
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  const getDonationStatus = (
    daysSince: number
  ): "eligible" | "not_eligible" | "pending" => {
    if (daysSince >= 90) return "eligible"; // Đủ điều kiện hiến
    //if (daysSince >= 56) return "pending"; // Sắp đủ điều kiện
    return "not_eligible"; // Chưa đủ điều kiện
  };

  const refreshData = async () => {
    await fetchDonorData();
  };

  // Apply client-side status filtering
  const filteredDonors = processedDonors.filter((donor) => {
    if (selectedStatus !== "all" && donor.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "eligible":
        return "bg-green-100 text-green-800";
      case "not_eligible":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "eligible":
        return "Đủ điều kiện";
      case "not_eligible":
        return "Chưa đủ điều kiện";
      case "pending":
        return "Sắp đủ điều kiện";
      default:
        return status;
    }
  };

  const getDaysSinceColor = (days: number) => {
    if (days >= 90) return "text-green-600 font-semibold";
    if (days >= 56) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const handleSelectDonor = (donorId: string) => {
    setSelectedDonors((prev) =>
      prev.includes(donorId)
        ? prev.filter((id) => id !== donorId)
        : [...prev, donorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDonors.length === filteredDonors.length) {
      setSelectedDonors([]);
    } else {
      setSelectedDonors(filteredDonors.map((donor) => donor.id));
    }
  };

  const handleSendEmail = async (donorIds: string[]) => {
    setEmailSending(true);
    try {
      await sendEmailToDonors({
        userIds: donorIds,
      });
      alert(`Đã gửi email kêu gọi hiến máu cho ${donorIds.length} người hiến!`);
      setSelectedDonors([]);
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Có lỗi xảy ra khi gửi email");
    } finally {
      setEmailSending(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBloodType("all");
    setSelectedAddress("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number.parseInt(newPageSize));
    setCurrentPage(1);
  };

  // Calculate statistics
  const stats = {
    total: donorData?.totalRecords || 0,
    eligible: filteredDonors.filter((d) => d.status === "eligible").length,
    notEligible: filteredDonors.filter((d) => d.status === "not_eligible")
      .length,
    pending: filteredDonors.filter((d) => d.status === "pending").length,
    canContact: filteredDonors.filter((d) => d.daysSinceLastDonation >= 90)
      .length,
    rareBloodTypes: filteredDonors.filter((d) =>
      ["O-", "AB-", "B-", "A-"].includes(d.bloodType)
    ).length,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!donorData && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý Người hiến máu
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleTimeString("vi-VN")}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {stats.total} người đã hiến trong hệ thống
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} disabled={loading} variant="outline">
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tổng số
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.total}
            </div>
            <div className="text-xs text-blue-600">người hiến</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Đủ điều kiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.eligible}
            </div>
            <div className="text-xs text-green-600">có thể hiến ngay</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Chưa đủ điều kiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {stats.notEligible}
            </div>
            <div className="text-xs text-red-600">cần chờ thêm</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Có thể liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {stats.canContact}
            </div>
            <div className="text-xs text-purple-600">≥90 ngày</div>
          </CardContent>
        </Card>
        <Card className="border-pink-200 bg-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-700 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Nhóm máu hiếm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">
              {stats.rareBloodTypes}
            </div>
            <div className="text-xs text-pink-600">O-, AB-, B-, A-</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Danh sách người hiến máu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedBloodType}
              onValueChange={setSelectedBloodType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm máu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhóm máu</SelectItem>
                {bloodGroups.map((group) => (
                  <SelectItem key={group.id} value={group.displayName}>
                    {group.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedAddress} onValueChange={setSelectedAddress}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn địa chỉ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả địa chỉ</SelectItem>
                {addresses.map((address) => (
                  <SelectItem key={address} value={address}>
                    {address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="eligible">Đủ điều kiện</SelectItem>
                <SelectItem value="not_eligible">Chưa đủ điều kiện</SelectItem>
                <SelectItem value="pending">Sắp đủ điều kiện</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / trang</SelectItem>
                <SelectItem value="20">20 / trang</SelectItem>
                <SelectItem value="50">50 / trang</SelectItem>
                <SelectItem value="100">100 / trang</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedDonors.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800 font-medium">
                  Đã chọn {selectedDonors.length} người hiến
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSendEmail(selectedDonors)}
                    disabled={emailSending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {emailSending ? "Đang gửi..." : "Gửi email hàng loạt"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDonors([])}
                  >
                    Bỏ chọn tất cả
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Donors Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">
                    <Checkbox
                      checked={
                        selectedDonors.length === filteredDonors.length &&
                        filteredDonors.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3 font-medium">
                    Thông tin cá nhân
                  </th>
                  <th className="text-left p-3 font-medium">Liên hệ</th>
                  <th className="text-left p-3 font-medium">Nhóm máu</th>
                  <th className="text-left p-3 font-medium">Địa chỉ</th>
                  <th className="text-left p-3 font-medium">Lần hiến cuối</th>
                  <th className="text-left p-3 font-medium">Số ngày</th>
                  <th className="text-left p-3 font-medium">Trạng thái</th>
                  <th className="text-left p-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedDonors.includes(donor.id)}
                        onCheckedChange={() => handleSelectDonor(donor.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {donor.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {donor.gender} • {donor.userStatus}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {donor.phone}
                        </div>
                        <div className="text-gray-600">{donor.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        className={`font-bold ${
                          ["O-", "AB-", "B-", "A-"].includes(donor.bloodType)
                            ? "bg-pink-100 text-pink-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donor.bloodType}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {donor.address}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{donor.lastDonation}</td>
                    <td className="p-3">
                      <span
                        className={`text-sm ${getDaysSinceColor(
                          donor.daysSinceLastDonation
                        )}`}
                      >
                        {donor.daysSinceLastDonation} ngày
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(donor.status)}>
                        {getStatusText(donor.status)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendEmail([donor.id])}
                          disabled={emailSending}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDonors.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người hiến máu
              </h3>
              <p>Không có người hiến máu nào phù hợp với bộ lọc hiện tại</p>
              <Button
                onClick={clearFilters}
                className="mt-4 bg-transparent"
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Pagination */}
          {donorData && donorData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                {Math.min(currentPage * pageSize, donorData.totalRecords)} của{" "}
                {donorData.totalRecords} người hiến
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <span className="text-sm">
                  Trang {currentPage} của {donorData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === donorData.totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-800">
                  Người hiến đủ điều kiện
                </h3>
                <p className="text-sm text-green-600">
                  Có thể gửi email kêu gọi ngay
                </p>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  const eligibleDonors = filteredDonors
                    .filter((d) => d.status === "eligible")
                    .map((d) => d.id);
                  if (eligibleDonors.length > 0) {
                    setSelectedDonors(eligibleDonors);
                  }
                }}
              >
                Chọn {stats.eligible} người
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-pink-200 bg-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-pink-800">Nhóm máu hiếm</h3>
                <p className="text-sm text-pink-600">
                  O-, AB-, B-, A- rất quý giá
                </p>
              </div>
              <Button
                size="sm"
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => {
                  const rareDonors = filteredDonors
                    .filter((d) =>
                      ["O-", "AB-", "B-", "A-"].includes(d.bloodType)
                    )
                    .map((d) => d.id);
                  if (rareDonors.length > 0) {
                    setSelectedDonors(rareDonors);
                  }
                }}
              >
                Chọn {stats.rareBloodTypes} người
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
