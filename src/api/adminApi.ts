import apiClient from "./apiClient";

export const getAllAccount = async () => {
  return await apiClient.get("/user");
};

export const addUser = async (userData: FormData) => {
  return await apiClient.post("/user", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
