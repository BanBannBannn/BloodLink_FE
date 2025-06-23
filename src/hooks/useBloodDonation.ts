import { useEffect, useState, useMemo } from "react";
import apiClient from "@/api/apiClient";
// import { ReactNode } from "react";

export interface BloodDonation {
  bloodDonationRequest: {
    fullName: string;
    gender: boolean;
    email?: string;
    addresss?: string;
    healthCheckForm?: {
      age?: number;
    };
  };
  donationDate: string | number | Date;
  volume: number;
  description: string;
  id: string;
  bloodType: number;
  status: number;
  reasonReject?: string;
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

  const queryParams = useMemo(() => ({ ...params }), [JSON.stringify(params)]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/api/blood-donations/search", {
          params: queryParams,
          signal: controller.signal,
        });
        setData(response.data.records || []);
        setTotalRecords(response.data.totalRecords || 0);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error("Fetch blood donations failed", err);
          setError(err.message || "Lỗi khi tải dữ liệu");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [queryParams]);

  return { data, loading, error, totalRecords, refresh: () => setData([...data]) };
}
