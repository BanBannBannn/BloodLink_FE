import type { BlogPost } from "@/pages/admin/BlogManagement";
import apiClient from "./apiClient";

export const getAllAccount = async () => {
  return await apiClient.get("/user");
};

export const addUser = async (userData: FormData) => {
  return await apiClient.post("/user", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllBlogs = async () => {
  return await apiClient.get("/blogs");
};

export const uploadImage = async (image: File) => {
  return await apiClient.post(
    "/file",
    { File: image, Directory: "image" },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const addBlogs = async (blogData: BlogPost) => {
  return await apiClient.post("/blogs", blogData);
};

export const deleteBlog = async (blogId: string) => {
  return await apiClient.delete(`/blogs/${blogId}`);
};

export const updateBlog = async (
  blogId: string,
  blogData: Partial<BlogPost>
) => {
  return await apiClient.put(`/blogs/${blogId}`, blogData);
};

export const getBlogById = async (id: string) => {
  return await apiClient.get(`/blogs/${id}`);
};

export const banUserById = async (id: string) => {
  return await apiClient.put(`/user/${id}/ban`);
};
export const unbanUserById = async (id: string) => {
  return await apiClient.put(`/user/${id}/unban`);
};
