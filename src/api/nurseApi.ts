import apiClient from "./apiClient";

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