import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Droplet,
  Clock,
  MapPinned,
  Search,
  CalendarRange,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data for donation history
const mockDonationHistory = [
  {
    id: 1,
    date: "2024-03-15",
    location: "Bệnh viện Bạch Mai",
    bloodType: "A+",
    amount: "350ml",
    status: "Hoàn thành",
    doctor: "BS. Nguyễn Văn A",
    nextDonationDate: "2024-06-15",
    hemoglobin: "14.5 g/dL",
    notes: "Hiến máu thành công, sức khỏe tốt",
  },
  {
    id: 2,
    date: "2023-12-20",
    location: "Viện Huyết học",
    bloodType: "A+",
    amount: "350ml",
    status: "Hoàn thành",
    doctor: "BS. Trần Thị B",
    nextDonationDate: "2024-03-20",
    hemoglobin: "13.8 g/dL",
    notes: "Hiến máu thành công, cần nghỉ ngơi nhiều",
  },
  {
    id: 3,
    date: "2023-09-05",
    location: "Bệnh viện Việt Đức",
    bloodType: "A+",
    amount: "350ml",
    status: "Hoàn thành",
    doctor: "BS. Lê Văn C",
    nextDonationDate: "2023-12-05",
    hemoglobin: "14.2 g/dL",
    notes: "Hiến máu thành công, uống nhiều nước",
  },
];

function BloodDonationHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all");

  const filteredHistory = mockDonationHistory.filter((donation) => {
    const matchesSearch = donation.location
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || donation.status === selectedStatus;
    const matchesBloodType =
      selectedBloodType === "all" || donation.bloodType === selectedBloodType;
    return matchesSearch && matchesStatus && matchesBloodType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch sử hiến máu</h1>
            <p className="text-gray-500 mt-1">
              Xem lại các lần hiến máu của bạn
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                <SelectItem value="Đã hủy">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Droplet className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Nhóm máu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredHistory.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side - Basic info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {donation.bloodType} • {donation.amount}
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {donation.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(new Date(donation.date), "dd MMMM, yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinned className="w-4 h-4" />
                        <span>{donation.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarRange className="w-4 h-4" />
                        <span>
                          Lần hiến tiếp theo:{" "}
                          {format(
                            new Date(donation.nextDonationDate),
                            "dd MMMM, yyyy",
                            { locale: vi }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Additional info */}
                  <div className="flex-1 border-t md:border-l md:border-t-0 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                    <h4 className="font-medium mb-2">Thông tin chi tiết</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Bác sĩ phụ trách:</dt>
                        <dd className="font-medium text-gray-900">
                          {donation.doctor}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Chỉ số Hemoglobin:</dt>
                        <dd className="font-medium text-gray-900">
                          {donation.hemoglobin}
                        </dd>
                      </div>
                      <div className="mt-3">
                        <dt className="text-gray-500 mb-1">Ghi chú:</dt>
                        <dd className="text-gray-900 bg-gray-50 p-3 rounded-md">
                          {donation.notes}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BloodDonationHistoryPage; 