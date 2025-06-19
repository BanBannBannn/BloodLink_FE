import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Heart,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  Droplet,
  Scale,
  BadgeAlert,
  Wine,
  XCircle,
  CalendarRange,
  TestTubes,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-red-50 to-red-100 py-24 px-6 md:px-20 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-6 leading-tight">
            Hiến Máu Cứu Người
            <span className="block text-3xl md:text-4xl mt-2 text-gray-700">
              Một Giọt Máu Cho Đi, Một Cuộc Đời Ở Lại
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng hiến máu để cứu sống hàng ngàn người đang cần
            giúp đỡ.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/blood-donation")}
          >
            Đăng ký hiến máu ngay
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-300 rounded-full opacity-20" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-10" />
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-20 px-6 md:px-20 text-center bg-white">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
            Tại sao bạn nên
            <span className="text-red-600 ml-2">hiến máu?</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: "Cứu sống người khác",
              description:
                "Hiến máu là hành động nhân văn, mỗi giọt máu bạn cho đi có thể cứu sống đến 3 người.",
            },
            {
              icon: Activity,
              title: "Cải thiện sức khỏe",
              description:
                "Hiến máu đều đặn giúp cơ thể tái tạo máu tốt hơn và giảm nguy cơ mắc bệnh tim mạch.",
            },
            {
              icon: Users,
              title: "Tăng kết nối cộng đồng",
              description:
                "Góp phần tạo nên một xã hội khỏe mạnh, nhân ái và đầy yêu thương.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <item.icon className="w-12 h-12 text-red-500 mx-auto" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-6 md:px-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Quy trình
            <span className="text-red-600 ml-2">hiến máu</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { step: "Đăng ký", icon: Clock },
            { step: "Khám sức khỏe", icon: Activity },
            { step: "Hiến máu", icon: Droplet },
            { step: "Nhận quà & Giấy chứng nhận", icon: CheckCircle2 },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-xl font-semibold text-gray-800 mb-2">
                    Bước {index + 1}
                  </div>
                  <p className="text-gray-600">{item.step}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blood Donation Criteria Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Tiêu chuẩn
            <span className="text-red-600 ml-2">tham gia hiến máu</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: BadgeAlert,
              title: "Mang theo chứng minh nhân dân/hộ chiếu",
              description: "Cần có giấy tờ tùy thân hợp lệ khi đến hiến máu",
            },
            {
              icon: Wine,
              title: "Không nghiện ma túy, rượu bia và các chất kích thích",
              description: "Đảm bảo sức khỏe và chất lượng máu hiến tặng",
            },
            {
              icon: XCircle,
              title: "Không mắc các bệnh truyền nhiễm",
              description: "Không nhiễm HIV, viêm gan B, C và các virus lây qua đường truyền máu",
            },
            {
              icon: Scale,
              title: "Cân nặng phù hợp",
              description: "Nam ≥ 45 kg, Nữ ≥ 45 kg",
            },
            {
              icon: Activity,
              title: "Sức khỏe tốt",
              description: "Không mắc các bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, da",
            },
            {
              icon: TestTubes,
              title: "Chỉ số máu đạt yêu cầu",
              description: "Chỉ số huyết sắc tố (Hb) ≥120g/l (≥125g/l nếu hiến từ 350ml trở lên)",
            },
            {
              icon: Users,
              title: "Độ tuổi phù hợp",
              description: "Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi",
            },
            {
              icon: CalendarRange,
              title: "Thời gian giữa các lần hiến máu",
              description: "Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ",
            },
            {
              icon: CheckCircle2,
              title: "Kết quả test nhanh",
              description: "Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 py-20 px-6 md:px-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng hiến máu?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-red-100">
            Chỉ cần vài phút đăng ký, bạn có thể cứu được một mạng sống.
          </p>
          <Button
            size="lg"
            className="bg-white text-red-600 hover:bg-red-50 transition-all duration-300"
            onClick={() => navigate("/blood-donation")}
          >
            Bắt đầu ngay
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;
