import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export default function useAvailableBloods(emergencyRequestId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!emergencyRequestId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/api/blood-storage/available-bloods?emergencyBloodRequestId=${emergencyRequestId}`
      );
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.title || "Lỗi khi tải danh sách máu có thể xuất.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [emergencyRequestId]);

  return { data, loading, error, refresh: fetchData };
}
