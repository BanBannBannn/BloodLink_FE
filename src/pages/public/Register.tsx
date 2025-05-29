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
    fullname: z.string().min(1, "Không được để trống"),
    email: z.string().email("Nhập email của bạn"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="w-full max-w-md px-4 py-8">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="fullname"
                    className="text-gray-700 font-medium"
                  >
                    Họ và Tên
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    {...register("fullname")}
                    placeholder="Nguyễn Văn A"
                    className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                  {errors.fullname && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="nguyenvana@gmail.com"
                    className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Mật khẩu
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="*********"
                    className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium"
                  >
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="*********"
                    className="mt-1 h-11 rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                  {(errors.confirmPassword || passwordMismatch) && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirmPassword?.message ||
                        (passwordMismatch && "Mật khẩu xác nhận không khớp")}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Đăng kí
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-500 bg-white">Hoặc</span>
                </div>
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
