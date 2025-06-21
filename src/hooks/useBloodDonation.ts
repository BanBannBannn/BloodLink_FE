import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface BloodDonation {
  id: string;
  fullName: string;
  bloodType: number;
  status: number;
  reasonReject?: string;
  donatedDateRequest: string;
  healthCheckForm?: {
    volumeBloodDonated: number;
  };
}

interface FetchParams {
  donorName?: string;
  status?: number;
  dateTime?: string;
  pageIndex?: number;
  pageSize?: number;
}

export default function useBloodDonation(params: FetchParams = {}) {
  const [data, setData] = useState<BloodDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/blood-donations/search", {
          params,
        });
        setData(response.data.records || []);
        setTotalRecords(response.data.totalRecords || 0);
      } catch (err: any) {
        console.error("Fetch blood donations failed", err);
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(params)]); 

  return { data, loading, error, totalRecords };
}
