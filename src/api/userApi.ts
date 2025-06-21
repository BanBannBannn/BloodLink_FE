import apiClient from "./apiClient";

type BloodRequest = {
  bloodType: number;
  reasonReject: string;
  donatedDateRequest: string;
  timeSlot: number;
  hasBloodTransfusionHistory?: boolean;
  hasRecentIllnessOrMedication?: boolean;
  hasRecentSkinPenetrationOrSurgery?: boolean;
  hasDrugInjectionHistory?: boolean;
  hasVisitedEpidemicArea?: boolean;
};

export const bloodDonationRequest = async (bloodRequest: BloodRequest) => {
  const response = await apiClient.post(
    "/blood-donation-requests",
    bloodRequest
  );
  return response;
};

export const bloodRequestHistory = async () => {
  const response = await apiClient.get(
    "/blood-donation-requests/user-requests"
  );
  return response;
};

export const getUserInfo = async (id: string) => {
  const response = await apiClient.get(`/user/${id}`);
  return response;
};

export const cancelBloodRequest = async (id: string) => {
  const response = await apiClient.put(
    `/blood-donation-requests/status/${id}?status=3&rejectNote=`
  );
  return response;
};
