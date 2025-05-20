import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  identification: z
    .string()
    .min(12, "Căn cước công dân có 12 chữ số")
    .max(12, "Căn cước công dân có 12 chữ số")
    .regex(/^\d+$/, "Căn cước công dân chỉ được chứa số"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Đăng nhập với:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-xl">
        <CardContent>
          <h1 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h1>
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
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Đăng nhập
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
              Chưa có tài khoản?{" "}
              <Link className="hover:underline hover:text-blue-400" to={"/register"}>
                Đăng kí
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
