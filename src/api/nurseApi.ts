
import type {
  EmergencyBloodRequest,
  ExportRequestFormValues,
} from "@/pages/nurse/EmergencyRequest";
import apiClient from "./apiClient";

// Lấy danh sách yêu cầu xuất máu khẩn cấp
export const getEmergencyBloodRequests = async (
  pageIndex = 1,
  pageSize = 10
) => {
  const response = await apiClient.get(
    `/emergency-blood-requests?pageIndex=${pageIndex}&pageSize=${pageSize}`
  );
  return response.data;
};

export const createEmergencyBloodRequest = async (
  data: ExportRequestFormValues
) => {
  const response = await apiClient.post("/emergency-blood-requests", data);
  return response.data;
};

export const cancelEmergencyBloodRequest = async (
  req: EmergencyBloodRequest
) => {
  const response = await apiClient.put(`/emergency-blood-requests/${req.id}`, {
    address: req.address,
    volume: req.volume,
    bloodComponentId: req.bloodComponent.id,
    bloodGroupId: req.bloodGroup.id,
    reasonReject: "",
    status: 4,
  });
  return response;
};

export const updateEmergencyBloodRequest = async (
  requestId: string,
  data: ExportRequestFormValues
) => {
  const response = await apiClient.put(
    `/emergency-blood-requests/${requestId}`,
    {
      address: data.address,
      volume: data.volume,
      bloodComponentId: data.bloodComponentId,
      bloodGroupId: data.bloodGroupId,
    }
  );
  return response;
};

// Donor related interfaces
export interface User {
  id: string
  email: string
  phoneNo: string
  addresss: string // Note: API has typo "addresss"
  frontUrlIdentity: string
  backUrlIdentity: string
  fullName: string
  identityId: string
  gender: boolean
  status: string
  roleId: string
  roleName: string
  bloodGroupId: string
  bloodGroupType: string
  dateOfBirth: string | null
}

export interface DonorRecord {
  user: User
  lastDonationDate: string
  lastDonationDaysAgo: number
}

export interface DonorApiResponse {
  totalRecords: number
  totalPages: number
  pageIndex: number
  pageSize: number
  records: DonorRecord[]
}

export interface SendEmailRequest {
  userIds: string[]
}


export const getDonors = async (
  searchKey: string | null,
  bloodGroupId: string | null,
  address: string | null,
  pageIndex = 1,
  pageSize = 10,
): Promise<DonorApiResponse> => {
  const params = new URLSearchParams()

  // Only add parameters if they have values
  if (searchKey) params.append("search", searchKey)
  if (bloodGroupId) params.append("bloodGroupId", bloodGroupId)
  if (address) params.append("address", address)

  // Always add pagination parameters
  params.append("pageIndex", pageIndex.toString())
  params.append("pageSize", pageSize.toString())

  const response = await apiClient.get(`/nurses/members?${params.toString()}`)
  return response.data
}


export const sendEmailToDonors = async (emailData: SendEmailRequest) => {
  const response = await apiClient.post("/nurses/send-mail", emailData)
  return response
}
export interface BloodDistributionItem {
  type: string
  totalVolume: number
  safeVolume: number
  unsafeVolume: number
  totalBags: number
  safeBags: number
  unsafeBags: number
}
export interface NurseDashboardStats {
  todayRegistrations: {
    total: number
    pending: number
    approved: number
    rejected: number
    finished: number
  }
  bloodProcess: {
    inProgress: number
    completedToday: number
  }
  exportRequests: {
    pending: number
    total: number
  }
  donors: {
    total: number
    newThisMonth: number
  }
    bloodDistribution: BloodDistributionItem[] 
}

export const getNurseDashboard = async (): Promise<NurseDashboardStats> => {
  const response = await apiClient.get<NurseDashboardStats>("/dashboards/nurse")
  return response.data
}