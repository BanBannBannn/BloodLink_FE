import { getBlogById, updateBlog, uploadImage } from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const editBlogSchema = z.object({
  title: z.string().trim().min(1, "Không được để trống"),
  summary: z.string().trim().min(1, "Không được để trống"),
  content: z.string().trim().min(1, "Không được để trống"),
  image: z.instanceof(File).optional(),
});

type BlogFormData = z.infer<typeof editBlogSchema>;

const BlogEdit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // url ảnh hiện tại
  const [preview, setPreview] = useState<string | null>(null); // preview ảnh mới
  const toast = useToast();
  const navigate = useNavigate();
  const form = useForm<BlogFormData>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: { title: "", summary: "", content: "", image: undefined },
  });

  useEffect(() => {
    const getBlog = async (id: string) => {
      setLoading(true);
      try {
        const res = await getBlogById(id);
        if (res.data) {
          form.reset({
            title: res.data.title,
            summary: res.data.summary,
            content: res.data.content,
            image: undefined,
          });
          setImageUrl(res.data.imageUrl || null);
          setPreview(null);
        } else {
          toast.error("Không tìm thấy bài viết");
          navigate("/admin/blog-management");
        }
      } catch {
        toast.error("Không tìm thấy bài viết");
        navigate("/admin/blog-management");
      }
      setLoading(false);
    };
    getBlog(id!);
  }, [form, id, navigate, toast]);

  // Khi chọn ảnh mới, tạo preview
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    onChange(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      let uploadedImageUrl = undefined;
      if (data.image) {
        const responseUpLoadImage = await uploadImage(data.image);
        uploadedImageUrl = responseUpLoadImage.data.fileUrl as string;
      }
      await updateBlog(id!, {
        title: data.title,
        summary: data.summary,
        content: data.content,
        ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
      });
      toast.success("Cập nhật bài viết thành công");
      setLoading(false);
      navigate("/admin/blog-management");
    } catch (error) {
      setLoading(false);
      toast.error("Cập nhật bài viết thất bại");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center bg-gradient-to-br from-red-50 via-white to-blue-50 py-5">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight underline-offset-8 decoration-2 decoration-red-400 drop-shadow-lg">
          Chỉnh sửa bài viết
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Tiêu đề
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề"
                      {...field}
                      className="rounded-lg shadow-sm focus:ring-2 focus:ring-red-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Tóm tắt
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tóm tắt"
                      {...field}
                      className="rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Ảnh (nếu muốn thay đổi)
                  </FormLabel>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                        className="rounded-lg shadow-sm bg-gray-50 border-gray-200 px-2 py-2"
                      />
                      {/* Hiển thị preview ảnh mới hoặc ảnh cũ */}
                      <div className="mt-2">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-40 rounded border object-contain"
                          />
                        ) : imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Ảnh hiện tại"
                            className="max-h-40 rounded border object-contain"
                          />
                        ) : null}
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Nội dung
                  </FormLabel>
                  <FormControl>
                    <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-white min-h-[180px] h-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 mt-8 justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/admin/blog-management")}
                disabled={loading}
                className="px-6 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-150"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all duration-150"
              >
                {loading ? "Đang cập nhật bài viết" : "Cập nhật bài viết"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BlogEdit;
