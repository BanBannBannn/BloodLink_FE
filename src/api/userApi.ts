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
