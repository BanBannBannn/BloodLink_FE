import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface BloodHistoryEntry {
  id: string;
  bloodDonationRequest?: {
    fullName: string;
  };
  bloodType: number;
  donationDate: string;
  volume: number;
  status: number;
  description?: string;
}

export default function useBloodHistory() {
  const [data, setData] = useState<BloodHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/blood-donations/search", {
        params: {
          statuses: "1,3", 
        },
      });
      setData(response.data.records || []);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}