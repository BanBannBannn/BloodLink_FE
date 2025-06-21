import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "1. Ai có thể tham gia hiến máu?",
        answer: [
            "Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.",
            "Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.",
            "Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.",
            "Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.",
            "Có giấy tờ tùy thân.",
        ],
    },
    {
        question: "2. Ai là người không nên hiến máu?",
        answer: [
            "Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các vius lây qua đường truyền máu.",
            "Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày...",
        ],
    },
    {
        question: "3. Máu của tôi sẽ được làm những xét nghiệm gì?",
        answer: [
            "Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét.",
            "Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.",
        ],
    },
    {
        question: "4. Hiến máu có hại cho sức khỏe không?",
        answer: [
            "Hiến máu theo chỉ định của bác sĩ không có hại cho sức khỏe. Lượng máu đã hiến sẽ được cơ thể tái tạo lại nhanh chóng.",
        ],
    },
    {
        question: "5. Tôi cần chuẩn bị gì trước khi hiến máu?",
        answer: [
            "Đêm trước khi hiến máu cần ngủ đủ giấc.",
            "Ăn no, không uống rượu bia, cà phê.",
            "Mang theo giấy tờ tùy thân.",
        ],
    },
    {
        question: "6. Sau khi hiến máu cần làm gì?",
        answer: [
            "Nghỉ ngơi tại chỗ 15-20 phút.",
            "Uống nhiều nước để bổ sung lại lượng dịch đã mất.",
            "Tránh các hoạt động thể lực mạnh trong ngày đầu tiên sau khi hiến máu.",
        ],
    },
    {
        question: "7. Mất bao lâu để hiến máu?",
        answer: [
            "Quá trình hiến máu chỉ mất khoảng 5-10 phút. Toàn bộ quá trình từ đăng ký đến khi rời đi mất khoảng 1 giờ.",
        ],
    },
    {
        question: "8. Quyền lợi của người hiến máu là gì?",
        answer: [
            "Được khám và tư vấn sức khỏe miễn phí.",
            "Được bồi dưỡng một khoản nhỏ và nhận giấy chứng nhận hiến máu tình nguyện.",
        ],
    },
    {
        question: "9. Các nhóm máu phổ biến ở Việt Nam?",
        answer: [
            "Các nhóm máu phổ biến là O, A, B. Nhóm máu AB ít phổ biến hơn.",
        ],
    },
    {
        question: "10. Hiến máu ở đâu?",
        answer: [
            "Bạn có thể hiến máu tại các bệnh viện, trung tâm huyết học truyền máu, hoặc các điểm hiến máu lưu động.",
        ],
    },
    {
        question: "11. Lịch làm việc của trung tâm hiến máu?",
        answer: [
            "Các trung tâm thường làm việc vào giờ hành chính. Một số nơi có thể làm việc vào cuối tuần để thuận tiện cho người hiến máu.",
        ],
    },
    {
        question: "12. Có cần đặt lịch hẹn trước không?",
        answer: [
            "Việc đặt lịch hẹn trước được khuyến khích để đảm bảo quy trình diễn ra nhanh chóng và thuận lợi hơn.",
        ],
    },
    {
        question: "13. Tôi có được ăn uống trước khi hiến máu không?",
        answer: [
            "Có, bạn nên ăn nhẹ, tránh đồ ăn nhiều dầu mỡ trước khi hiến máu. Không nên để bụng đói.",
        ],
    },
    {
        question: "14. Giấy tờ cần mang theo khi đi hiến máu?",
        answer: [
            "Bạn cần mang theo Chứng minh nhân dân/Căn cước công dân hoặc giấy tờ tùy thân có ảnh khác.",
        ],
    },
    {
        question: "15. Khoảng cách giữa các lần hiến máu?",
        answer: [
            "Đối với hiến máu toàn phần, khoảng cách tối thiểu là 12 tuần.",
        ],
    },
    {
        question: "16. Hiến máu có được cấp giấy chứng nhận không?",
        answer: [
            "Có, bạn sẽ nhận được Giấy chứng nhận hiến máu tình nguyện. Giấy này có giá trị trong việc truyền máu miễn phí (bằng số lượng máu đã hiến) khi bạn cần.",
        ],
    },
    {
        question: "17. Máu của tôi sẽ được sử dụng như thế nào?",
        answer: [
            "Máu của bạn sẽ được xét nghiệm, tách thành các thành phần (hồng cầu, tiểu cầu, huyết tương) và cung cấp cho các bệnh nhân cần truyền máu.",
        ],
    },
];

const FAQ = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-red-600 sm:text-5xl">
                Những câu hỏi thường gặp
            </h1>
            <p className="mt-4 text-xl text-gray-600">
                Tìm câu trả lời cho những thắc mắc của bạn về việc hiến máu.
            </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {item.answer.map((line, i) => (
                            <li key={i}>{line}</li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ 