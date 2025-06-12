import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface BloodDonationRequest {
  [x: string]: string;
  id: string;
  fullName: string;
  bloodType: number;
  status: number;
  donatedDateRequest: string;
  reasonReject?: string;
}

export default function useBloodDonationRequests() {
  const [data, setData] = useState<BloodDonationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/blood-donation-requests/search");
        setData(response.data.records || []);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error, refresh: () => window.location.reload() };
}
