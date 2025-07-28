import { deleteBlog, getAllBlogs } from "@/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { stripHtml } from "@/utils/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../../components/ui/button";

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

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  // const [open, setOpen] = useState(false); // Không còn dùng dialog chỉnh sửa
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Thêm state cho trang hiện tại
  const blogsPerPage = 6; // Số phần tử mỗi trang
  const navigate = useNavigate();
  const toast = useToast();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(selectedBlog ? editBlogSchema : createBlogSchema),
    defaultValues: { title: "", summary: "", content: "", image: undefined },
  });

  const handleDeleteBlog = async () => {
    setLoading(true);
    try {
      if (!selectedBlog) {
        return;
      }
      await deleteBlog(selectedBlog.id!);
      toast.success("Xóa bài viết thành công");
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const getListBlog = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogs();
        console.log(response.data.records);
        setBlogs(response.data.records);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getListBlog();
  }, []);

  // Tính toán các blog hiển thị trên trang hiện tại
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  useEffect(() => {
    if (selectedBlog) {
      form.reset({
        title: selectedBlog.title,
        summary: selectedBlog.summary,
        content: selectedBlog.content,
        image: undefined,
      });
    } else {
      form.reset({ title: "", summary: "", content: "", image: undefined });
    }
  }, [selectedBlog, form]);

  return (
    <div className="p-6 h-full flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">
          Quản lí bài viết
        </h1>

        <Button onClick={() => navigate("/admin/blog-management/create")}>
          Tạo bài viết
        </Button>
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
              {currentBlogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-32 text-muted-foreground"
                  >
                    Không có bài viết nào.
                  </TableCell>
                </TableRow>
              ) : (
                currentBlogs.map((blog) => (
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
                    <TableCell className="font-medium">
                      <div
                        title={blog.title}
                        style={{
                          maxWidth: 120,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                      >
                        {blog.title.length > 40 ? blog.title.slice(0, 40) + '...' : blog.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        title={blog.summary}
                        style={{
                          maxWidth: 160,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                      >
                        {blog.summary.length > 60 ? blog.summary.slice(0, 60) + '...' : blog.summary}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        title={stripHtml(blog.content)}
                        style={{
                          maxWidth: 180,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                      >
                        {stripHtml(blog.content).length > 80
                          ? stripHtml(blog.content).slice(0, 80) + '...'
                          : stripHtml(blog.content)}
                      </div>
                    </TableCell>
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
                            onClick={() =>
                              navigate(`/admin/blog-management/edit/${blog.id}`)
                            }
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
                              setSelectedBlog(blog);
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
        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className="px-3"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Sau
            </Button>
          </div>
        )}
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
              disabled={loading}
              variant="ghost"
              onClick={() => {
                setSelectedBlog(null);
                setDeleteDialogOpen(false);
              }}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDeleteBlog}
              disabled={loading}
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
