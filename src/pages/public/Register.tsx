import { registerApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { hcmDistricts } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z
  .object({
    FullName: z.string().min(1, "Không được để trống"),
    Email: z.string().email("Nhập email của bạn"),
    Password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
    Addresss: z.string().nonempty("Không được để trống"),
    PhoneNo: z
      .string()
      .nonempty("Không được để trống")
      .length(10, "Số điện thoại gồm 10 chữ số"),
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
  })
  .refine((data) => data.Password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [identityFrontPreview, setIdentityFrontPreview] = useState<string | null>(null);
  const [identityBackPreview, setIdentityBackPreview] = useState<string | null>(null);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      FullName: "",
      Email: "",
      Password: "",
      confirmPassword: "",
      Addresss: "",
      PhoneNo: "",
      RoleId: "",
      IdentityFront: undefined,
      IdentityBack: undefined,
      IdentityId: "",
      DateOfBirth: "",
      Gender: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading((prev) => !prev);
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSubmit } = data;
    // Add all form fields to FormData
    Object.entries(dataToSubmit).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === "Gender") {
        formData.append(key, value ? "true" : "false");
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await registerApi(formData);

    if (result.success) {
      toast.success("Đăng kí thành công");
      form.reset();
      setIsLoading((prev) => !prev);
      setIdentityFrontPreview(null);
      setIdentityBackPreview(null);
      navigate("/login");
      return;
    }
    setErrorMessage(result.message);
    setIsLoading((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="w-full max-w-2xl px-4 py-8">
        <Card className="w-full backdrop-blur-sm bg-white/90 shadow-2xl rounded-2xl border-0">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Đăng kí tài khoản
              </h1>
              <p className="text-gray-500 mt-2">
                Tạo tài khoản mới để tiếp tục
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-5 space-y-5"
              >
                <FormField
                  control={form.control}
                  name="IdentityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số CCCD</FormLabel>
                      <FormControl>
                        <Input
                          id="identityId"
                          type="text"
                          placeholder="1234567890"
                          onChange={field.onChange}
                          value={field.value}
                          className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="FullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và Tên</FormLabel>
                      <FormControl>
                        <Input
                          id="fullname"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          onChange={field.onChange}
                          value={field.value}
                          className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
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
                          id="email"
                          type="email"
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="nguyenvana@gmail.com"
                          className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
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
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full mt-1 h-11 rounded-lg border-gray-200 justify-between text-left font-normal",
                                form.formState.errors.DateOfBirth &&
                                  "border-red-500 ring-red-500"
                              )}
                            >
                              {field.value || "Chọn quận/huyện"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                            {hcmDistricts.map((district) => (
                              <DropdownMenuItem
                                key={district}
                                onSelect={() => field.onChange(district)}
                              >
                                {district}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                          id="password"
                          type="password"
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="*********"
                          className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="*********"
                          className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </FormControl>
                      <FormMessage />
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
                          id="phoneNo"
                          type="text"
                          placeholder="0909090909"
                          onChange={field.onChange}
                          value={field.value}
                          className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
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
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-full justify-between font-normal"
                            >
                              {field.value
                                ? format(new Date(field.value), "dd-MM-yyyy")
                                : "Chọn ngày sinh"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd") : ""
                                );
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="IdentityFront"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Ảnh CCCD mặt trước</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setIdentityFrontPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                          />
                          {identityFrontPreview && (
                            <img
                              src={identityFrontPreview}
                              alt="CCCD mặt trước"
                              className="mt-2 max-h-40 rounded border"
                            />
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="IdentityBack"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Ảnh CCCD mặt sau</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setIdentityBackPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                          />
                          {identityBackPreview && (
                            <img
                              src={identityBackPreview}
                              alt="CCCD mặt sau"
                              className="mt-2 max-h-40 rounded border"
                            />
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3 col-span-2">
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={
                            typeof field.value === "boolean"
                              ? String(field.value)
                              : ""
                          }
                          className="flex space-x-6"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" id="gender-male" />
                            </FormControl>
                            <FormLabel
                              htmlFor="gender-male"
                              className="font-normal"
                            >
                              Nam
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="false"
                                id="gender-female"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="gender-female"
                              className="font-normal"
                            >
                              Nữ
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="col-span-2 space-y-4">
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Đăng kí
                  </Button>

                  <div className="flex items-center justify-center gap-x-2">
                    <Separator className="flex-1" />
                    <span className="text-gray-500 whitespace-nowrap">
                      Hoặc
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <Button
                    type="button"
                    className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-200 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#fbc02d"
                        d="M43.6 20.5H42V20H24v8h11.3C33.2 32.4 29 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-3.5z"
                      />
                      <path
                        fill="#e53935"
                        d="M6.3 14.1l6.6 4.8C14.3 15.2 18.8 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.7 6.1 29.1 4 24 4 16.3 4 9.5 8.4 6.3 14.1z"
                      />
                      <path
                        fill="#4caf50"
                        d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.2-5.2C28.8 35.7 26.5 36 24 36c-5 0-9.2-3.5-10.7-8.1l-6.6 5.1C9.5 39.6 16.3 44 24 44z"
                      />
                      <path
                        fill="#1565c0"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.5-4.3 6.2-8.3 7.2l6.2 5.2C38.3 37.2 44 31.2 44 24c0-1.3-.1-2.7-.4-3.5z"
                      />
                    </svg>
                    Đăng nhập bằng Google
                  </Button>

                  <p className="text-center text-gray-600 mt-6">
                    Đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
