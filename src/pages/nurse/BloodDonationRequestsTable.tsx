import React, { useState } from "react";
import useBloodDonationRequests from "@/hooks/useBloodDonationRequests";
import HealthCheckFormModal from "./HealthCheckFormModal";
import { Calendar, Droplet, Filter, MoreHorizontal, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { bloodTypes } from "@/constants/constants";
import BloodStatisticsDashboard from "./blood-statistics-dashboard";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { isToday } from "date-fns";

export default function BloodDonationRequestsTable() {
  const { data, refresh } = useBloodDonationRequests();

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showHealthForm] = useState(false);

  const [viewHealthForm, setViewHealthForm] = useState<any | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // const [ setProcessingId] = useState<string | null>(null);
  const [medicalDeclaration, setMedicalDeclaration] = useState<any | null>(null);
  const [dateFilter, setDateFilter] = useState("all");



  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 8;

  // const handleReject = async (id: string) => {
  //   const rejectNote = prompt("Nhập lý do từ chối:");
  //   if (!rejectNote?.trim()) {
  //     setAlertMessage("Vui lòng nhập lý do từ chối để tiếp tục.");
  //     return;
  //   }

  //   setProcessingId(id);
  //   setAlertMessage(null);

  //   const isToday = (dateString: string) => {
  //     const date = new Date(dateString);
  //     const today = new Date();
  //     return (
  //       date.getFullYear() === today.getFullYear() &&
  //       date.getMonth() === today.getMonth() &&
  //       date.getDate() === today.getDate()
  //     );
  //   };

  //   try {
  //     await apiClient.put(
  //       `/blood-donation-requests/status/${id}?status=2&rejectNote=${encodeURIComponent(rejectNote.trim())}`
  //     );
  //     refresh();
  //   } catch (err: any) {
  //     const { message, detail } = err.response?.data || {};
  //     setAlertMessage(`${message || "Có lỗi xảy ra"}${detail ? `: ${detail}` : ""}`);
  //   } finally {
  //     setProcessingId(null);
  //   }
  // };

  // const handleApprove = async (id: string) => {
  //   setProcessingId(id);
  //   setAlertMessage(null);

  //   try {
  //     await apiClient.put(`/blood-donation-requests/status/${id}?status=1`);
  //     refresh();
  //   } catch (err: any) {
  //     const { message, detail } = err.response?.data || {};
  //     setAlertMessage(`${message || "Có lỗi xảy ra"}${detail ? `: ${detail}` : ""}`);
  //   } finally {
  //     setProcessingId(null);
  //   }
  // };

  const filteredData = data.filter((item) => {
    const matchStatus = statusFilter === "all" || `${item.status}` === statusFilter;
    const matchSearch = item.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    const donatedDate = new Date(item.donatedDateRequest);
    const today = new Date();
    const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let matchDate = true;
    if (dateFilter === "today") {
      matchDate = donatedDate.toDateString() === today.toDateString();
    } else if (dateFilter === "thisWeek") {
      matchDate = donatedDate >= startOfWeek && donatedDate <= today;
    } else if (dateFilter === "thisMonth") {
      matchDate = donatedDate >= startOfMonth && donatedDate <= today;
    }

    return matchStatus && matchSearch && matchDate;
  });


  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-600 font-medium text-sm">Đang chờ</span>;
      case 1:
        return <span className="text-green-600 font-medium text-sm">Đã duyệt</span>;
      case 2:
        return <span className="text-red-600 font-medium text-sm">Từ chối</span>;
      case 3:
        return <span className="text-gray-600 font-medium text-sm">Đã hủy</span>;
      case 4:
        return <span className="text-blue-600 font-medium text-sm">Đã hiến máu</span>;
      default:
        return <span>-</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <BloodStatisticsDashboard />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên người hiến..."
                value={searchQuery}
                onChange={(e) => {
                  setPageIndex(0);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Filter theo trạng thái */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v);
                setPageIndex(0);
              }}>
                <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="0">Đang chờ</SelectItem>
                  <SelectItem value="1">Đã duyệt</SelectItem>
                  <SelectItem value="2">Từ chối</SelectItem>
                  <SelectItem value="3">Đã hủy</SelectItem>
                  <SelectItem value="4">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter theo ngày hiến */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select value={dateFilter} onValueChange={(v) => {
                setDateFilter(v);
                setPageIndex(0);
              }}>
                <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Lọc theo ngày hiến máu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="thisWeek">Tuần này</SelectItem>
                  <SelectItem value="thisMonth">Tháng này</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <AlertDialog open={!!alertMessage} onOpenChange={(open) => !open && setAlertMessage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lỗi</AlertDialogTitle>
              <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertMessage(null)}>Đóng</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="bg-white rounded-lg shadow-sm border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="text-left px-6 py-3">Người hiến</th>
                <th className="text-center px-4 py-3">Nhóm máu</th>
                <th className="text-center px-4 py-3">Ngày hiến máu</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Khai báo y tế</th>
                <th className="text-center px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.fullName}</div>
                      <div className="text-xs text-gray-500">Mã: {item.code}</div>
                    </td>

                    <td className="text-center px-4 py-4">
                      <div className="inline-flex items-center gap-1 text-sm text-red-600 font-semibold">
                        <Droplet className="w-4 h-4" />
                        {bloodTypes[item.bloodType] || "-"}
                      </div>
                    </td>

                    <td className="text-center px-4 py-4 text-sm text-gray-700">
                      <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                      {new Date(item.donatedDateRequest).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="text-center px-4 py-4">
                      {renderStatus(item.status)}
                    </td>

                    <td className="text-center px-4 py-4">
                      <button
                        onClick={() => setMedicalDeclaration(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="w-5 h-5 inline" />
                      </button>
                    </td>
                    <td className="text-center px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {item.healthCheckForm ? (
                          <button
                            onClick={() => {
                              setSelectedRequest(item);
                              setViewHealthForm(item);
                            }}
                            title="Xem phiếu kiểm tra"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        ) : item.status === 0 && isToday(item.createdDate) ? (
                          <button
                            onClick={() => {
                              setSelectedRequest(item);
                              setViewHealthForm(item);
                            }}
                            className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-xs font-medium"
                          >
                            Điền form
                          </button>
                        ) : null}
                        <button
                          onClick={() =>
                            setExpandedRowId(expandedRowId === item.id ? null : item.id)
                          }
                          className="text-gray-500 hover:text-black"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable row */}
                  {expandedRowId === item.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center">
                              🧾 Chi tiết thông tin
                            </h3>
                            <p><strong>Họ tên:</strong> {item.fullName}</p>
                            <p><strong>Giới tính:</strong> {item.gender ? "Nam" : "Nữ"}</p>
                            <p><strong>Tuổi:</strong> {item.age || "-"}</p>
                            <p><strong>SDT:</strong> {item.phoneNo}</p>
                            <p><strong>Email:</strong> {item.email}</p>
                            <p><strong>Số cccd:</strong> {item.identityId}</p>
                            <p><strong>Địa chỉ:</strong> {item.addresss}</p>
                            <div>
                              <h3 className="text-sm font-semibold mb-2 text-gray-700">📌 Ghi chú</h3>
                              <p> <strong>{item.description}</strong></p>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700"> Hình ảnh CCCD</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="min-w-[300px]">
                                <img
                                  src={item.frontUrlIdentity}
                                  alt="CCCD mặt trước"
                                  className="w-full max-h-[250px] object-contain border rounded"
                                />
                                <p className="mt-1 text-sm text-center">CCCD mặt trước</p>
                              </div>
                              <div>
                                <img
                                  src={item.backUrlIdentity}
                                  alt="CCCD mặt sau"
                                  className="w-full max-h-[250px] object-contain border rounded"
                                />
                                <p className="mt-1 text-sm text-center">CCCD mặt sau</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
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
            <span>Trang {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize) || 1}</span>
            <button
              disabled={(pageIndex + 1) * pageSize >= filteredData.length}
              onClick={() => setPageIndex(pageIndex + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>

        {/* Modals */}
        {selectedRequest && showHealthForm && (
          <HealthCheckFormModal
            request={viewHealthForm}
            onClose={(shouldRefresh) => {
              setViewHealthForm(null);
              if (shouldRefresh) {
                refresh();
              }
            }}
          />
        )}

        {/* Khai báo y tế */}
        <AlertDialog open={!!medicalDeclaration} onOpenChange={(open) => !open && setMedicalDeclaration(null)}>
          <AlertDialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-lg font-bold text-center text-blue-900 border-b pb-3">
                Phiếu khai báo y tế
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                <div className="space-y-3">
                  {medicalDeclaration && (
                    <>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-blue-600 text-s font-semibold">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Truyền máu khi nằm chữa bệnh tại bệnh viện</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-s font-medium ${medicalDeclaration.hasBloodTransfusionHistory
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {medicalDeclaration.hasBloodTransfusionHistory ? "Có" : "Không"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-purple-600 text-s font-semibold">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Tình trạng sức khỏe gần đây</h4>
                            <p className="text-s text-gray-600 mb-2">Cảm, sốt, ho, hắt hơi sổ mũi và uống thuốc Aspirin, kháng sinh, Cortisol</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-s font-medium ${medicalDeclaration.hasRecentIllnessOrMedication
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {medicalDeclaration.hasRecentIllnessOrMedication ? "Có" : "Không"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg border-l-4 border-orange-400">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-orange-600 text-s font-semibold">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Tiểu phẫu và thủ thuật</h4>
                            <p className="text-s text-gray-600 mb-2">Vết cắt, kim châm, chảy máu do xăm hình, chích lễ, xỏ lỗ tai, nhổ/chữa răng</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-s font-medium ${medicalDeclaration.hasRecentSkinPenetrationOrSurgery
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {medicalDeclaration.hasRecentSkinPenetrationOrSurgery ? "Có" : "Không"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-lg border-l-4 border-red-400">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-red-600 text-s font-semibold">4</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Sử dụng chất kích thích</h4>
                            <p className="text-s text-gray-600 mb-2">Sử dụng ma túy</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-s font-medium ${medicalDeclaration.hasDrugInjectionHistory
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {medicalDeclaration.hasDrugInjectionHistory ? "Có" : "Không"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border-l-4 border-teal-400">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-teal-600 text-s font-semibold">5</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Lịch sử du lịch</h4>
                            <p className="text-s text-gray-600 mb-2">Sống, lưu lại hay du lịch đến vùng dịch tễ có sốt rét, sốt xuất huyết, sởi trong 3 tháng gần đây</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-s font-medium ${medicalDeclaration.hasVisitedEpidemicArea
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {medicalDeclaration.hasVisitedEpidemicArea ? "Có" : "Không"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 pt-3 border-t">
              <AlertDialogAction
                onClick={() => setMedicalDeclaration(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Đóng
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {viewHealthForm && selectedRequest && (
          <HealthCheckFormModal
            request={selectedRequest}
            onClose={(shouldRefresh) => {
              setSelectedRequest(null);
              setViewHealthForm(null);
              if (shouldRefresh) refresh(); 
            }}
          />
        )}
      </div>
    </div>
  );
}
