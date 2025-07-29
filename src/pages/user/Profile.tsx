import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImage, updateUserInfo, getUserInfo } from "@/api/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import { Calendar, Edit, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/toast";

const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNo: z.string().regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
  addresss: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  dateOfBirth: z.string(),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  identityId: z.string().min(9, "CMND/CCCD phải có ít nhất 9 ký tự"),
  backUrlIdentity: z.string(),
  frontUrlIdentity: z.string(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  // State để lưu file ảnh tạm thời
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  // State cho popover ngày sinh
  const [dobOpen, setDobOpen] = useState(false);
  const toast = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
      phoneNo: user?.phoneNo,
      addresss: user?.addresss,
      dateOfBirth: user?.dateOfBirth,
      gender: user?.gender !== undefined ? String(user?.gender) : "",
      identityId: user?.identityId,
      backUrlIdentity: user?.backUrlIdentity,
      frontUrlIdentity: user?.frontUrlIdentity,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      let frontUrl = data.frontUrlIdentity;
      let backUrl = data.backUrlIdentity;
      // Nếu có file mới thì upload lấy url
      if (frontImage) {
        const res = await uploadImage(frontImage);
        frontUrl = res.data.fileUrl;
      }
      if (backImage) {
        const res = await uploadImage(backImage);
        backUrl = res.data.fileUrl;
      }
      // Chuyển gender về boolean
      const genderBool = data.gender === "true";
      // Chuẩn bị dữ liệu update
      const updatedData = {
        ...data,
        gender: genderBool,
        frontUrlIdentity: frontUrl,
        backUrlIdentity: backUrl,
      };
      // Lấy userId từ context
      const userId = user?.id;
      if (!userId) throw new Error("Không tìm thấy userId");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateUserInfo(userId, updatedData as any);
      // Lấy lại thông tin user mới nhất và cập nhật vào context
      const response = await getUserInfo(userId);
      if (response.data) {
        setUser(response.data);
      }
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
      console.log(error);
    }
    setLoading(false);
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    name,
  }: {
    icon: LucideIcon;
    label: string;
    value: string;
    name: keyof ProfileFormData;
  }) => {
    // Custom render cho 2 field ảnh
    if (name === "frontUrlIdentity" || name === "backUrlIdentity") {
      const isFront = name === "frontUrlIdentity";
      const preview = isFront ? frontPreview : backPreview;
      const url = value;
      return (
        <div className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    if (isFront) setFrontImage(f);
                    else setBackImage(f);
                  }}
                />
                {(preview || url) && (
                  <img
                    src={preview || url}
                    alt={label}
                    className="max-h-40 rounded border object-contain"
                  />
                )}
              </div>
            ) : url ? (
              <img
                src={url}
                alt={label}
                className="max-h-40 rounded border object-contain mt-1"
              />
            ) : (
              <p className="text-gray-400 mt-1">Chưa có ảnh</p>
            )}
          </div>
        </div>
      );
    }
    // Custom render cho ngày sinh
    if (name === "dateOfBirth") {
      return (
        <div className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isEditing ? (
              <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover open={dobOpen} onOpenChange={setDobOpen}>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            className="mt-1 w-full justify-between font-normal"
                            type="button"
                            id={field.name}
                          >
                            {field.value
                              ? format(new Date(field.value), "dd/MM/yyyy")
                              : "Chọn ngày sinh"}
                            <CalendarIcon className="ml-2 w-4 h-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarPicker
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              );
                              setDobOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <p className="text-gray-900 mt-1">{value}</p>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-start gap-4 py-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing && name !== "email" ? (
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {name === "gender" ? (
                      <select
                        {...field}
                        className="mt-1 w-full border rounded px-2 py-2"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                      </select>
                    ) : name === "identityId" ? (
                      <Input {...field} className="mt-1" />
                    ) : (
                      <Input {...field} className="mt-1" />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <p className="text-gray-900 mt-1">{value}</p>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!isEditing) {
      setFrontImage(null);
      setBackImage(null);
      setFrontPreview(null);
      setBackPreview(null);
      form.reset({
        fullName: user?.fullName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        addresss: user?.addresss,
        dateOfBirth: user?.dateOfBirth,
        gender: user?.gender !== undefined ? String(user?.gender) : "",
        identityId: user?.identityId,
        backUrlIdentity: user?.backUrlIdentity,
        frontUrlIdentity: user?.frontUrlIdentity,
      });
    }
  }, [
    form,
    isEditing,
    user?.addresss,
    user?.backUrlIdentity,
    user?.dateOfBirth,
    user?.email,
    user?.frontUrlIdentity,
    user?.fullName,
    user?.gender,
    user?.identityId,
    user?.phoneNo,
  ]);

  useEffect(() => {
    if (frontImage) {
      const url = URL.createObjectURL(frontImage);
      setFrontPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFrontPreview(null);
    }
  }, [frontImage]);

  useEffect(() => {
    if (backImage) {
      const url = URL.createObjectURL(backImage);
      setBackPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBackPreview(null);
    }
  }, [backImage]);

  useEffect(() => {
    const getUserInformation = async () => {
      try {
        const userId = user?.id;
        const response = await getUserInfo(userId!);
        form.reset({
          fullName: response.data?.fullName,
          email: response.data?.email,
          phoneNo: response.data?.phoneNo,
          addresss: response.data?.addresss,
          dateOfBirth: response.data?.dateOfBirth,
          gender:
            response.data?.gender !== undefined
              ? String(response.data?.gender)
              : "",
          identityId: response.data?.identityId,
          backUrlIdentity: response.data?.backUrlIdentity,
          frontUrlIdentity: response.data?.frontUrlIdentity,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getUserInformation();
  }, [form, loading, user?.id]);

  return (
    <div className="h-full bg-gray-50 py-8 px-4 md:px-8 flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Quản lý thông tin cá nhân của bạn
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  if (isEditing) {
                    form.handleSubmit(onSubmit)();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                <Edit className="w-4 h-4" />
                {isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <InfoRow
                  icon={User}
                  label="Họ và tên"
                  value={form.getValues("fullName")}
                  name="fullName"
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={form.getValues("email")}
                  name="email"
                />
                <InfoRow
                  icon={Phone}
                  label="Số điện thoại"
                  value={form.getValues("phoneNo")}
                  name="phoneNo"
                />
                <InfoRow
                  icon={MapPin}
                  label="Địa chỉ"
                  value={form.getValues("addresss")}
                  name="addresss"
                />
                <InfoRow
                  icon={Calendar}
                  label="Ngày sinh"
                  value={format(
                    new Date(form.getValues("dateOfBirth")),
                    "dd/MM/yyyy",
                    {
                      locale: vi,
                    }
                  )}
                  name="dateOfBirth"
                />
                <InfoRow
                  icon={User}
                  label="Giới tính"
                  value={
                    form.getValues("gender") === "true"
                      ? "Nam"
                      : form.getValues("gender") === "false"
                      ? "Nữ"
                      : ""
                  }
                  name="gender"
                />
                <InfoRow
                  icon={User}
                  label="CMND/CCCD"
                  value={form.getValues("identityId")}
                  name="identityId"
                />
                <InfoRow
                  icon={User}
                  label="Ảnh mặt trước giấy tờ"
                  value={form.getValues("frontUrlIdentity")}
                  name="frontUrlIdentity"
                />
                <InfoRow
                  icon={User}
                  label="Ảnh mặt sau giấy tờ"
                  value={form.getValues("backUrlIdentity")}
                  name="backUrlIdentity"
                />

                {isEditing && (
                  <div className="flex justify-end gap-4 mt-6 col-span-1 md:col-span-2 cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
