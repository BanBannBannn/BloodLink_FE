import React from "react";

interface BloodComponent {
  id: number;
  bloodGroup: string;
  totalVolume: number;
  unit: string;
  component: string;
}

const mockData: BloodComponent[] = [
  { id: 1, bloodGroup: "A+", totalVolume: 200, unit: "ml", component: "1" },
  { id: 2, bloodGroup: "O-", totalVolume: 150, unit: "ml", component: "2" },
  { id: 3, bloodGroup: "B+", totalVolume: 100, unit: "ml", component: "3" },
];

export default function BloodComponentsTable() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách máu chế phẩm</h1>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">STT</th>
            <th className="p-2">Nhóm máu</th>
             <th className="p-2">Chế phẩm</th>
            <th className="p-2">Thể tích</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((item, index) => (
            <tr key={item.id} className="border-t text-center">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{item.bloodGroup}</td>
              <td className="p-2">{item.component}</td>
              <td className="p-2">{item.totalVolume} {item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
