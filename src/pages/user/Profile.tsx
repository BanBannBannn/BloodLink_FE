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
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  User
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  dateOfBirth: z.string(),
  bloodType: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
      phone: user?.phoneNo,
      address: user?.addresss,
      dateOfBirth: "2000-01-01",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    setIsEditing(false);
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
  }) => (
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
                  <Input {...field} className="mt-1" />
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
                  value={form.getValues("phone")}
                  name="phone"
                />
                <InfoRow
                  icon={MapPin}
                  label="Địa chỉ"
                  value={form.getValues("address")}
                  name="address"
                />
                <InfoRow
                  icon={Calendar}
                  label="Ngày sinh"
                  value={format(
                    new Date(form.getValues("dateOfBirth")),
                    "dd MMMM, yyyy",
                    {
                      locale: vi,
                    }
                  )}
                  name="dateOfBirth"
                />

                {isEditing && (
                  <div className="flex justify-end gap-4 mt-6 col-span-1 md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">Lưu thay đổi</Button>
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
