import { loginApi, loginWithGoogleApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { auth, googleProvider } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().nonempty("Vui lòng nhập email").email("Email không hợp lệ"),
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await loginApi(data);
      login(result.user, result.token);
      setIsLoading(false);
      toast.success("Đăng nhập thành công");
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Email hoặc mật khẩu không đúng");
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await loginWithGoogleApi(idToken);
      login(response.data.user, response.data.token);
      setIsLoading(false);
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <CardContent>
          <h1 className="mb-4 text-3xl text-center font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Đăng nhập
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="example@gmail.com"
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
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Đăng nhập"}
            </Button>

            <div className="w-full flex items-center justify-center gap-x-2">
              <Separator className="flex-1" />
              <span className="text-gray-500 whitespace-nowrap">Hoặc</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              className="w-full bg-transparent border text-black hover:bg-gray-100 flex items-center justify-center"
              onClick={googleLogin}
              disabled={isLoading}
            >
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
              {isLoading ? "Đang gửi..." : "Đăng nhập bằng Google"}
            </Button>
            <p className="text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link
                to={"/register"}
                className="font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
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
