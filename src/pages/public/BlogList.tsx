import React, { useEffect } from "react";
import { Card } from "../../components/ui/card";
import { getBlogs } from "@/api/userApi";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  createdDate: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await getBlogs();
        console.log(response.data);
        setBlogs(response.data.records);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những thông tin, câu chuyện và cập nhật về hiến máu và chăm
            sóc sức khỏe
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {blogs.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              whileHover="hover"
              className="group"
            >
              <Card className="h-full cursor-pointer border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 py-0">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isToday(new Date(post.createdDate))
                        ? "Hôm nay"
                        : format(new Date(post.createdDate), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
                    onClick={() => navigate(`/blogs/${post.id}`)}
                  >
                    Đọc thêm
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogList;
