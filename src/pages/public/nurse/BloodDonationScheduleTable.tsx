import React from "react";

interface BloodDonationSchedule {
  id: number;
  donorName: string;
  bloodGroup: string;
  donationDate: string;
  note: string;
}

const mockData: BloodDonationSchedule[] = [
  { id: 1, donorName: "Nguyễn ", bloodGroup: "A+", donationDate: "2025-06-10", note: "" },
  { id: 2, donorName: "Nhân", bloodGroup: "O-", donationDate: "2025-06-12", note: "" },
  { id: 3, donorName: "Hưng", bloodGroup: "B+", donationDate: "2025-06-15", note: "" },
];

export default function BloodDonationScheduleTable() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Lịch hiến máu</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Mã lịch</th>
            <th className="p-2">Người hiến máu</th>
            <th className="p-2">Nhóm máu</th>
            <th className="p-2">Ngày hiến</th>
            <th className="p-2">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((schedule) => (
            <tr key={schedule.id} className="border-t text-center">
              <td className="p-2">{schedule.id}</td>
              <td className="p-2">{schedule.donorName}</td>
              <td className="p-2">{schedule.bloodGroup}</td>
              <td className="p-2">{schedule.donationDate}</td>
              <td className="p-2">{schedule.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
