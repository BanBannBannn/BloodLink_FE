import type { ProfileFormData } from "@/pages/user/Profile";
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

export const getBlogs = async () => {
  return await apiClient.get("/blogs");
};

export const getBlogById = async (id: string) => {
  return await apiClient.get(`/blogs/${id}`);
};

export const uploadImage = async (image: File) => {
  return await apiClient.post(
    "/file",
    { File: image, Directory: "image" },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const updateUserInfo = async (
  userId: string,
  updatedData: Omit<ProfileFormData, 'gender'> & { gender: string | boolean }
) => {
  return await apiClient.put(`/user/${userId}`, updatedData);
};
