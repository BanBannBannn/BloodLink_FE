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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, Plus, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  addBlogs,
  deleteBlog,
  getAllBlogs,
  uploadImage,
  updateBlog,
} from "@/api/adminApi";

export interface BlogPost {
  id?: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
}

const createBlogSchema = z.object({
  title: z.string().trim().min(1, "Không được để trống"),
  summary: z.string().trim().min(1, "Không được để trống"),
  content: z.string().trim().min(1, "Không được để trống"),
  image: z.instanceof(File, { message: "Vui lòng chọn ảnh" }),
});

const editBlogSchema = z.object({
  title: z.string().trim().min(1, "Không được để trống"),
  summary: z.string().trim().min(1, "Không được để trống"),
  content: z.string().trim().min(1, "Không được để trống"),
  image: z.instanceof(File).optional(),
});

type BlogFormData =
  | z.infer<typeof createBlogSchema>
  | z.infer<typeof editBlogSchema>;

// Utility to strip HTML tags from a string
function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(editMode ? editBlogSchema : createBlogSchema),
    defaultValues: { title: "", summary: "", content: "", image: undefined },
  });

  const openEditDialog = (blog: BlogPost) => {
    setEditMode(true);
    setEditingBlog(blog);
    setOpen(true);
    form.reset({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      image: undefined,
    });
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      let uploadedImageUrl = editingBlog?.imageUrl || "";
      const updatePayload: Partial<BlogPost> = {
        title: data.title,
        summary: data.summary,
        content: data.content,
      };
      if (editMode && editingBlog) {
        if (data.image) {
          const responseUpLoadImage = await uploadImage(data.image);
          uploadedImageUrl = responseUpLoadImage.data.fileUrl as string;
          updatePayload.imageUrl = uploadedImageUrl;
        }
        const response = await updateBlog(editingBlog.id!, updatePayload);
        setBlogs((prev) =>
          prev.map((b) => (b.id === editingBlog.id ? response.data : b))
        );
      } else {
        if (data.image) {
          const responseUpLoadImage = await uploadImage(data.image);
          uploadedImageUrl = responseUpLoadImage.data.fileUrl as string;
        }
        const response = await addBlogs({
          title: data.title,
          summary: data.summary,
          content: data.content,
          imageUrl: uploadedImageUrl,
        });
        const newBlog = response.data;
        setBlogs((prev) => [newBlog, ...prev]);
      }
      setOpen(false);
      setEditMode(false);
      setEditingBlog(null);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBlog = async (blog: BlogPost) => {
    try {
      if (!blogToDelete) {
        return;
      }
      await deleteBlog(blog.id!);
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getListBlog = async () => {
      try {
        const response = await getAllBlogs();
        console.log(response.data.records);
        setBlogs(response.data.records);
      } catch (error) {
        console.log(error);
      }
    };
    getListBlog();
  }, []);

  return (
    <div className="p-6 h-full flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">
          Quản lí bài viết
        </h1>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditMode(false);
              setEditingBlog(null);
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditMode(false);
                setEditingBlog(null);
                form.reset();
              }}
            >
              <Plus className="h-4 w-4" />
              Tạo bài viết mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
              </DialogTitle>
              <DialogDescription>
                {editMode
                  ? "Chỉnh sửa thông tin bài viết bên dưới."
                  : "Điền thông tin bài viết bên dưới."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề" {...field} />
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
                      <FormLabel>Tóm tắt</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tóm tắt" {...field} />
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
                      <FormLabel>Ảnh</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
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
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage className="mt-10" />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-15 flex">
                  <Button type="button" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Lưu</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg rounded-xl flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Danh sách bài viết
          </CardTitle>
          {/* <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-8 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div> */}
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Hình ảnh</TableHead>
                <TableHead className="font-semibold">Tiêu đề</TableHead>
                <TableHead className="font-semibold">Tóm tắt</TableHead>
                <TableHead className="font-semibold">Nội dung</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-32 text-muted-foreground"
                  >
                    Không có bài viết nào.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-slate-50">
                    <TableCell>
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.summary}</TableCell>
                    <TableCell>{stripHtml(blog.content)}</TableCell>
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
                            className="flex items-center gap-2"
                            onClick={() => openEditDialog(blog)}
                          >
                            <span>Chỉnh sửa</span>
                            <DropdownMenuShortcut>
                              <SquarePen className="h-4 w-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2"
                            onClick={() => {
                              setBlogToDelete(blog);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <span>Xóa</span>
                            <DropdownMenuShortcut>
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                form.reset();
                setDeleteDialogOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (blogToDelete) {
                  await handleDeleteBlog(blogToDelete);
                }
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
