import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";


function HomePage() {

  return (
    <div className="h-full flex flex-col">
      <section className="w-full bg-red-50 py-16 px-6 md:px-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
          Hiến Máu Cứu Người – Một Giọt Máu Cho Đi, Một Cuộc Đời Ở Lại
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Tham gia cộng đồng hiến máu để cứu sống hàng ngàn người đang cần giúp
          đỡ.
        </p>
        <Button className="text-lg px-6 py-4">Đăng ký hiến máu</Button>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 px-6 md:px-20 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-6 text-red-600">
          Tại sao bạn nên hiến máu?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2 text-red-500">
                Cứu sống người khác
              </h3>
              <p>
                Hiến máu là hành động nhân văn, mỗi giọt máu bạn cho đi có thể
                cứu sống đến 3 người.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2 text-red-500">
                Cải thiện sức khỏe
              </h3>
              <p>
                Hiến máu đều đặn giúp cơ thể tái tạo máu tốt hơn và giảm nguy cơ
                mắc bệnh tim mạch.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2 text-red-500">
                Tăng kết nối cộng đồng
              </h3>
              <p>
                Góp phần tạo nên một xã hội khỏe mạnh, nhân ái và đầy yêu
                thương.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-red-600">
          Quy trình hiến máu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            "Đăng ký",
            "Khám sức khỏe",
            "Hiến máu",
            "Nhận quà & Giấy chứng nhận",
          ].map((step, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-red-500 mb-2">
                  Bước {index + 1}
                </div>
                <p>{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16 px-6 md:px-20 text-center text-white">
        <h2 className="text-3xl font-semibold mb-4">Sẵn sàng hiến máu?</h2>
        <p className="mb-6">
          Chỉ cần vài phút đăng ký, bạn có thể cứu được một mạng sống.
        </p>
        <Button className="bg-white text-red-600 hover:bg-gray-100">
          Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>
    </div>
  );
}

export default HomePage;
