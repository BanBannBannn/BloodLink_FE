import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Droplet,
  Filter,
  XCircle,
  CheckCircle2,
  Loader2,
  CalendarRange,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { bloodRequestHistory, cancelBloodRequest } from "@/api/userApi";
import { bloodTypes, timeSlots } from "@/constants/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import React from "react";

const STATUS_MAP = [
  {
    label: "Đang xử lý",
    color: "bg-yellow-100 text-yellow-800",
    icon: Loader2,
  },
  {
    label: "Đã duyệt",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  { label: "Đã từ chối", color: "bg-red-100 text-red-800", icon: XCircle },
  { label: "Đã hủy", color: "bg-gray-100 text-gray-800", icon: XCircle },
];

// Define type for donation record
interface BloodDonationRecord {
  id: string;
  userId: string;
  bloodType: number;
  status: number;
  reasonReject: string;
  donatedDateRequest: string;
  timeSlot: number;
  hasBloodTransfusionHistory: boolean;
  hasRecentIllnessOrMedication: boolean;
  hasRecentSkinPenetrationOrSurgery: boolean;
  hasDrugInjectionHistory: boolean;
  hasVisitedEpidemicArea: boolean;
  identityId: string;
  fullName: string;
  age: number;
  gender: boolean;
  phoneNo: string;
  email: string;
  addresss: string;
  healthCheckForm: unknown;
  bloodDonation: unknown;
  isDeleted: boolean;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
}

function BloodDonationHistoryPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [history, setHistory] = useState<BloodDonationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const toast = useToast();

  // Mở dialog xác nhận hủy
  const handleOpenCancelDialog = (id: string) => {
    setCancelId(id);
    setOpenDialog(true);
  };

  // Xác nhận hủy
  const handleConfirmCancel = async () => {
    if (cancelId) {
      try {
        const response = await cancelBloodRequest(cancelId);
        const updated = response.data;
        setHistory((prev) =>
          prev.map((item) =>
            item.id === updated.id ? { ...item, ...updated } : item
          )
        );
        toast.success("Hủy đăng ký thành công!");
      } catch {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
    setOpenDialog(false);
    setCancelId(null);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCancelId(null);
  };

  useEffect(() => {
    const getBloodHistory = async () => {
      try {
        setLoading(true);
        const response = await bloodRequestHistory();
        console.log(response.data.records);
        setHistory(response.data.records || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    getBloodHistory();
  }, []);

  const filteredHistory = history.filter((donation) => {
    if (selectedStatus === "all") return true;
    return donation.status === Number(selectedStatus);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-700 flex items-center gap-2">
              <Droplet className="w-8 h-8 text-red-500" /> Lịch sử hiến máu
            </h1>
            <p className="text-gray-500 mt-1">
              Xem lại các lần đăng ký hiến máu của bạn
            </p>
            <p className="mt-2 text-base font-semibold text-red-600">
              Tổng số lần đăng ký: {history.length}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="0">Đang xử lý</SelectItem>
                <SelectItem value="1">Đã duyệt</SelectItem>
                <SelectItem value="2">Đã từ chối</SelectItem>
                <SelectItem value="3">Đã hủy</SelectItem>
                <SelectItem value="4">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-red-500" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Không có lịch sử hiến máu.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.map((donation) => {
              const statusInfo = STATUS_MAP[donation.status] || STATUS_MAP[0];
              return (
                <Card
                  key={donation.id}
                  className="border border-red-200 bg-white p-0 rounded-xl transition-all duration-200 hover:shadow-lg hover:border-red-400 group"
                >
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white text-lg font-bold shadow-md border-4 border-white group-hover:border-red-200 transition-all">
                          {bloodTypes[donation.bloodType] || "?"}
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {donation.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusInfo.color} border border-opacity-30 border-red-300 group-hover:shadow-md transition-all`}
                        >
                          {React.createElement(statusInfo.icon, { className: "w-4 h-4" })} {statusInfo.label}
                        </span>
                        {donation.status === 0 && (
                          <button
                            className="ml-2 px-3 py-1 text-xs font-semibold rounded bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-all"
                            onClick={() => handleOpenCancelDialog(donation.id)}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarRange className="w-4 h-4 text-red-400" />
                      <span className="font-medium">Ngày đăng ký:</span>{" "}
                      {donation.createdDate &&
                        format(new Date(donation.createdDate), "dd/MM/yyyy")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarRange className="w-4 h-4 text-blue-400" />
                      <span className="font-medium">
                        Ngày dự kiến hiến máu:
                      </span>{" "}
                      {donation.donatedDateRequest &&
                        format(
                          new Date(donation.donatedDateRequest),
                          "dd/MM/yyyy"
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="font-medium">Khung giờ:</span>{" "}
                      {donation.timeSlot !== undefined &&
                        timeSlots[donation.timeSlot]}
                    </div>
                    {donation.status === 2 && donation.reasonReject && (
                      <div className="text-xs text-red-600 bg-red-50 rounded p-2 mt-1 border border-red-100">
                        Lý do từ chối: {donation.reasonReject}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-center text-red-500 font-medium opacity-80">
                      Cảm ơn bạn đã đóng góp cho cộng đồng!
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {/* Dialog xác nhận hủy */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận hủy đăng ký</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-700">
              Bạn có chắc chắn muốn hủy đăng ký hiến máu này?
            </div>
            <DialogFooter>
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 mr-2"
                onClick={handleCloseDialog}
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold"
                onClick={handleConfirmCancel}
                type="button"
              >
                Xác nhận hủy
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default BloodDonationHistoryPage;
