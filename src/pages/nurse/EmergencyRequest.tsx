import {
  cancelEmergencyBloodRequest,
  createEmergencyBloodRequest,
  getEmergencyBloodRequests,
  updateEmergencyBloodRequest,
} from "@/api/nurseApi";
import { getAllBloodGroupId, getAllComponentId } from "@/api/summaryApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { statusMapEmergencyRequest } from "@/constants/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, SquarePen, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BloodStorageDashboard from "../bloodStorage/blood-storage-dashboard";

const exportRequestSchema = z.object({
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  volume: z.coerce.number().min(1, "Thể tích phải lớn hơn 0"),
  bloodComponentId: z.string().min(1, "Chọn thành phần máu"),
  bloodGroupId: z.string().min(1, "Chọn nhóm máu"),
});
export type ExportRequestFormValues = z.infer<typeof exportRequestSchema>;

export interface EmergencyBloodRequest {
  id: string;
  address: string;
  volume: number;
  bloodComponent: { id: string; name: string };
  bloodGroup: { id: string; displayName: string };
  status: number;
  code: string;
}

function EmergencyRequest() {
  const [requests, setRequests] = useState<EmergencyBloodRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<EmergencyBloodRequest | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [bloodComponents, setBloodComponents] = useState<
    { id: string; name: string }[]
  >([]);
  const [bloodGroups, setBloodGroups] = useState<
    { id: string; displayName: string }[]
  >([]);
  const toast = useToast();

  const form = useForm<ExportRequestFormValues>({
    resolver: zodResolver(exportRequestSchema),
    defaultValues: {
      address: "",
      volume: 0,
      bloodComponentId: "",
      bloodGroupId: "",
    },
  });

  const onSubmit = async (values: ExportRequestFormValues) => {
    try {
      if (selectedRequest) {
        await updateEmergencyBloodRequest(selectedRequest.id, values);
        toast.success("Cập nhật yêu cầu thành công");
        console.log("update");
      } else {
        await createEmergencyBloodRequest(values);
        toast.success("Tạo yêu cầu thành công!");
        console.log("create");
      }
      setOpen(false);
      form.reset();
      setLoading(true);
      getEmergencyBloodRequests(pageIndex, pageSize)
        .then((data) => {
          setRequests(data.records || []);
          setTotal(data.totalRecords || 0);
        })
        .finally(() => setLoading(false));
    } catch (err: unknown) {
      let msg = "Tạo yêu cầu thất bại";
      if (err && typeof err === "object" && "message" in err) {
        msg = (err as { message?: string }).message || msg;
      }
      toast.error(msg);
      console.log(err);
    }
  };

  const handleCanelRequest = async () => {
    setLoading(true);
    try {
      if (!selectedRequest) {
        setLoading(false);
        return;
      }
      await cancelEmergencyBloodRequest(selectedRequest);
      getEmergencyBloodRequests(pageIndex, pageSize)
        .then((data) => {
          setRequests(data.records || []);
          setTotal(data.totalRecords || 0);
        })
        .finally(() => setLoading(false));
      setLoading(false);
      setSelectedRequest(null);
      setOpenCancelDialog(false);

      toast.success("Hủy yêu cầu thành công");
    } catch (error) {
      toast.error("Hủy thất bại");
      console.log(error);
    }
  };

  useEffect(() => {
    getAllComponentId().then((res) => setBloodComponents(res.data));
    getAllBloodGroupId().then((res) => setBloodGroups(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getEmergencyBloodRequests(pageIndex, pageSize)
      .then((data) => {
        setRequests(data.records || []);
        setTotal(data.totalRecords || 0);
      })
      .finally(() => setLoading(false));
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (open) {
      if (selectedRequest) {
        form.reset({
          address: selectedRequest.address,
          volume: selectedRequest.volume,
          bloodComponentId: selectedRequest.bloodComponent.id,
          bloodGroupId: selectedRequest.bloodGroup.id,
        });
      } else {
        form.reset({
          address: "",
          volume: 0,
          bloodComponentId: "",
          bloodGroupId: "",
        });
      }
    }
  }, [open, selectedRequest, form]);

  console.log(requests);
  return (
    <div className="p-6 h-full flex-1 flex flex-col space-y-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <BloodStorageDashboard />
      <Card className="shadow-2xl border-blue-200/60 bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold drop-shadow-sm">
            Danh sách yêu cầu xuất máu
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg">+ Tạo yêu cầu xuất máu</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <button
                className="absolute right-4 top-4 rounded-full p-1 hover:bg-slate-100 focus:outline-none"
                type="button"
                aria-label="Đóng"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <DialogHeader>
                <DialogTitle>
                  {selectedRequest
                    ? "Chỉnh sửa yêu cầu xuất máu"
                    : "Tạo yêu cầu xuất máu"}
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin yêu cầu xuất máu.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập địa chỉ bệnh viện, nơi nhận máu..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thể tích (ml)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="Nhập thể tích máu (ml)"
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodComponentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thành phần máu</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Chọn thành phần máu"
                                className="overflow-ellipsis"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodComponents.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodGroupId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhóm máu</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhóm máu" />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodGroups.map((g) => (
                                <SelectItem key={g.id} value={g.id}>
                                  {g.displayName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading
                        ? selectedRequest
                          ? "Đang cập nhật"
                          : "Đang gửi"
                        : selectedRequest
                        ? "Cập nhật"
                        : "Tạo mới"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableCaption className="text-gray-500 pb-2">
              {requests.length === 0
                ? "Chưa có yêu cầu xuất máu nào."
                : "Danh sách các yêu cầu xuất máu gần đây."}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">STT</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thể tích (ml)</TableHead>
                <TableHead>Thành phần máu</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : (
                requests.length > 0 &&
                requests.map((req) => (
                  <TableRow
                    key={req.id}
                    className="hover:bg-blue-50/60 transition-colors rounded-lg"
                  >
                    <TableCell className="text-center font-semibold text-blue-600">
                      {req.code}
                    </TableCell>
                    <TableCell
                      className="max-w-[220px] truncate"
                      title={req.address}
                    >
                      {req.address}
                    </TableCell>
                    <TableCell>{req.volume}</TableCell>
                    <TableCell>{req.bloodComponent.name}</TableCell>
                    <TableCell>{req.bloodGroup.displayName}</TableCell>
                    <TableCell>
                      {statusMapEmergencyRequest[req.status] ?? req.status}
                    </TableCell>
                    {req.status === 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" asChild>
                              <div className="cursor-pointer">
                                <EllipsisVertical className="h-4 w-4" />
                              </div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(req);
                                setOpen(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <span>Chỉnh sửa</span>
                              <DropdownMenuShortcut>
                                <SquarePen className="h-4 w-4" />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(req);
                                setOpenCancelDialog(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <span>Hủy</span>
                              <DropdownMenuShortcut>
                                <Trash2 className="h-4 w-4" />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex w-full justify-between items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex === 1 || loading}
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
            >
              Trang trước
            </Button>
            <span>
              Trang {pageIndex} / {Math.ceil(total / pageSize) || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex >= Math.ceil(total / pageSize) || loading}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <DialogContent className="max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Xác nhận hủy</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn hủy yêu cầu này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setSelectedRequest(null);
                setOpenCancelDialog(false);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleCanelRequest}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmergencyRequest;
