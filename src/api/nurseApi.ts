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
