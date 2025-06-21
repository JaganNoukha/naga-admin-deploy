import axios from "axios";

const PERMISSIONS_ENDPOINT = process.env.NEXT_PUBLIC_USER_SERVICE_URL + '/permissions';

export const permissionsApi = {
  getAll: async (params?: { search?: string }) => {
    const response = await axios.get(PERMISSIONS_ENDPOINT, { params });
    return response.data;
  },

  getById: async (permissionId: string) => {
    const response = await axios.get(`${PERMISSIONS_ENDPOINT}/${permissionId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(PERMISSIONS_ENDPOINT, data);
    return response.data;
  },

  update: async (permissionId: string, data: any) => {
    const response = await axios.patch(`${PERMISSIONS_ENDPOINT}/${permissionId}`, data);
    return response.data;
  },

  delete: async (permissionId: string) => {
    const response = await axios.delete(`${PERMISSIONS_ENDPOINT}/${permissionId}`);
    return response.data;
  }
};
