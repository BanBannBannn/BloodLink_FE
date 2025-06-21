import React from "react";

interface BloodHistory {
  id: number;
  type: "import" | "export";
  dateTime: string;
  bloodGroup: string;
  volume: number;
  unit: string;
  operator?: string;
  note?: string;
}

const mockData: BloodHistory[] = [
  {
    id: 1,
    type: "import",
    dateTime: "2025-06-02 09:00",
    bloodGroup: "A+",
    volume: 300,
    unit: "ml",
    operator: " Aaaa",
    note: "Hiến máu",
  },
  {
    id: 2,
    type: "export",
    dateTime: "2025-06-03 14:30",
    bloodGroup: "O-",
    volume: 200,
    unit: "ml",
    operator: " Bbbbb",
    note: "",
  },
  {
    id: 3,
    type: "import",
    dateTime: "2025-06-04 10:00",
    bloodGroup: "B+",
    volume: 250,
    unit: "ml",
    operator: " Cccc",
    note: "",
  },
];

export default function BloodHistoryTable() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lịch sử xuất nhập máu</h1>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Mã phiếu</th>
            <th className="p-2">Loại</th>
            <th className="p-2">Ngày giờ</th>
            <th className="p-2">Nhóm máu</th>
            <th className="p-2">Thể tích</th>
            <th className="p-2">Người thực hiện</th>
            <th className="p-2">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((entry) => (
            <tr key={entry.id} className="border-t text-center">
              <td className="p-2">{entry.id}</td>
              <td className={`p-2 ${entry.type === "import" ? "text-green-600" : "text-red-600"}`}>
                {entry.type === "import" ? "Nhập" : "Xuất"}
              </td>
              <td className="p-2">{entry.dateTime}</td>
              <td className="p-2">{entry.bloodGroup}</td>
              <td className="p-2">
                {entry.volume} {entry.unit}
              </td>
              <td className="p-2">{entry.operator || "-"}</td>
              <td className="p-2">{entry.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

