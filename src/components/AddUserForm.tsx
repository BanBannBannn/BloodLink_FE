import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { addUser } from "@/api/adminApi";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@/pages/admin/NurseManagement";

const AddUserSchema = z.object({
  FullName: z.string().min(1, "Không được để trống"),
  Email: z.string().email("Email không hợp lệ"),
  Password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  Addresss: z.string().nonempty("Không được để trống"),
  PhoneNo: z.string().nonempty("Không được để trống"),
  RoleId: z.string(),
  DateOfBirth: z.string().nonempty("Không được để trống"),
  Gender: z.boolean({ required_error: "Vui lòng chọn giới tính" }),
  IdentityFront: z.instanceof(File, {
    message: "Vui lòng tải lên ảnh CCCD mặt trước",
  }),
  IdentityBack: z.instanceof(File, {
    message: "Vui lòng tải lên ảnh CCCD mặt sau",
  }),
  IdentityId: z
    .string()
    .regex(/^\d+$/, "Số CCCD chỉ được chứa số")
    .length(12, "Số CCCD phải có 12 chữ số"),
});

type AddUserFormData = z.infer<typeof AddUserSchema>;

const genderOptions = [
  { label: "Nam", value: true },
  { label: "Nữ", value: false },
];

type AddUserProps = {
  roleId: string;
  onSuccess?: (newUser: User) => void;
};

const AddUserForm = (props: AddUserProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { success, error } = useToast();
  const form = useForm<AddUserFormData>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      FullName: "",
      Email: "",
      Password: "",
      Addresss: "",
      PhoneNo: "",
      RoleId: props.roleId,
      IdentityFront: undefined,
      IdentityBack: undefined,
      IdentityId: "",
      DateOfBirth: "",
      Gender: undefined,
    },
  });

  console.log(props.roleId);

  const onSubmit = async (data: AddUserFormData) => {
    setErrorMessage("");
    setLoading(true);
    const formData = new FormData();
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await addUser(formData);
      success("Tạo y tá thành công!");
      if (props.onSuccess) props.onSuccess(response.data);
      setLoading(false);
      form.reset();
    } catch (err: unknown) {
      error("Lỗi trong quá trình thêm y tá");
      console.log(err);
      if (err instanceof AxiosError) {
        setErrorMessage(
          err.response?.data?.message || "Lỗi trong quá trình thêm y tá"
        );
      }
      setErrorMessage("Lỗi trong quá trình thêm y tá");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="FullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập họ và tên"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="DateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input
                  id="dateOfBirth"
                  type="date"
                  onChange={field.onChange}
                  value={field.value}
                  className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="PhoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số điện thoại"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Addresss"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập địa chỉ"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="IdentityFront"
          render={({ field: { onChange, name } }) => (
            <FormItem>
              <FormLabel>Ảnh mặt trước CCCD</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  name={name}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="IdentityBack"
          render={({ field: { onChange, name } }) => (
            <FormItem>
              <FormLabel>Ảnh mặt sau CCCD</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  name={name}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="IdentityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số CCCD</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số CCCD"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Select
                  value={field.value === null ? undefined : String(field.value)}
                  onValueChange={(val) =>
                    field.onChange(
                      val === "true" ? true : val === "false" ? false : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem
                        key={String(option.value)}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="md:col-span-2 mt-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang gửi" : "Tạo tài khoản"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddUserForm;
