import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export type EmergencyRequest = {
  id: string;
  code: string;
  status: number;
  address: string;
  volume: number;
  bloodGroup: {
    displayName: string;
    id: string;
  };
  bloodComponent: {
    name: string;
    id: string;
  };
};

export default function useEmergencyRequests() {
  const [data, setData] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/emergency-blood-requests");
      setData(res.data.records || []);
    } catch (err: any) {
      setError(
        err.response?.data?.title || "Lỗi khi tải danh sách yêu cầu khẩn cấp."
      );
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id: string) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`/emergency-blood-requests/${id}`, {
        status: 2,
      });
      setSuccessMessage("Đã duyệt yêu cầu xuất máu.");
      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.title ||
          "Có lỗi xảy ra khi duyệt yêu cầu xuất máu."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const rejectRequest = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`/emergency-blood-requests/${id}`, {
        status: 1,
        reasonReject: reason,
      });
      setSuccessMessage("Đã từ chối yêu cầu thành công.");
      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.title ||
          "Có lỗi xảy ra khi từ chối yêu cầu xuất máu."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const clearSuccess = () => setSuccessMessage(null);
  const clearError = () => setError(null);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    successMessage,
    actionLoading,
    refresh: fetchData,
    approveRequest,
    rejectRequest,
    clearSuccess,
    clearError,
  };
}
