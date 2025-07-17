import apiClient from "./apiClient";

// Một nhóm máu và thống kê đi kèm
export interface BloodDistribution {
  type: string;
  totalVolume: number;
  safeVolume: number;
  unsafeVolume: number;
  totalBags: number;
  safeBags: number;
  unsafeBags: number;
}

// Tổng quan máu đã nhận
export interface BloodReceivedStats {
  total: number;
  checked: number;
  unchecked: number;
  inProgress: number;
}

// Tổng quan yêu cầu xuất máu
export interface ExportRequestStats {
  pending: number;
  approved: number;
  finished: number;
  rejected: number;
  total: number;
}

// Toàn bộ dữ liệu dashboard của supervisor
export interface SupervisorDashboardResponse {
  bloodReceivedStats: BloodReceivedStats;
  exportRequestStats: ExportRequestStats;
  bloodDistribution: BloodDistribution[];
}

export const getSupvisorDashboard = async (): Promise<SupervisorDashboardResponse | null> => {
  const response = await apiClient.get<SupervisorDashboardResponse | null>("/dashboards/supervisor")
  return response.data
}

// Tổng quan yêu cầu xuất máu 2
export interface ExportRequestStatsv2 {
  total: number;
  pending: number;
  processing: number;
  finished: number;
  rejected: number;
}