import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const registerSchema = z
  .object({
    identification: z
      .string()
      .length(12, "Căn cước công dân có 12 chữ số")
      .regex(/^\d+$/, "Căn cước công dân chỉ được chứa số"),
    fullname: z.string().min(1, "Không được để trống"),
    email: z.string().email("Nhập email của bạn"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .length(10, "Số điện thoại có 10 chữ số")
      .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Đăng kí với:", data);
  };

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const passwordMismatch =
    confirmPassword && password && password !== confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-xl">
        <CardContent>
          <h1 className="text-2xl font-semibold mb-6 text-center">Đăng kí</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="identification">Căn cước công dân</Label>
              <Input
                id="identification"
                {...register("identification")}
                placeholder="05621xxxxxxxx"
                className="mt-2"
              />
              {errors.identification && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.identification.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="fullname">Họ và Tên</Label>
              <Input
                id="fullname"
                type="text"
                {...register("fullname")}
                placeholder="Nguyễn Văn A"
                className="mt-2"
              />
              {errors.fullname && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="nguyenvana@gmail.com"
                className="mt-2"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="*********"
                className="mt-2"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="*********"
                className="mt-2"
              />
              {(errors.confirmPassword || passwordMismatch) && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword?.message ||
                    (passwordMismatch && "Mật khẩu xác nhận không khớp")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                type="text"
                {...register("phoneNumber")}
                placeholder="0952******"
                className="mt-2"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Đăng kí
            </Button>
            <div className="flex justify-between items-center gap-x-2">
              <div className="w-full h-1 bg-gray-200"></div>
              <span className="text-gray-400">Hoặc</span>
              <div className="w-full h-1 bg-gray-200"></div>
            </div>
            <Button className="w-full bg-transparent border text-black hover:bg-gray-100">
              <svg
                className="mr-2 h-5 w-5"
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
            <p className="text-center text-sm">
              Đã có tài khoản?{" "}
              <Link
                className="hover:underline hover:text-blue-400"
                to={"/login"}
              >
                Đăng nhập
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
