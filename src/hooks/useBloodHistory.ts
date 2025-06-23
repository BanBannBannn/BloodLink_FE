import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface BloodHistoryRecord {
  [x: string]: any;
  id: string;
  donationDate: string;
  bloodType: number;
  volume: number;
  fullName: string;
  status: number;
  description?: string;
}

export default function useBloodHistory() {
  const [data, setData] = useState<BloodHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/blood-donations/search");
        setData(res.data.records || []);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, loading,refresh: () => setData([...data]), error };
}
