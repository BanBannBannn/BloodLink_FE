import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export default function useEmergencyRequests() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/emergency-blood-requests");
            setData(res.data);
        } catch (err: any) {
            setError(err.response?.data?.title || "Lỗi khi tải danh sách yêu cầu khẩn cấp.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refresh: fetchData };
}
