import { useEffect, useState, useMemo, useCallback } from "react";
import apiClient from "@/api/apiClient";

export interface BloodDonation {
  code: number;
  bloodDonationRequest: {
    code: string;
    frontUrlIdentity: any;
    backUrlIdentity: any;
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/blood-donations/search", {
        params: queryParams,
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
  }, [queryParams]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData();

    return () => controller.abort();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    totalRecords,
    refresh: fetchData, 
  };
}
