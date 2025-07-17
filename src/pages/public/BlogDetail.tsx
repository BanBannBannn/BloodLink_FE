import { getBlogById } from "@/api/userApi";
import { stripHtml } from "@/utils/validator";
import { format, isToday } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  createdDate: string;
}

const BlogDetail: React.FC = () => {
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getBlogDetail = async () => {
      try {
        setIsLoading(true);
        const response = await getBlogById(id!);
        const foundBlog = response.data;
        console.log(foundBlog);
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.log(error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getBlogDetail();
    }
  }, [id]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
        </motion.div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-8">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
            onClick={() => navigate("/blogs")}
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
          onClick={() => navigate("/blogs")}
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </motion.button>

        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="exit"
          transition={pageTransition}
          className="bg-white/90 backdrop-blur-sm rounded-t-3xl overflow-hidden"
        >
          <div className="relative">
            <motion.img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {isToday(new Date(blog.createdDate))
                    ? "Hôm nay"
                    : format(new Date(blog.createdDate), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
              {blog.title}
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            >
              <p className="text-lg leading-relaxed">
                {stripHtml(blog.content)}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
