import React from "react";
import BloodDonationScheduleTable from "./BloodDonationScheduleTable";
import BloodDonateRequestStatusTable from "./BloodDonateRequestStatusTable";

export default function NurseDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Nurse Dashboard</h1>
      <div className="mb-6">
        <BloodDonationScheduleTable />
      </div>
      <div>
        <BloodDonateRequestStatusTable />
      </div>
    </div>
  );
}
