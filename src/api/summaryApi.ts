import apiClient from "./apiClient";

export interface BloodDonationStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  donated: number;
}

export interface BloodDonationHistoryStatistics {
  total: number;
  inProgress: number;
  donated: number;
  cancelled: number;
  checked: number;
}

export interface BloodComponent {
  id: string;
  name: string;
  minStorageTemerature: number;
  maxStorageTemerature: number;
  shelfLifeInDay: number;
  status: string;
  isDeleted: boolean;
  createdDate: string; // ISO format date
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
}

export interface BloodGroup {
  id: string;
  type: string;           // A, B, AB, O
  rhFactor: '+' | '-';    // Rhesus factor
  displayName: string;    // Ví dụ: "A+", "O-"
  isDeleted: boolean;
  createdDate: string;    // ISO date string
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
}

export interface BloodVolumeStatistics {
  totalVolume: number;
  safeVolume: number;
  warningVolume: number;
  expiredVolume: number;
}

export interface SupvisorBloodDonationHistoryStatistics {
  total: number
  inProgress: number
  donated: number
  checked: number
}
export const bloodRequestSummary = async (range : number = 0) => {
  const response = await apiClient.get(
    `/blood-donation-requests/summary?range=${range}`
  );
  return response;
};

export const bloodDonationSummary = async (range : number = 0) => {
  const response = await apiClient.get(
    `/blood-donations/summary?range=${range}`
  );
  return response;
};

export const getAllBloodGroupId = async () => {
  const response = await apiClient.get(
    "/blood-groups"
  );
  return response;
};

export const getAllComponentId = async () => {
  const response = await apiClient.get(
    "/blood-components"
  );
  return response;
};
export const bloodStorangeSummary = async (bloodGroupId : string | null, componentId : string | null) => {
  const response = await apiClient.get(
    `/blood-storage/volume-summary?bloodGroupId=${bloodGroupId}&componentId=${componentId}`
  );
  return response;
};

export const getSupervisorDonationSummary = async (range = 0) => {
  const response = await apiClient.get(`/blood-donations/supvisor-summary?range=${range}`)
  return response
}

// Tổng quan yêu cầu xuất máu 2
export interface ExportRequestStatsv2 {
  total: number;
  pending: number;
  processing: number;
  finished: number;
  rejected: number;
}

export const getSupervisorExportSummary = async (range = 0) => {
  const response = await apiClient.get(`/emergency-blood-requests/summary?range=${range}`)
  return response
}
