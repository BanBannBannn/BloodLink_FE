import React from "react";

interface BloodRaw {
  id: number;
  donorName: string;
  bloodGroup: string;
  volume: number;
  unit: string;
  donationDate: string;
  processed: boolean;
}

const mockData: BloodRaw[] = [
  {
    id: 1,
    donorName: " Aaaa",
    bloodGroup: "A+",
    volume: 350,
    unit: "ml",
    donationDate: "2025-06-02",
    processed: false,
  },
  {
    id: 2,
    donorName: " Bbbb",
    bloodGroup: "O-",
    volume: 400,
    unit: "ml",
    donationDate: "2025-06-01",
    processed: true,
  },
  {
    id: 3,
    donorName: " Cccc",
    bloodGroup: "B+",
    volume: 300,
    unit: "ml",
    donationDate: "2025-06-03",
    processed: false,
  },
];

export default function BloodRawTable() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách máu thô</h1>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Mã đơn vị máu</th>
            <th className="p-2">Người hiến máu</th>
            <th className="p-2">Nhóm máu</th>
            <th className="p-2">Thể tích</th>
            <th className="p-2">Ngày hiến</th>
            <th className="p-2">Trạng thái chế phẩm</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((blood) => (
            <tr key={blood.id} className="border-t text-center">
              <td className="p-2">{blood.id}</td>
              <td className="p-2">{blood.donorName}</td>
              <td className="p-2">{blood.bloodGroup}</td>
              <td className="p-2">
                {blood.volume} {blood.unit}
              </td>
              <td className="p-2">{blood.donationDate}</td>
              <td className={`p-2 ${blood.processed ? "text-green-600" : "text-yellow-600"}`}>
                {blood.processed ? "Đã chế phẩm" : "Chưa chế phẩm"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
